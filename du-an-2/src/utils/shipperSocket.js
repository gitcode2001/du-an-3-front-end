import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient = null;

// Gửi tới shipper
export const connectShipperWebSocket = (shipperId, onMessage) => {
    const socket = new SockJS('http://localhost:8080/ws');

    stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        debug: (str) => console.log('[WS SHIPPER DEBUG]', str),
        onConnect: () => {
            console.log(`✅ WebSocket đã kết nối với /topic/shipper/${shipperId}`);
            stompClient.subscribe(`/topic/shipper/${shipperId}`, (msg) => {
                try {
                    const body = JSON.parse(msg.body);
                    console.log('📢 [SHIPPER WS] Đã nhận:', body);
                    onMessage(body);
                } catch (e) {
                    console.error('❌ Lỗi parse JSON:', e, msg.body);
                }
            });
        },
        onStompError: (frame) => {
            console.error('❌ Lỗi STOMP:', frame.headers['message']);
        }
    });

    stompClient.activate();
};

export const disconnectShipperWebSocket = () => {
    if (stompClient && stompClient.active) {
        stompClient.deactivate();
        console.log("❎ WS shipper đã ngắt kết nối.");
    }
};
