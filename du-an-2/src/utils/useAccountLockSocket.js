import { useEffect } from 'react';
import { connectWebSocket, disconnectWebSocket } from './socket';

const useAccountLockSocket = (onMessage) => {
    useEffect(() => {
        if (typeof onMessage === 'function') {
            connectWebSocket(onMessage);
        }

        return () => {
            disconnectWebSocket();
        };
    }, [onMessage]);
};

export default useAccountLockSocket;
