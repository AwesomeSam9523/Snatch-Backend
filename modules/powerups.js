import prisma from "../utils/database.js";
import {Router} from "express";
import {successJson} from "../utils/helper.js";

const router = Router();

router.post('/', async (req, res) => {
  const {teamId, roundNo} = req.body;
  if (!teamId || !roundNo)
    return res.sendStatus(400);

  const data = await prisma.round.findMany({
    select: {
      powerups: {
        select: {
          id: true,
          name: true,
          available: true,
          used: true,
          expiresAt: true,
        },
      },
    },
    where: {
      teamId,
      roundNo,
    },
  });

  successJson(res, data);
});

router.post('/use', async (req, res) => {
  const {powerUp, id} = req.body;
  if (!powerUp || !id)
    return res.sendStatus(400);


});

export default router;
