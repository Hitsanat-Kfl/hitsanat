import { Router } from "express";
import { create, list, getById } from "./family.controller.js";

export const familyRouter: Router = Router();

familyRouter.post("/", create);
familyRouter.get("/", list);
familyRouter.get("/:id", getById);
