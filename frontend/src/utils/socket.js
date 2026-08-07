'use client';
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const rawSocket = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
const SOCKET_URL = rawSocket.startsWith('http') ? rawSocket : `https://${rawSocket}`;

export function useSocket(orderId) {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    if (orderId) {
      socketRef.current.emit('join-order', orderId);
    }
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [orderId]);

  return socketRef;
}

export default useSocket;
