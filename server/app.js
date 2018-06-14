import http from 'http';
import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import configs from './config';
import Queue from './libs/Queue';
import dummyData from './dummyData';
import apiRoutes from './routes/index';
import {checkLogin} from './middlewares/Auth';
import path from 'path';

// MongoDB Connection
mongoose.Promise = global.Promise;
(async function () {
  try {
    await mongoose.connect(configs.mongoURL);
    console.log('DB connect success.');
  } catch (err) {
    console.error('err on mongo connection:', err);
    process.exit(1);
  }
}) ();

// Kue and KueUI
Queue.init(configs.kue, configs.kueUI);

// Express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '20mb'
}));
app.use(checkLogin);
app.use('/api/', apiRoutes);

if(configs.useExpressStatic) {
  app.use('/uploads/', express.static(path.resolve(__dirname, '../uploads')));
}

const server = http.createServer(app);

server.listen(configs.serverPort, async () => {
  console.log('server is listening on port', configs.serverPort);
  await dummyData();
  console.log('dummy data done.');
  // console.log('pairFollowing:', configs.pairFollowing);
  // process.exit();
});

app.get('/', function(req, res) {
  res.end('Hello Hotel booking system');
});

export default app;
