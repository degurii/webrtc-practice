import { io } from 'socket.io-client';

const socket = io('ws://localhost:3000', {
  withCredentials: true,
});

export const on = (event, callback) => socket.on(event, callback);
export const emit = (event, data) => socket.emit(event, data);
