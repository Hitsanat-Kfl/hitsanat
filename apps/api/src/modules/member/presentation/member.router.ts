import { Router } from "express";
import { MemberController } from "./member.controller.js";

export const memberRouter: Router = Router();

memberRouter.post("/stage1", MemberController.createStage1);
memberRouter.patch("/:id/stage2", MemberController.updateStage2);
memberRouter.get("/", MemberController.list);
memberRouter.get("/:id", MemberController.getById);
