import { Router } from "express";
import { createStage1, getById, list, update, updateStage2 } from "./member.controller.js";

export const memberRouter: Router = Router();

memberRouter.post("/stage1", createStage1);
memberRouter.patch("/:id/stage2", updateStage2);
memberRouter.put("/:id", update);
memberRouter.get("/", list);
memberRouter.get("/:id", getById);
