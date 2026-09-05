import { Router } from "express";
import { FamilyController } from "./family.controller.js";

export const familyRouter: Router = Router();

familyRouter.post("/", FamilyController.create);
familyRouter.get("/", FamilyController.list);
familyRouter.get("/:id", FamilyController.getById);
