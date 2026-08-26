import { Router } from "express";
import createLead from "../controllers/lead/createLead.js";
import getLeads from "../controllers/lead/getLeads.js";
import updateLead from "../controllers/lead/updateLead.js";
import deleteLead from "../controllers/lead/deleteLead.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = Router();

router.post("/lead", authenticateToken(["admin", "user"]), createLead);
router.get("/leads", authenticateToken(["admin", "user"]), getLeads);
router.put("/lead/:id", authenticateToken(["admin", "user"]), updateLead);
router.delete("/lead/:id", authenticateToken(["admin", "user"]), deleteLead);

export default router;
