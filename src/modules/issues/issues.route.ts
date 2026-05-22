import { Router } from "express";
import issuesController from "./issues.controller";
import authenticate from "../../middlewares/authenticate";

const router = Router();

// create issue
router.post("/", authenticate, issuesController.createIssue);

// get all issue
router.get("/", issuesController.getAllIssues);

export const issuesRoute = router;
