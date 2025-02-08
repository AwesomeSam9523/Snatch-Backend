import prisma from "../utils/database.js";
import {Router} from "express";
import {successJson} from "../utils/helper.js";
import axios from 'axios';

const router = Router();

async function getCodingBlocksLeaderboard(contestId) {
  const {data} = await axios.get(`https://hack-api.codingblocks.com/api/v2/contest-leaderboards?exclude=user.*%2Ccollege.*&filter%5BcontestId%5D=${contestId}&include=user%2Ccollege&page%5Boffset%5D=0&page%5Blimit%5D=10&sort=-score%2Ctime`);
  console.log(data);
}

router.get('/start', (req, res) => {
  getCodingBlocksLeaderboard(4491);
  res.send('ok');
})

router.get('/', async (req, res) => {
  const {teamId} = req.user;
  if (!teamId) {
    return res.sendStatus(401);
  }

  const preData = await prisma.round.findFirst({
    select: {
      roundNo: true,
      pool: true,
    },
    where: {
      teamId
    },
  });

  const {roundNo, pool} = preData;
  if (!roundNo || !pool) {
    return res.sendStatus(400);
  }

  const data = await prisma.round.findMany({
    select: {
      score: true,
      team: {
        select: {
          id: true,
          name: true,
          avatar: true,
          eliminated: true,
        }
      },
    },
    where: {
      roundNo,
      pool
    },
    orderBy: {
      score: 'desc'
    },
  });

  successJson(res, data);
});

export default router;
