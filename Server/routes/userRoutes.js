import { Router } from "express";
import createUser from "../controllers/user/createUser.js";
import deleteUser from "../controllers/user/deleteUser.js";
import getUsers from "../controllers/user/getUsers.js";
import updateUser from "../controllers/user/updateUser.js";

const router = Router();

router.get("/users", getUsers);
router.post("/user", createUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

export default router;
