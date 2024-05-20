import fs from 'fs';
import { expect, test } from 'vitest';
import path from 'path';

import makeChatBot from './ChatBot';

test('should create a retriever', async () => {
  const filePath = path.join(__dirname, 'test_reviews.txt');
  const docs = fs.readFileSync(filePath, 'utf8').split('\n');
  const { chatBot, retriever } = await makeChatBot(docs);
  
  const retrieved = await retriever.invoke('Reviews of best action movies');
  
  console.log("best action movies", retrieved);
  // make sure 'Cats' is in the pageContent attribute the list of retrieved documents
	// expect(retrieved).toContain('Cats | Poor acting. The characters felt very flat and unconvincing.');
    
  const resultOne = await chatBot.invoke({
    question: "What is the worst tv show or movie based on the reviews?",
  });
  // console.log({ resultOne });

  const resultTwo = await chatBot.invoke({
    question: "Why?",
  });
  // console.log({ resultTwo });

});
