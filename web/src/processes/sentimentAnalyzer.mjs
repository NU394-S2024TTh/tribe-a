// sentimentAnalyzer.js

import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";

// GPT-4 model sentiment analysis class
class SentimentAnalyzer {
  constructor(apiKey) {
    this.model = new ChatOpenAI({
      modelName: "gpt-4",
      maxOutputTokens: 2048,
      openAIApiKey: apiKey,
      temperature: 0.0,
    });

    this.instruction = 
      "You are a helpful assistant that analyzes the sentiment of a given review or comment for a movie or a TV show on a scale of 1 to 5.";

    this.fewShots = [
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
    ];

    this.systemTemplate = this.createSystemTemplate();
    this.humanTemplate = "Text: {text}\nSentiment: ";

    this.prompt = ChatPromptTemplate.fromMessages([
      ["system", this.systemTemplate],
      ["human", this.humanTemplate],
    ]);

    this.outputParser = new StringOutputParser();

    // Create a chain
    this.chain = this.prompt.pipe(this.model).pipe(this.outputParser);
  }

  // Method to create system template
  createSystemTemplate() {
    return this.instruction + "\n" + 
      this.fewShots
        .map(([text, rating]) => `Text: ${text}\nSentiment: ${rating}\n`)
        .join("\n") + "\n";
  }

  // Method to get sentiment of a single text
  async getSentiment(review) {
    const response = await this.chain.invoke({ text: review });
    const sentiment = parseFloat(response);  // Ensure response is a number
    return sentiment;
  }

  async getSentiments(reviews) {
    // synchronize multiple sentiment analysis promises by Promise.all (parallel execution)
    const promises = [];
    for (let review of reviews) {
        const pS = sentimentAnalyzer.getSentiment(review);
        promises.push(pS);
    }
    const sentiments = await Promise.all(promises);
    return sentiments;
  }
  // Method to get average sentiment of an array of reviews or comments
  async getAverageSentiment(reviews) {
    const numReviews = reviews.length;
    const sentiments = await this.getSentiments(reviews);

    return sentiments.reduce((a, b) => a + b, 0) / numReviews;  // Calculate average
  }
}

// Instantiate the SentimentAnalyzer class
const apiKey = "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";
const sentimentAnalyzer = new SentimentAnalyzer(apiKey);

// Example reviews
const REVIEW_1 = `
This series has a fantastic pilot, but the rest of the series is filler. If they had consolidated all the subplots from episodes 4~9 and had the finale be the halfway point it would fix the glacial pacing and repetitious foreshadowing. This is one of those show seasons that feels like its just setup for the next season.
`;
const REVIEW_2 = `
Lord of the Flies in the Ontario wilderness instead of an island. Yesss. I'm interested in seeing how this goes! Think it's going to be intense, gut wrenching, etc. Misty is already a creep.
`;

// Test the sentiment analyzer
sentimentAnalyzer.getSentiment(REVIEW_1).then(response => {
  console.log("Sentiment of REVIEW_1:", response);
});

export default sentimentAnalyzer;