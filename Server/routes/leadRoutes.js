import { Router } from "express";
import createLead from "../controllers/lead/createLead.js";
import getLeads from "../controllers/lead/getLeads.js";
import updateLead from "../controllers/lead/updateLead.js";
import deleteLead from "../controllers/lead/deleteLead.js";

const router = Router();

router.post("/lead", createLead);
router.get("/leads", getLeads);
router.put("/lead/:id", updateLead);
router.delete("/lead/:id", deleteLead);

export default router;
