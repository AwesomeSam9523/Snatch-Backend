import prisma from "../utils/database.js";
import {Router} from "express";

const router = Router();

router.post('/', async (req, res) => {
  const {roundNo, pool} = req.body;
  if (!roundNo || !pool)
    return res.sendStatus(400);

  return prisma.team.findMany({
    where: {
      rounds: {
        where: {
          roundNo,
          pool
        }
      }
    }
  });
})

export default router;
