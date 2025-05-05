import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient = null;

export const connectWebSocket = (orderId, onMessage) => {
    const socket = new SockJS('http://localhost:8080/ws');

    stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        debug: (str) => console.log('[WebSocket DEBUG]', str), // thêm debug log
        onConnect: () => {
            console.log("✅ WebSocket đã kết nối!");

            // Sub đúng topic theo orderId
            stompClient.subscribe(`/topic/booking/${orderId}`, (message) => {
                try {
                    const body = JSON.parse(message.body);
                    console.log("📢 ĐÃ NHẬN:", body);
                    onMessage(body);
                } catch (err) {
                    console.error("❌ Không parse được message:", err, message.body);
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

export const disconnectWebSocket = () => {
    if (stompClient && stompClient.active) {
        stompClient.deactivate();
        console.log("❎ WebSocket đã ngắt kết nối.");
    }
};
