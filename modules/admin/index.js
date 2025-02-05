import { Router } from "express";
import usersRoutes from "./users.js";
import teamsRoutes from "./teams.js";

const router = Router();

router.use("/users", usersRoutes);
router.use("/teams", teamsRoutes);

export default router;