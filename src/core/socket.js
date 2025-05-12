import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_API_URL}`, {
  withCredentials: true,
  transports: ["websocket"], // fallback: remove if causing issues
});

export default socket;
