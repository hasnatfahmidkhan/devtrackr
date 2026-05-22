import { Router } from "express";
import issuesController from "./issues.controller";
import authenticate from "../../middlewares/authenticate";
import authorize from "../../middlewares/authorize";

const router = Router();

// create issue
router.post("/", authenticate, issuesController.createIssue);

// get all issue
router.get("/", issuesController.getAllIssues);

// get issue by id
router.get("/:id", issuesController.getIssueById);

// update issue by id
router.patch("/:id", authenticate, issuesController.updateIssue);

// delete issue (only maintainer can delete issue) 
router.delete("/:id", authenticate, authorize("maintainer"), issuesController.deleteIssue);


export const issuesRoute = router;
