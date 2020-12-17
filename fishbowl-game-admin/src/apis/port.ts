import io from "socket.io-client";

const socket: SocketIOClient.Socket = io("http://fb-server.tomjohnson.xyz");
export default socket;
