import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// Khởi tạo stompClient cho WebSocket
let stompClient = null;

const connectChatWebSocket = (username, onMessage) => {
    const socket = new SockJS('http://localhost:8080/ws');  // Đảm bảo URL đúng
    stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        debug: (str) => console.log('[WebSocket DEBUG]', str),
        onConnect: () => {
            console.log("✅ WebSocket đã kết nối CHAT!");
            stompClient.subscribe(`/user/${username}/queue/messages`, (message) => {
                try {
                    const body = JSON.parse(message.body);
                    console.log("📥 Tin nhắn đến:", body);
                    onMessage(body);
                } catch (err) {
                    console.error("❌ Không parse được message:", err);
                }
            });
        },
        onStompError: (frame) => {
            console.error('❌ Lỗi STOMP:', frame.headers['message']);
            console.error('Chi tiết:', frame.body);
        }
    });

    stompClient.activate();
};

const sendChatMessage = (messageDTO) => {
    if (stompClient && stompClient.connected) {
        stompClient.publish({
            destination: "/app/chat.sendMessage",  // Đảm bảo endpoint đúng
            body: JSON.stringify(messageDTO)
        });
    } else {
        console.error("❌ Không thể gửi tin nhắn. WebSocket chưa kết nối.");
    }
};

const disconnectChatWebSocket = () => {
    if (stompClient && stompClient.active) {
        stompClient.deactivate();
        console.log("❎ WebSocket CHAT đã ngắt kết nối.");
    }
};

// API gửi tin nhắn
const sendMessage = async (senderId, receiverId, content) => {
    try {
        const response = await axios.post('/api/messages', {
            senderId,
            receiverId,
            content
        });
        console.log("Tin nhắn đã gửi thành công:", response.data);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gửi tin nhắn:', error);
        throw error;
    }
};

// API lấy lịch sử tin nhắn
const getChatHistory = async (senderId, receiverId) => {
    try {
        const response = await axios.get(`/api/messages/history/${senderId}/${receiverId}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tải lịch sử trò chuyện:', error);
        throw error;
    }
};

export { connectChatWebSocket, sendChatMessage, disconnectChatWebSocket, sendMessage, getChatHistory };
