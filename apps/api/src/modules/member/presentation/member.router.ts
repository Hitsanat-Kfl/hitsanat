import { Router } from "express";
import { createStage1, updateStage2, list, getById } from "./member.controller.js";

export const memberRouter: Router = Router();

memberRouter.post("/stage1", createStage1);
memberRouter.patch("/:id/stage2", updateStage2);
memberRouter.get("/", list);
memberRouter.get("/:id", getById);
