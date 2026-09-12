import { Router } from "express";
import { getRoster, list } from "./sub-department.controller.js";

export const subDepartmentRouter: Router = Router();

subDepartmentRouter.get("/", list);
subDepartmentRouter.get("/:code/roster", getRoster);
