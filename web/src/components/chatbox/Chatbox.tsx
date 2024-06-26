// import {DeepChat as DeepChatCore} from 'deep-chat'; <- type
import './Chatbox.css';

import { Signals } from 'deep-chat/dist/types/handler';
import { MessageContent } from 'deep-chat/dist/types/messages';
import { DeepChat } from 'deep-chat-react';
import { onValue, set } from 'firebase/database';
import { ref } from 'firebase/database';
import { useEffect, useState } from 'react';

import ai from '../../../resources/robot.png';
import user from '../../../resources/white_user.png';
import { database } from '../../firebase/firebaseconfig';
// import ChatBot from '../../processes/ChatBot';
import NewChatBot from '../../processes/NewChatbot';
// import testReviews from './testReviews';

interface BodyMessages {
	messages: MessageContent[];
}

function Chatbox() {
	const initialMessages = [
		{ role: 'ai', text: 'Ask me anything about movie recommendations!' },
	];

	const chatBot = new NewChatBot();
	// Only call init_from_texts once upon first page load
	useEffect(() => {
		chatBot.init_from_texts();
	}, []);
	// set reviews state
	// const [reviews, setReviews] = useState<string[]>([]);
	const dbRef = ref(database, 'reviews/');
	onValue(dbRef, (snapshot) => {
		// from new value, then handleReviewsChange
		console.log('Reviews state changed with # reviews:', snapshot.size);
		const reviews = snapshot.val();
		// chatBot.vectorDB_add(reviews);
	});

	// useEffect(() => {

	// }, [reviews]);

	async function getMessage(body: BodyMessages) {
		const text = body.messages[0].text || ''; // Add null check
		const resultOne = await chatBot.ask_question(text);
		return JSON.stringify(resultOne.result, null, 2);
	}

	async function chatboxhandler(body: BodyMessages, signals: Signals) {
		let result = await getMessage(body); // Await the getMessage function call
		// result = result.replace(/"/g, '');
		// console.log('result:', result);
		result = result.replace(/\\n/g, '\n');
		result = result.replace(/\\t/g, '\t');
		result = result.replace(/\\/g, '');
		// console.log('result:', result);
		setTimeout(() => {
			signals.onResponse({
				text: result,
			});
		}, 200);
	}

	return (
		<div className="flex flex-col items-center justify-center">
			<div className="arrow-container mb-20 w-full">
				<div className="flex items-center justify-center text-2xl text-white">
					Chatbot below
				</div>
				<div className="arrow-down"></div>
			</div>
			<DeepChat
				avatars={{
					ai: { src: ai, styles: { avatar: { fontSize: '1.5rem' } } },
					user: { src: user, styles: { avatar: { fontSize: '1.5rem' } } },
				}}
				messageStyles={{
					default: {
						shared: {
							bubble: {
								maxWidth: '75%',
								borderRadius: '1em',
							},
						},
						ai: {
							bubble: {
								color: 'white',
								backgroundColor: '#2F2F2F',
							},
						},
						user: {
							bubble: {
								color: 'white',
								backgroundColor: '#2F2F2F',
								marginTop: '2%',
							},
						},
					},
				}}
				initialMessages={initialMessages}
				style={{
					borderRadius: '10px',
					backgroundColor: '#212221',
					width: '80vw',
					height: 'calc(80vh - 70px)',
					paddingTop: '10px',
				}}
				inputAreaStyle={{
					borderRadius: '10px',
					backgroundColor: '#212221',
					paddingBottom: '3%',
				}}
				textInput={{
					styles: {
						text: { color: 'white' },
						container: { borderRadius: '10px', backgroundColor: '#3F3F3F' },
					},
				}}
				request={{ handler: chatboxhandler }}
			/>
			{/* <div className="arrow-container w-full">
				<div className="chatbot-text flex items-center justify-center pl-[25vw]">
					Chatbot below
				</div>
				<div className="arrow-down ml-[25vw]"></div>
			</div> */}
		</div>
	);
}

export default Chatbox;
