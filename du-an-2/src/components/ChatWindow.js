// src/components/Chat/ChatWindow.jsx
import React, { useEffect, useState } from 'react';
import { connectChatWebSocket, sendChatMessage, disconnectChatWebSocket, getChatHistory } from '../services/ChatService';

const ChatWindow = ({ username, senderId, receiverId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        // Load chat history
        getChatHistory(senderId, receiverId)
            .then(setMessages)
            .catch(console.error);

        // Connect WebSocket
        connectChatWebSocket(username, (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => {
            disconnectChatWebSocket();
        };
    }, [username, senderId, receiverId]);

    const handleSend = () => {
        if (input.trim()) {
            const messageDTO = {
                senderId,
                receiverId,
                content: input
            };
            sendChatMessage(messageDTO);
            setMessages((prev) => [...prev, { senderId, content: input }]);
            setInput('');
        }
    };

    return (
        <div className="p-4 border rounded-xl w-full max-w-md mx-auto shadow-lg">
            <div className="h-64 overflow-y-auto mb-2 bg-gray-50 p-2 rounded">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`my-1 p-2 rounded ${msg.senderId === senderId ? 'bg-blue-100 text-right' : 'bg-green-100 text-left'}`}
                    >
                        {msg.content}
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-grow p-2 border rounded"
                    placeholder="Nhập tin nhắn..."
                />
                <button
                    onClick={handleSend}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Gửi
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;