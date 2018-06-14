import {server} from './app';
import SocketIO from 'socket.io';
let io = null;

exports.io = io;

exports.init = () => {
  io = new SocketIO(server);
  console.log('socket init success');

  io.on('connection', (socket) => {
    let str = 'A client connected on instance ' + (process.env.NODE_APP_INSTANCE || '0');
    console.log(str);
    io.emit('noti', {str});
  });
};
