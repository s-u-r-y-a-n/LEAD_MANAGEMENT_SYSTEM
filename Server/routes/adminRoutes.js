import { Router } from "express";
import createAdmin from "../controllers/admin/createAdmin.js";
import login from "../controllers/admin/login.js";
import logout from "../controllers/admin/logout.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = Router();

router.post("/admin/create", createAdmin);
router.post("/admin/login", login);
router.post("logout", logout);
router.get("/validate-token", authenticateToken, (request, response) => {
  return response.status(200).json({ success: true });
});

export default router;
