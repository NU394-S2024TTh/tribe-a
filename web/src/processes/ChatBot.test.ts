import fs from 'fs';
import path from 'path';
import { assert, test } from 'vitest';

import ChatBot from './ChatBot';

test('should create a retriever', async () => {
	const filePath = path.join(__dirname, 'test_reviews.txt');
	const docs = fs.readFileSync(filePath, 'utf8').split('\n');
	const chatBot = new ChatBot();
	await chatBot.init_from_texts(docs);

	// check the type of the retriever

	const retrieved = await chatBot.get_relevant_documents('best action movies');

	console.log('best action movies', retrieved);
	// make sure 'The Matrix' is a sub-string of the string value of pageContent attribute of one element in the list of retrieved documents
	assert.ok(retrieved.some((doc) => doc.pageContent.includes('The Matrix')));

	const resultOne = await chatBot.ask_question(
		'What are the reviews related to action movies?',
	);
	// console.log(await chatBot.ask_question("Give me a summary of all the reviews"));

	console.log({ resultOne });
	console.log(JSON.stringify(resultOne, null, 2));

	// test if ChatBot can remember the previous question and answer
	const resultTwo = await chatBot.ask_question('Which one do you think is the best?');
	console.log({ resultTwo });
	console.log(JSON.stringify(resultTwo, null, 2));
	// test if ChatBot can remember the previous question and answer
	const resultThree = await chatBot.ask_question(
		"Sorry, I didn't get that. Can you repeat it?",
	);
	console.log({ resultThree });
	console.log(JSON.stringify(resultThree, null, 2));
}, 10000);
