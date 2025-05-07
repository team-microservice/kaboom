import { io } from "socket.io-client";

const socket = io("ws://gp.dhronz.space/");

export default socket;
