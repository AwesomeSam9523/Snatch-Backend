import express from 'express';
import cors from 'cors';
import winston from "winston";
import bodyParser from "body-parser";
import { WebSocketServer } from 'ws';

import {loginByUsername, loginByToken, successJson, loginByTeamToken} from './utils/helper.js';

// Modules
import adminManager from './modules/admin/index.js';
import leaderboardManager from './modules/leaderboard.js';
import powerupsManager from './modules/powerups.js';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  defaultMeta: {service: 'user-service'},
  transports: [
    new winston.transports.File({filename: 'error.log', level: 'error'}),
    new winston.transports.File({filename: 'combined.log'}),
  ],
});
logger.add(new winston.transports.Console({
  format: winston.format.simple(),
}));

const wss = new WebSocketServer({
  port: 9000,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
  }
});

const app = express();
app.use(express.static('public'))
app.use((req, res, next) => {
  logger.info(`${req.method}: ${req.url}`);
  next();
});

app.use(cors({
  origin: "*",
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('padhlo.');
});

app.post('/login', async (req, res) => {
  const {username, password} = req.body;
  if (!username || !password)
    return res.sendStatus(400);

  const user = await loginByUsername(username, password);
  if (!user)
    return res.sendStatus(401);

  successJson(res, user);
});

const allowed_routes = [
  '/avatars/.*.svg',
]

app.use(async (req, res, next) => {
  for (let route of allowed_routes) {
    if (req.path.match(route))
      return next();
  }

  if (!req.headers.authorization)
    return res.sendStatus(401);

  const token = req.headers.authorization.split(' ')[1];
  req.user = null;

  if (token) {
    req.user = await loginByToken(token) || await loginByTeamToken(token);
    console.log(req.user);
  }

  if (!req.user)
    return res.sendStatus(401);

  next();
});

app.use('/admin', adminManager);
app.use('/leaderboard', leaderboardManager);
app.use('/powerups', powerupsManager);

wss.on('connection', function connection(ws, request, client) {
  // console.log('connected', ws);
  ws.on('error', console.error);

  ws.on('message', function message(msg) {
    let data;
    try {
      data = JSON.parse(msg);
    } catch (e) {
      console.log(e)
      console.error('Invalid JSON %s', msg);
      return;
    }

    console.log('received: %s', data);
  });
});

const PORT = process.env.PORT || 3000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    logger.info(`Server started on http://localhost:${PORT}`);
  });
}

// noinspection JSUnusedGlobalSymbols
export default app;
