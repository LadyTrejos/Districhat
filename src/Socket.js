import io from 'socket.io-client';

export const socket = io('http://192.168.137.188:5000/',{transports: ['websocket'], pingInterval: 10000,
pingTimeout: 30000}); 