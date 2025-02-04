import prisma from "../utils/database.js";
import {Router} from "express";

const router = Router();

router.post('/', async (req, res) => {
  const {teamId, roundNo} = req.body;
  if (!teamId || !roundNo)
    return res.sendStatus(400);

  return prisma.team.findUnique({
    where: {
      id: teamId
    },
    include: {
      rounds: {
        where: {
          roundNo
        }
      }
    }
  });
});

export default router;