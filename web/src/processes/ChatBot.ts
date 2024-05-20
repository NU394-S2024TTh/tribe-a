// import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { BaseMessage } from "@langchain/core/messages";

import { LLMChain } from "langchain/chains";

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { formatDocumentsAsString } from "langchain/util/document";
import { BufferMemory } from "langchain/memory";
import { MemoryVectorStore } from "langchain/vectorstores/memory";


export default async function makeChatBot(texts: string[]) {

	const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
	const docs = await textSplitter.createDocuments(texts);

	console.log("# docs", docs.length);

	// const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings({apiKey: import.meta.env.VITE_OPENAI_API_KEY}));
	const vectorStore = await MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings({ apiKey: import.meta.env.VITE_OPENAI_API_KEY }));
	const retriever = vectorStore.asRetriever();
	
const memory = new BufferMemory({
  memoryKey: "chatHistory",
  inputKey: "question", // The key for the input to the chain
  outputKey: "text", // The key for the final conversational output of the chain
  returnMessages: true, // If using with a chat model (e.g. gpt-3.5 or gpt-4)
});

const serializeChatHistory = (chatHistory: Array<BaseMessage>): string =>
  chatHistory
    .map((chatMessage) => {
      if (chatMessage._getType() === "human") {
        return `Human: ${chatMessage.content}`;
      } else if (chatMessage._getType() === "ai") {
        return `Assistant: ${chatMessage.content}`;
      } else {
        return `${chatMessage.content}`;
      }
    })
    .join("\n");

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
	Helpful Answer:`
	);
	const questionGeneratorTemplate = PromptTemplate.fromTemplate(
		`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
	----------
	CHAT HISTORY: {chatHistory}
	----------
	FOLLOWUP QUESTION: {question}
	----------
	Standalone question:`
	);

	// Initialize fast and slow LLMs, along with chains for each
	const fasterModel = new ChatOpenAI({
		model: "gpt-3.5-turbo",
		apiKey: import.meta.env.VITE_OPENAI_API_KEY,
	});
	const fasterChain = new LLMChain({
		llm: fasterModel,
		prompt: questionGeneratorTemplate,
	});

	const slowerModel = new ChatOpenAI({
		model: "gpt-4o",
		apiKey: import.meta.env.VITE_OPENAI_API_KEY,
	});
	const slowerChain = new LLMChain({
		llm: slowerModel,
		prompt: questionPrompt,
	});

	// Define the document type to suppress TypeScript errors for formatDocumentsAsString
	type Document<T = Record<string, any>> = T & {
		pageContent: string;
		metadata: Record<string, any>;
	};

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
			chatHistory: chatHistoryString ?? "",
			context: serializedDocs,
			question: newQuestion,
		});
	
		// Save the chat history to memory
		await memory.saveContext(
			{
				question: input.question,
			},
			{
				text: response.text,
			}
		);
	
		return {
			result: response.text,
			sourceDocuments: input.context,
		};
	};

	const chatBot = RunnableSequence.from([
		{
			// Pipe the question through unchanged
			question: (input: { question: string }) => input.question,
			// Fetch the chat history, and return the history or null if not present
			chatHistory: async () => {
				const savedMemory = await memory.loadMemoryVariables({});
				const hasHistory = savedMemory.chatHistory.length > 0;
				return hasHistory ? savedMemory.chatHistory : null;
			},
			// Fetch relevant context based on the question
			context: async (input: { question: string }) =>
				retriever.invoke(input.question),
		},
		performQuestionAnswering,
	]);

	return { chatBot, retriever };
}
