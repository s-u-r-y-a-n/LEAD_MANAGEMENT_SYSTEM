import { Router } from "express";
import createUser from "../controllers/user/createUser.js";
import deleteUser from "../controllers/user/deleteUser.js";
import getUsers from "../controllers/user/getUsers.js";
import updateUser from "../controllers/user/updateUser.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = Router();

router.get("/users", authenticateToken(["admin"]), getUsers);
router.post("/user", authenticateToken(["admin"]), createUser);
router.put("/user/:id", authenticateToken(["admin"]), updateUser);
router.delete("/user/:id", authenticateToken(["admin"]), deleteUser);

export default router;
