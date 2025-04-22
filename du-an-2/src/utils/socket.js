import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;

export const connectWebSocket = (onMessage) => {
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
            console.log('✅ Kết nối WebSocket thành công');
            stompClient.subscribe('/topic/account-lock', (message) => {
                const payload = JSON.parse(message.body);
                console.log('📩 Thông báo:', payload);
                if (onMessage) onMessage(payload);
            });
        },
        onStompError: (error) => {
            console.error('❌ Lỗi STOMP:', error);
        }
    });

    stompClient.activate();
};

export const disconnectWebSocket = () => {
    if (stompClient) {
        stompClient.deactivate();
    }
};
