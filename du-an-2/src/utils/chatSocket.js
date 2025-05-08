// src/components/ChatWebSocket.js
import React, { useEffect, useState } from 'react';
import {connectChatWebSocket, disconnectChatWebSocket, sendChatMessage} from "../services/ChatService";

const ChatWebSocket = ({ username }) => {
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // Kết nối WebSocket khi component mount
        connectChatWebSocket(username, (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

// Cleanup khi component unmount
        return () => {
            disconnectChatWebSocket();
        };
    }, [username]);

    const handleSendMessage = () => {
        const content = document.getElementById('messageContent').value; // Lấy nội dung tin nhắn từ input
        const messageDTO = {
            senderId: 1,
            receiverId: 2,
            content: content
        };

        // Gửi tin nhắn qua WebSocket
        sendChatMessage(messageDTO);
        document.getElementById('messageContent').value = ''; // Xóa nội dung input sau khi gửi
    };

    return (
        <div>
            <h2>Chat Room</h2>
            <div>
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div key={index}>
                            <strong>{msg.sender}: </strong>{msg.content}
                        </div>
                    ))
                ) : (
                    <p>No messages yet</p>
                )}
            </div>

            {connected ? (
                <div>
                    <textarea id="messageContent" placeholder="Type a message..."></textarea>
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            ) : (
                <p>Connecting...</p>
            )}
        </div>
    );
};

export default ChatWebSocket;
