import {checkClearance, errorJson, generateCredentials, generateToken, successJson} from "../../utils/helper.js";
import prisma from "../../utils/database.js";
import {Router} from 'express';
import {errorCodes} from "../../utils/errorCodes.js";

const router = Router();
const BRACKET_SIZE = 4;

const getPowerups = (teamId, roundId) => {
  return [
    {name: 'shield', teamId, roundId},
    {name: 'freeze', teamId, roundId},
    {name: 'rebound', teamId, roundId},
    {name: 'wildcard', teamId, roundId},
  ]
}

router.post('/create', async (req, res) => {
  if (!checkClearance(req, res, 2))
    return;

  const {username, member1, member2, member3, member4, email} = req.body;
  if (!username || !email || !member1 || !member2)
    return res.sendStatus(400);

  const totalTeams = await prisma.team.count();
  const members = [
    {name: member1},
    {name: member2},
    {name: member3},
    {name: member4},
  ];

  // if member3 or member4 is empty, remove them from the array
  if (!member3)
    members.pop();

  if (!member4)
    members.pop();

  const password = generateCredentials();
  const token = generateToken(username, password, 0);
  const poolCount = await prisma.team.count();
  const pool = Math.ceil( (poolCount === 0 ? 1 : poolCount) / BRACKET_SIZE);

  await prisma.$transaction(async(prisma) => {
    const team = await prisma.team.create({
      data: {
        name: username,
        avatar: `/avatars/${totalTeams + 1}.svg`,
        email: email,
        members: {
          create: members
        },
        rounds: {
          create: {
            pool: pool,
          }
        },
        teamLogin: {
          create: {
            username,
            password,
            token,
            createdBy: {
              connect: {
                id: req.user.id
              },
            },
          },
        },
      },
      select: {
        id: true,
        rounds: {
          select: {
            id: true
          },
          orderBy: {
            roundNo: 'asc'
          },
        },
      }
    });

    await prisma.powerUp.createMany({
      data: getPowerups(team.id, team["rounds"][0].id)
    });
  });

  successJson(res, {username, password});
});

router.post('/delete', async (req, res) => {
  if (!checkClearance(req, res, 2))
    return;

  const {id} = req.body;
  if (!id)
    return res.sendStatus(400);

  try {
    await prisma.team.delete({
      where: {
        id
      }
    });
    successJson(res, {});
  } catch (e) {
    errorJson(res, "Team not found.", errorCodes.TEAM_NOT_FOUND);
  }
});

router.post('/eliminate', async (req, res) => {
  if (!checkClearance(req, res, 2))
    return;

  const {id} = req.body;
  if (!id)
    return res.sendStatus(400);

  try {
    await prisma.team.update({
      where: {
        id
      },
      data: {
        eliminated: true
      }
    });
    successJson(res, {});
  } catch (e) {
    errorJson(res, "Team not found.", errorCodes.TEAM_NOT_FOUND);
  }
});

router.post('/uneliminate', async (req, res) => {
  if (!checkClearance(req, res, 2))
    return;

  const {id} = req.body;
  if (!id)
    return res.sendStatus(400);

  try {
    await prisma.team.update({
      where: {
        id
      },
      data: {
        eliminated: false
      }
    });
    successJson(res, {});
  } catch (e) {
    errorJson(res, "Team not found.", errorCodes.TEAM_NOT_FOUND);
  }
});

router.get('/all', async (req, res) => {
  if (!checkClearance(req, res, 2))
    return res.sendStatus(401);

  const data = await prisma.$queryRaw`
    SELECT r."pool", JSON_AGG(JSON_BUILD_OBJECT(
                            'name', t."name",
                            'avatar', t.avatar,
                            'eliminated', t."eliminated"
                            )) AS teams
    FROM "Round" r
    JOIN "Team" t ON r."teamId" = t."id"
    GROUP BY r."pool"
    ORDER BY r."pool";
  `;

  successJson(res, data);
});

export default router;
