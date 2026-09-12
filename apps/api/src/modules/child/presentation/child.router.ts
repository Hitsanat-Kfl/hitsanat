import { Router } from "express";
import {
  create,
  createParent,
  getByBirthdayMonth,
  getById,
  linkParent,
  list,
  listAllParents,
  listParents,
  reclassify,
  remove,
  unlinkParent,
  update,
} from "./child.controller.js";

export const childRouter: Router = Router();

// Child CRUD
childRouter.post("/", create);
childRouter.get("/", list);
childRouter.get("/birthdays/:month", getByBirthdayMonth);
childRouter.get("/:id", getById);
childRouter.patch("/:id", update);
childRouter.patch("/:id/reclassify", reclassify);
childRouter.delete("/:id", remove);

// Child-Parent Linking
childRouter.get("/:id/parents", listParents);
childRouter.post("/:id/parents", linkParent);
childRouter.delete("/:id/parents/:parentId", unlinkParent);

// Parent CRUD (scoped)
childRouter.post("/parents", createParent);
childRouter.get("/parents/all", listAllParents);
