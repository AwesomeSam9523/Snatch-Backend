import { Router } from "express";
import usersRoutes from "./users.js";
import teamsRoutes from "./teams.js";

const router = Router();

router.use("/user", usersRoutes);
router.use("/team", teamsRoutes);

export default router;