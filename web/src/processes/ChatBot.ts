// import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { BaseMessage } from '@langchain/core/messages';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { VectorStoreRetriever } from '@langchain/core/vectorstores';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { LLMChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { formatDocumentsAsString } from 'langchain/util/document';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

export default class ChatBot {
	textSplitter!: RecursiveCharacterTextSplitter;
	vectorStore!: MemoryVectorStore; // Memory Vector Store for storing database of texts (e.g., reviews)
	retriever!: VectorStoreRetriever; // Retriever for retrieving relevant context based on a question with LLM1
	memory!: BufferMemory; // Buffer Memory for storing chat history
	chain!: RunnableSequence;

	constructor() {}

	async init_from_texts(texts: string[]) {
		this.textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
		const docs = await this.textSplitter.createDocuments(texts);

		console.log('# docs', docs.length);

		// const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings({apiKey: import.meta.env.VITE_OPENAI_API_KEY}));
		this.vectorStore = await MemoryVectorStore.fromDocuments(
			docs,
			new OpenAIEmbeddings({ apiKey: import.meta.env.VITE_OPENAI_API_KEY }),
		);
		// @ts-expect-error: mising properties _streamevents
		this.retriever = await this.vectorStore.asRetriever();

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
			// @ts-expect-error: mising properties _streamevents
			prompt: questionGeneratorTemplate,
		});

		const slowerModel = new ChatOpenAI({
			model: 'gpt-4o',
			apiKey: import.meta.env.VITE_OPENAI_API_KEY,
		});
		const slowerChain = new LLMChain({
			llm: slowerModel,
			// @ts-expect-error: mising properties _streamevents
			prompt: questionPrompt,
		});

		// Define the document type to suppress TypeScript errors for formatDocumentsAsString
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		type Document<T = Record<string, any>> = T & {
			pageContent: string;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			metadata: Record<string, any>;
		};

		// Define the function that will perform the question answering
		const performQuestionAnswering = async (input: {
			question: string;
			chatHistory: Array<BaseMessage> | null;
			context: Array<Document>;
		}): Promise<{ result: string; sourceDocuments: Array<Document> }> => {
			let newQuestion = input.question;
			// Serialize context and chat history into strings
			const serializedDocs = formatDocumentsAsString(input.context);
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
				context: async (input: { question: string }) =>
					await this.retriever.invoke(input.question),
			},
			performQuestionAnswering,
		]);
		return this;
	}

	async ask_question(question: string) {
		const response = await this.chain.invoke({ question });
		return response;
	}

	async get_relevant_documents(query: string) {
		return this.retriever.invoke(query);
	}

	async add_documents(docs: string[]) {
		const _docs = await this.textSplitter.createDocuments(docs);
		return this.vectorStore.addDocuments(_docs);
	}

	async clear_chat_history() {
		return this.memory.clear();
	}

	async clear_vector_store() {
		return this.vectorStore.delete();
	}

	async clear_all() {
		await this.clear_chat_history();
		await this.clear_vector_store();
	}
}
