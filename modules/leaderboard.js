import prisma from "../utils/database.js";
import {Router} from "express";
import {successJson} from "../utils/helper.js";

const router = Router();

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
