import { Router } from "express";
import createAdmin from "../controllers/admin/createAdmin.js";
import login from "../controllers/admin/login.js";

const router = Router();

router.post("/admin/create", createAdmin);
router.post("/admin/login", login);

export default router;
