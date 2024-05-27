// import {DeepChat as DeepChatCore} from 'deep-chat'; <- type
import './Chatbox.css';

import { Signals } from 'deep-chat/dist/types/handler';
import { MessageContent } from 'deep-chat/dist/types/messages';
import { DeepChat } from 'deep-chat-react';

import ai from '../../../resources/robot.png';
import user from '../../../resources/white_user.png';
import ChatBot from '../../processes/ChatBot';
import testReviews from './testReviews';
import { get, set, onValue } from "firebase/database";
import { ref } from "firebase/database";
import { database } from "./firebase.js";

interface BodyMessages {
	messages: MessageContent[];
}

function Chatbox() {
	const initialMessages = [
		{ role: 'ai', text: 'Ask me anything about movie recommendations!' },
	];

	const chatBot = new ChatBot();
	chatBot.init_from_texts(testReviews); // not sure if we still need this w/ the onValue

	const dbRef = ref(database, 'reviews/');
	onValue(dbRef, (snapshot) => {
		// from new value, then handleReviewsChange
		const reviews = snapshot.val();
		chatBot.init_from_texts(reviews);
	});

	async function getMessage(body: BodyMessages) {
		console.log('body', body);
		const text = body.messages[0].text || ''; // Add null check
		const retrieved = await chatBot.get_relevant_documents(text);
		console.log(retrieved);
		const resultOne = await chatBot.ask_question(text);
		console.log({ resultOne });
		console.log(JSON.stringify(resultOne.result, null, 2));
		return JSON.stringify(resultOne.result, null, 2);
	}

	async function chatboxhandler(body: BodyMessages, signals: Signals) {
		let result = await getMessage(body); // Await the getMessage function call
		result = result.replace(/"/g, '');
		setTimeout(() => {
			signals.onResponse({
				text: result,
			});
		}, 200);
	}

	return (
		<div className="flex h-screen items-center justify-center">
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
		</div>
	);
}

export default Chatbox;
