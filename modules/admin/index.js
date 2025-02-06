import { Router } from "express";
import usersRoutes from "./users.js";
import teamsRoutes from "./teams.js";
import leaderboardRoutes from "./leaderboard.js";

const router = Router();

router.use("/user", usersRoutes);
router.use("/team", teamsRoutes);
router.use("/leaderboard", leaderboardRoutes);

export default router;
