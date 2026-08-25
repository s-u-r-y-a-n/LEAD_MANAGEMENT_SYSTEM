import { Router } from "express";
import createLead from "../controllers/lead/createLead.js";

const router = Router();

router.post("/create-lead", createLead);

export default router;
