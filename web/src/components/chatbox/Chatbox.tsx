// import {DeepChat as DeepChatCore} from 'deep-chat'; <- type
import { DeepChat } from 'deep-chat-react';
import './Chatbox.css';
import { Signals } from 'deep-chat/dist/types/handler';
import ChatBot from '../../processes/ChatBot';
import testReviews from './testReviews';
import ai from "../../../resources/robot.png"
import user from "../../../resources/white_user.png"

function Chatbox() {
    const initialMessages = [
        { role: 'ai', text: 'Ask me anything about movie recommendations!' },
    ];


    const chatBot = new ChatBot();
    chatBot.init_from_texts(testReviews);
    async function getMessage(body: any) {
        console.log('body', body);
        const retrieved = await chatBot.get_relevant_documents(body.messages[0].text);
        console.log(retrieved);
        const resultOne = await chatBot.ask_question(
            body.messages[0].text
        );
        console.log({ resultOne });
        console.log(JSON.stringify(resultOne.result, null, 2));
        return JSON.stringify(resultOne.result, null, 2);
    }

    async function chatboxhandler(body: any, signals: Signals) {
        let result = await getMessage(body); // Await the getMessage function call
        result = result.replace(/"/g, "");
        setTimeout(() => {
            signals.onResponse({
                text: result,
            });
        }, 200);
    }

    return (
        <div className="h-screen flex items-center justify-center">
            <DeepChat
                avatars={{
                    "ai": { "src": ai, "styles": { avatar: { "fontSize": "1.5rem" } } },
                    "user": { "src": user, "styles": { avatar: { "fontSize": "1.5rem" } } }
                }}

                messageStyles={{
                    default: {
                        shared: {
                            bubble: {
                                maxWidth: "75%",
                                borderRadius: "1em"
                            }
                        },
                        ai: {
                            bubble: {
                                color: "white",
                                backgroundColor: "#2F2F2F",
                            }
                        },
                        user: {
                            bubble: {
                                color: "white",
                                backgroundColor: "#2F2F2F",
                                marginTop: "2%",
                            }
                        }
                    }
                }}
                initialMessages={initialMessages}
                style={{ borderRadius: '10px', backgroundColor: "#212221", width: "80vw", height: "calc(80vh - 70px)", paddingTop: "10px" }}
                inputAreaStyle={{ borderRadius: '10px', backgroundColor: "#212221", paddingBottom: "3%" }}
                textInput={{ styles: { text: { color: "white" }, container: { borderRadius: '10px', backgroundColor: "#3F3F3F" } } }}
                request={{ handler: chatboxhandler }}
            />
        </div>
    );
};

export default Chatbox;
