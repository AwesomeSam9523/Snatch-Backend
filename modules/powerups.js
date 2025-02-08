import prisma from "../utils/database.js";
import {Router} from "express";
import {errorJson, successJson} from "../utils/helper.js";
import {errorCodes} from "../utils/errorCodes.js";

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
  if (!powerUp || !id) {
    return res.sendStatus(400);
  }

  const password = req.user.password;
  const currentTeam = await prisma.teamLogins.findUnique({
    where: {
      password,
    },
    select: {
      teamId: true,
      team: {
        select: {
          id: true,
          name: true,
          eliminated: true,
          rounds: true,
        },
      },
    },
  });

  // check if team is present and not eliminated
  if (!currentTeam) {
    return res.sendStatus(401);
  }

  if (currentTeam.team.eliminated) {
    errorJson(res, 'Team is eliminated', errorCodes.TEAM_ELIMINATED);
  }

  // get the round
  const lastRound = currentTeam.team.rounds.length;
  const round = currentTeam.team.rounds[lastRound - 1];

  const roundData = await prisma.round.findFirst({
    where: {
      teamId: currentTeam.teamId,
      roundNo: lastRound,
    },
    select: {
      id: true,
      pool: true,
      roundNo: true,
    },
  });

  console.log('roundData', roundData);

  const usedOnTeam = await prisma.team.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      powerups: {
        select: {
          id: true,
          name: true,
          used: true,
          expiresAt: true,
        },
        where: {
          used: true,
        },
      },
      rounds: {
        select: {
          id: true,
          roundNo: true,
          pool: true,
        },
        where: {
          pool: roundData.pool,
          roundNo: roundData.roundNo,
        },
      },
    },
  });

  // check if opposite team exists and is in same pool
  if (!usedOnTeam) {
    return errorJson(res, 'Team to use on not found', errorCodes.TEAM_NOT_FOUND);
  }

  if (usedOnTeam.rounds.length === 0) {
    return errorJson(res, 'Team to use on not found', errorCodes.TEAM_NOT_FOUND);
  }

  console.log('usedOnTeam', usedOnTeam);

  const powerup = await prisma.powerUp.findFirst({
    where: {
      teamId: currentTeam.teamId,
      roundId: round.id,
      name: powerUp,
    },
    select: {
      id: true,
      name: true,
      available: true,
      used: true,
      expiresAt: true,
      powerupUsage: true,
    }
  });
  console.log('powerup', powerup);

  // check if powerup is available and not used
  if (!powerup) {
    return errorJson(res, 'Powerup not found', errorCodes.POWERUP_NOT_FOUND);
  }

  if (!powerup.available) {
    return errorJson(res, 'Powerup not available', errorCodes.POWERUP_NOT_AVAILABLE);
  }

  if (powerup.used) {
    return errorJson(res, 'Powerup already used', errorCodes.POWERUP_ALREADY_USED);
  }

  // check if team is not using any other powerup at that time
  const allPowerups = await prisma.powerUp.findMany({
    where: {
      teamId: currentTeam.teamId,
    },
    select: {
      id: true,
      name: true,
      available: true,
      used: true,
      expiresAt: true,
      powerupUsage: true,
    }
  });

  for (const p of allPowerups) {
    if (p.used && p.expiresAt > new Date()) {
      return errorJson(res, 'Another powerup is active', errorCodes.ANOTHER_POWERUP_ACTIVE);
    }
  }

  // check if other team is being attacked
  const usedOnPowerup = await prisma.powerupUsage.findFirst({
    where: {
      usedOnTeamId: usedOnTeam.id,
      powerup: {
        expiresAt: {
          gte: new Date(),
        },
      },
    },
    select: {
      id: true,
      powerup: true,
    }
  });
  console.log('usedOnPowerup', usedOnPowerup);

  if (usedOnPowerup) {
    switch (usedOnPowerup.powerup.name) {
      case 'rebound':

      case 'shield':

    }
  }

  if (usedOnPowerup) {
    return errorJson(res, 'Another team is already under attack', errorCodes.ANOTHER_POWERUP_ACTIVE);
  }

  let expiresAt = new Date();
  let now = new Date();
  let usedOnId = id;

  switch (powerup.name) {
    case 'shield':
      expiresAt = new Date(now.getTime() + 10 * 60 * 1000);
      usedOnId = currentTeam.teamId;
      break;
    case 'rebound':
      expiresAt = new Date(now.getTime() + 5 * 60 * 1000);
      usedOnId = currentTeam.teamId;
      break;
  }

  successJson(res, powerup);
});

export default router;
