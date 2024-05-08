import {
  ChatPromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate,
  AIMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";

// GPT-4 model
// create a class SentimentAnalyzer
class SentimentAnalyzer {
  constructor(apiKey) {
    const model = new ChatOpenAI({
      modelName: "gpt-4",
      maxOutputTokens: 2048,
      openAIApiKey: apiKey,
      temperature: 0.0,
    });

    const instruction =
    "You are a helpful assistant that analyze the sentiment of a given review or comment for a movie or a TV show on a scale of 1 to 5.";

    // sentiment analysis examples of movie reviews from a scale of 1 to 5
    const fewShots = [
      ["This movie is the best I have ever seen.", 5],
      ["The movie was good, but the ending was disappointing.", 3],
      ["The movie was terrible, I would not recommend it to anyone.", 1],
      ["The movie was okay, but it could have been better.", 2],
      ["The movie was amazing, I would definitely watch it again.", 4],
      ["The movie was not bad, but it was not great either.", 3],
      ["The movie was fantastic, I would recommend it to everyone.", 5],
      ["The movie was awful, I would not watch it again.", 1],
      ["The movie was decent, but it was not worth the price of admission.", 2],
      ["The movie was excellent, I would give it a perfect score.", 5],
    ]

    // create a prompt template
    const startOfExample = "Text: ";
    const systemTemplate = instruction + "\n" + 
      fewShots.map(([text, rating]) => "Text: " + text + "\nSentiment: " + rating.toString() + "\n").join("\n") + "\n";
    const humanTemplate = startOfExample + "{text}" + "\nSentiment: ";

    console.log(systemTemplate);
    console.log(humanTemplate);

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", systemTemplate],
      ["human", humanTemplate],
    ]);

    // create an output parser
    const outputParser = new StringOutputParser();

    // create a chain
    this.chain = prompt.pipe(model).pipe(outputParser);
  }

  async getSentiment(text) {
    const response = this.chain.invoke({text: text});
    return response;
  }
}

// instantiate the SentimentAnalyzer class
const sentimentAnalyzer = new SentimentAnalyzer("api-key-here");

sentimentAnalyzer.getSentiment("This movie is the best I have ever seen.").then(response => {console.log(response);});
// export default sentimentAnalyzer;