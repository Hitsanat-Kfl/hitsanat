import { Router } from "express";
import {
  create,
  list,
  getById,
  update,
  remove,
  reclassify,
  getByBirthdayMonth,
  listParents,
  linkParent,
  unlinkParent,
  createParent,
  listAllParents,
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
