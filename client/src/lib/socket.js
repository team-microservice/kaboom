import { io } from "socket.io-client";

const socket = io("https://gp.dhronz.space/");

export default socket;
