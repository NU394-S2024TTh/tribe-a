import React, { useState, useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import './Chatbox.css';
import { PaperPlaneIcon } from '@radix-ui/react-icons'

const ChatBox = () => {
    const [messages, setMessages] = useState([
        { from: 'assistant', text: 'Hello! How can I assist you today?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const handleSend = () => {
        if (inputValue.trim()) {
            setMessages([...messages, { from: 'user', text: inputValue }]);
            setInputValue('');
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <Dialog.Root open={true}>
            <Dialog.Overlay className="chat-overlay" />
            <Dialog.Content className="chat-content">
                <Dialog.Title className="chat-title">AI Assistant</Dialog.Title>
                {/* <Dialog.Close className="chat-close">
                    <Cross2Icon />
                </Dialog.Close> */}
                <div className="chat-messages-container">
                    <div className="chat-messages">
                        {messages.map((message, index) => (
                            <div key={index} className={`chat-message ${message.from}`}>
                                {message.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                <div className="chat-input-container">
                    <input
                        type="text"
                        className="chat-input"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                    />
                    <button className="chat-send" onClick={handleSend}> <PaperPlaneIcon /></button>
                </div>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default ChatBox;
