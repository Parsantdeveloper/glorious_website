import express from "express"
 import { createProductHandler, getProductById } from "./product.controller";

const router = express.Router();

// create a new product 
  router.post("/", createProductHandler);

// get products 
  router.get("/:id", getProductById);
// update product 

// delete product (soft delete)



export default router ;