import {checkClearance, generateCredentials, generateToken, successJson} from "../../utils/helper.js";
import prisma from "../../utils/database.js";
import {Router} from "express";

const router = Router();


router.post('/create', async (req, res) => {
  if (!checkClearance(req, res, 2))
    return;

  const {username, clearanceLevel} = req.body;
  if (!username || !clearanceLevel)
    return res.sendStatus(400);

  if (req.user.clearanceLevel <= clearanceLevel)
    return res.sendStatus(403);

  const password = generateCredentials();
  const token = generateToken(username, clearanceLevel);
  await prisma.user.create({
    data: {
      username,
      password,
      token,
      clearanceLevel,
      createdById: req.user.id
    }
  });

  successJson(res, {username, token});
});


router.get('/', async (req, res) => {
  if (!checkClearance(req, res, 1))
    return;

  const users = await prisma.user.findMany({
    select: {
      username: true,
      clearanceLevel: true,
      createdAt: true,
      createdBy: {
        select: {
          username: true,
          clearanceLevel: true
        }
      }
    }
  });
  successJson(res, users);
});

export default router;
