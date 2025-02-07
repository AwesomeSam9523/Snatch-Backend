import prisma from "./database.js";
import jwt from 'jsonwebtoken';

async function loginByUsername(username, password) {
  const user = await prisma.user.findFirst({
    where: {
      username,
      password
    },
    select: {
      id: true,
      username: true,
      token: true,
      clearanceLevel: true
    }
  });

  const team = await prisma.teamLogins.findFirst({
    where: {
      username,
      password
    },
    select: {
      teamId: true,
      username: true,
      token: true,
    }
  });

  if (!user && !team)
    return null;

  const data = user || team;

  try {
    verifyToken(data.token);
  } catch (e) {
    data.token = generateToken(data.username, data.password, data.clearanceLevel);
    if (user) {
      await prisma.user.update({
        data: {
          token: data.token
        },
        where: {
          id: data.id
        }
      });
    } else {
      await prisma.teamLogins.update({
        data: {
          token: data.token
        },
        where: {
          id: data.id
        }
      });
    }
  }

  return data;
}

async function loginByToken(token) {
  try {
    verifyToken(token);
  } catch {
    console.log('Invalid token');
    return null;
  }

  console.log(token);

  return prisma.user.findFirst({
    where: {
      token
    },
    select: {
      id: true,
      username: true,
      password: true,
      token: true,
      clearanceLevel: true
    }
  });
}

async function loginByTeamToken(token) {
  try {
    verifyToken(token);
  } catch {
    return null;
  }

  const data = prisma.teamLogins.findFirst({
    where: {
      token
    },
    select: {
      teamId: true,
      username: true,
      password: true,
      token: true,
    }
  });

  data["id"] = data["teamId"];
  data["clearanceLevel"] = 0;
  delete data["teamId"];
  return data;
}

function generateCredentials() {
  return Math.random().toString(36).substring(2, 8);
}

function generateToken(username, password, clearanceLevel) {
  return jwt.sign(
    {username, password, clearanceLevel},
    process.env.JWT_SECRET,
    {expiresIn: '1d'}
  );
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

function successJson(res, data, ...message) {
  if (message.length > 0)
    return res.json({success: true, message: message.join(), data});

  return res.json({success: true, data});
}

function errorJson(res, message, code) {
  return res.json({success: false, message, code});
}

function checkClearance(req, res, match) {
  if (!req.user) {
    res.sendStatus(401);
    return false;
  }

  const {clearanceLevel} = req.user;
  if (!clearanceLevel) {
    res.sendStatus(403);
    return false;
  }

  if (clearanceLevel < match) {
    res.sendStatus(403);
    return false;
  }

  return true;
}

export {
  loginByUsername,
  loginByToken,
  loginByTeamToken,
  generateCredentials,
  generateToken,
  verifyToken,
  successJson,
  errorJson,
  checkClearance,
};
