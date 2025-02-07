import {successJson} from "../../utils/helper.js";
import prisma from "../../utils/database.js";
import {Router} from 'express';

const router = Router();

router.post('/', async (req, res) => {
  const {pool} = req.body;
  console.log(res.body);

  if (!pool) {
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
          members: {
            select: {
              name: true,
            },
          },
          powerups: {
            select: {
              name: true,
              available: true,
              used: true,
              expiresAt: true,
            },
          },
        },
      },
    },
    where: {
      pool,
    },
    orderBy: {
      score: 'desc'
    },
  });

  successJson(res, data);
});

export default router;
