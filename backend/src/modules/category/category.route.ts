
import express from "express";
import { createCategory, deleteCategory, getCategories, updateCategory } from "./category.controller";
import { requireAdmin } from "middlewares/adminGuard";
import { requireAuth } from "middlewares/requiredAuth";
const router = express.Router();

// get categories 
  router.get("/", getCategories);
 
// create categories 

  router.post("/", requireAuth, createCategory);


// update categories 
  router.put("/:id",requireAuth,updateCategory)

// delete categories (soft_delete)

  router.delete("/:id",requireAuth,deleteCategory)

 

export default router ;