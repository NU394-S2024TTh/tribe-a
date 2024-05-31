// import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { BaseMessage } from '@langchain/core/messages';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { ChatOpenAI } from '@langchain/openai';
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
	where,
} from 'firebase/firestore';
import { LLMChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

import { db } from '../../firebase/firebase';

type Reviews = {
	[key: string]: {
		[key: string]: string | number | undefined; // This is the index signature
		author?: string;
		content?: string;
		created?: string;
		rating?: number;
		show?: string;
		source?: string;
		title?: string;
		type?: string;
	};
};

export default class ChatBot {
	textSplitter!: RecursiveCharacterTextSplitter;
	memory!: BufferMemory; // Buffer Memory for storing chat history
	chain!: RunnableSequence;

	async vectorDB_add(reviews: Reviews) {
		// Add the unseen reviews to the database
		const reviewsRef = await collection(db, 'Reviews');
		console.log('Adding reviews to the vectore database');
		console.log('# reviews', Object.keys(reviews).length);

		const unseen_reviews = [];

		// Get the unseen reviews
		for (const [key, review] of Object.entries(reviews)) {
			const entries = Object.entries(review);
			for (const [key, value] of entries) {
				// console.log(key, value);
				// remove the field with empty value
				const __entries = Object.entries(review);
				for (const [k, v] of __entries) {
					if (v === '') {
						delete review[k];
					}
				}
			}
			// alert(JSON.stringify(review));
			const review_str = JSON.stringify(review);
			// ignore the case where the query string is too long
			try {
				const q = query(reviewsRef, where('input', '==', review_str));
				const querySnapshot = await getDocs(q);
				if (querySnapshot.empty) {
					unseen_reviews.push(review);
				}
			} catch (error) {
				console.warn(error);
				// do nothing
			}
		}

		console.log('# unseen_reviews', unseen_reviews.length);
		alert('');

		unseen_reviews.forEach(async (review) => {
			// get stringified JSON-formatted review
			const review_str = JSON.stringify(review);

			// check if it already exists
			const q = query(reviewsRef, where('input', '==', review_str));
			const querySnapshot = await getDocs(q);

			// if it doesn't exist, add it
			if (querySnapshot.empty) {
				const docRef = await addDoc(reviewsRef, { input: review_str });
				console.log('Document written with ID: ', docRef.id);
			} else {
				console.log('Document already exists');
			}
		});
	}

	async vectorDB_search(s_query: string) {
		try {
			// Write a file to _firestore-vector-search/index/queries
			const query_ref = collection(db, '_firestore-vector-search/index/queries');
			const { id } = await addDoc(query_ref, { query: s_query, limit: 4 });

			// Polling mechanism to wait until the file contains the field "result"
			let query_result = null;
			const docRef = doc(db, '_firestore-vector-search/index/queries', id);
			while (query_result === null || query_result === undefined) {
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					query_result = docSnap.data().result;
					console.log('Document data:', docSnap.data());
				} else {
					console.log('Document does not exist');
				}

				// Wait for 5 seconds before polling again
				await new Promise((resolve) => setTimeout(resolve, 5000));
				console.log('waiting for query result');
			}

			console.log('query_result', query_result);
			return query_result.ids;
		} catch (error) {
			console.error('Error in vectorDB_search:', error);
			throw error; // Re-throw the error after logging it
		}
	}

	async get_relevant_documents(relevant_docs_id: Array<string>) {
		console.log('relevant_docs_id', relevant_docs_id);
		// Get the relevant documents from the database
		const docs = [];
		let doc_id;
		for (let index = 0; index < relevant_docs_id.length; index++) {
			doc_id = relevant_docs_id[index];
			const docRef = doc(db, 'Reviews/', doc_id);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				docs.push(docSnap.data().input);
			} else {
				console.log('No such document!');
			}
		}
		return docs;
	}

	async init_from_texts() {
		this.memory = new BufferMemory({
			memoryKey: 'chatHistory',
			inputKey: 'question', // The key for the input to the chain
			outputKey: 'text', // The key for the final conversational output of the chain
			returnMessages: true, // If using with a chat model (e.g. gpt-3.5 or gpt-4)
		});

		const serializeChatHistory = (chatHistory: Array<BaseMessage>): string =>
			chatHistory
				.map((chatMessage) => {
					if (chatMessage._getType() === 'human') {
						return `Human: ${chatMessage.content}`;
					} else if (chatMessage._getType() === 'ai') {
						return `Assistant: ${chatMessage.content}`;
					} else {
						return `${chatMessage.content}`;
					}
				})
				.join('\n');

		/**
		 * Create two prompt templates, one for answering questions, and one for
		 * generating questions.
		 */
		const questionPrompt = PromptTemplate.fromTemplate(
			`Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.
			----------
			CONTEXT: {context}
			----------
			CHAT HISTORY: {chatHistory}
			----------
			QUESTION: {question}
			----------
			Helpful Answer:`,
		);
		const questionGeneratorTemplate = PromptTemplate.fromTemplate(
			`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
			----------
			CHAT HISTORY: {chatHistory}
			----------
			FOLLOWUP QUESTION: {question}
			----------
			Standalone question:`,
		);

		// Initialize fast and slow LLMs, along with chains for each
		const fasterModel = new ChatOpenAI({
			model: 'gpt-3.5-turbo',
			apiKey: import.meta.env.VITE_OPENAI_API_KEY,
		});
		const fasterChain = new LLMChain({
			llm: fasterModel,
			prompt: questionGeneratorTemplate,
		});

		const slowerModel = new ChatOpenAI({
			model: 'gpt-4o',
			apiKey: import.meta.env.VITE_OPENAI_API_KEY,
		});
		const slowerChain = new LLMChain({
			llm: slowerModel,
			prompt: questionPrompt,
		});

		// Define the document type to suppress TypeScript errors for formatDocumentsAsString
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		// type Document<T = Record<string, any>> = T & {
		// 	pageContent: string;
		// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
		// 	metadata: Record<string, any>;
		// };

		// Define the function that will perform the question answering
		const performQuestionAnswering = async (input: {
			question: string;
			chatHistory: Array<BaseMessage> | null;
			context: Array<string>;
		}): Promise<{ result: string; sourceDocuments: Array<string> }> => {
			let newQuestion = input.question;
			// Serialize context and chat history into strings
			const serializedDocs = input.context.join('\n');
			const chatHistoryString = input.chatHistory
				? serializeChatHistory(input.chatHistory)
				: null;

			if (chatHistoryString) {
				// Call the faster chain to generate a new question
				const { text } = await fasterChain.invoke({
					chatHistory: chatHistoryString,
					context: serializedDocs,
					question: input.question,
				});

				newQuestion = text;
			}

			const response = await slowerChain.invoke({
				chatHistory: chatHistoryString ?? '',
				context: serializedDocs,
				question: newQuestion,
			});

			// Save the chat history to memory
			await this.memory.saveContext(
				{
					question: input.question,
				},
				{
					text: response.text,
				},
			);

			return {
				result: response.text,
				sourceDocuments: input.context,
			};
		};

		// Create a chain that pipes the question through the retriever and then the question answering function
		this.chain = RunnableSequence.from([
			{
				// Pipe the question through unchanged
				question: (input: { question: string }) => input.question,
				// Fetch the chat history, and return the history or null if not present
				chatHistory: async () => {
					const savedMemory = await this.memory.loadMemoryVariables({});
					const hasHistory = savedMemory.chatHistory.length > 0;
					return hasHistory ? savedMemory.chatHistory : null;
				},
				// Fetch relevant context based on the question
				context: async (input: { question: string }) => {
					const relevant_docs_id = await this.vectorDB_search(input.question);

					// get the relevant documents from relevant_docs_id
					const relevant_docs = await this.get_relevant_documents(relevant_docs_id);
					console.log('relevant_docs', relevant_docs);
					return relevant_docs;
				},
			},
			performQuestionAnswering,
		]);
		return this;
	}

	async ask_question(question: string) {
		const response = await this.chain.invoke({ question });
		return response;
	}

	async clear_chat_history() {
		return this.memory.clear();
	}

	async clear_all() {
		await this.clear_chat_history();
	}
}
