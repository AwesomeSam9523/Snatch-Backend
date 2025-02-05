import express from 'express';
import cors from 'cors';
import winston from "winston";
import bodyParser from "body-parser";

import {loginByUsername, loginByToken, successJson} from './utils/helper.js';

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

const app = express();

app.use((req, res, next) => {
  logger.debug(`${req.method}: ${req.url}`);
  next();
});

app.use(cors({
  origin: [
    'http://localhost:8080',
  ],
  optionsSuccessStatus: 200,
  credentials: true,
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

app.use(async (req, res, next) => {
  if (!req.headers.authorization)
    return res.sendStatus(401);

  const token = req.headers.authorization.split(' ')[1];
  req.user = null;

  if (token) {
    req.user = await loginByToken(token);
  }

  if (!req.user)
    return res.sendStatus(401);

  next();
});

app.use('/admin', adminManager);
app.use('/leaderboard', leaderboardManager);
app.use('/powerups', powerupsManager);


const PORT = process.env.PORT || 3000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    logger.info(`Server started on http://localhost:${PORT}`);
  });
}

// noinspection JSUnusedGlobalSymbols
export default app;
