import { io } from "socket.io-client";

const socket = io("ws://gp.dhronz.space/gemini/generate-quiz");

export default socket