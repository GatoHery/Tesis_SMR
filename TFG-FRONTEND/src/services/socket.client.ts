import {io} from "socket.io-client";

const socket = io('ws://localhost:5050');

export default socket;