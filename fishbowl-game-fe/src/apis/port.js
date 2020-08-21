import io from 'socket.io-client';

const port = "/";
const socket = io(port);
export default socket;