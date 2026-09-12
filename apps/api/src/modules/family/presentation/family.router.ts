import { Router } from "express";
import { create, getById, list } from "./family.controller.js";

export const familyRouter: Router = Router();

familyRouter.post("/", create);
familyRouter.get("/", list);
familyRouter.get("/:id", getById);
