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

  if (!user)
    return null;

  try {
    verifyToken(user.token);
  } catch (e) {
    user.token = generateToken(user.username, user.clearanceLevel);
  }

  await prisma.user.update({
    data: {
      token: user.token
    },
    where: {
      id: user.id
    }
  });

  delete user["id"];
  return user;
}

async function loginByToken(token) {
  try {
    verifyToken(token);
  } catch {
    return null;
  }

  return prisma.user.findFirst({
    where: {
      token
    },
    select: {
      id: true,
      username: true,
      token: true,
      clearanceLevel: true
    }
  });
}

function generateCredentials() {
  return Math.random().toString(36).substring(2, 8);
}

function generateToken(username, clearanceLevel) {
  return jwt.sign(
    {username, clearanceLevel},
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
  if (clearanceLevel < match) {
    res.sendStatus(403);
    return false;
  }

  return true;
}

export {
  loginByUsername,
  loginByToken,
  generateCredentials,
  generateToken,
  verifyToken,
  successJson,
  errorJson,
  checkClearance
};
