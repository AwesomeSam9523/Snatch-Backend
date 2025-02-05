import prisma from "../utils/database.js";
import {Router} from "express";
import {successJson} from "../utils/helper.js";

const router = Router();

router.post('/', async (req, res) => {
  const {roundNo, pool} = req.body;
  if (!roundNo || !pool) {
    return res.sendStatus(400);
  }

  const data = await prisma.round.findMany({
    select: {
      score: true,
      team: {
        select: {
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
