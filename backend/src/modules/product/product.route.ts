import express from "express"
 import { createProductHandler, createProductVariant, getProductById, getProducts, searchProducts, updateProduct, updateProductVariant } from "./product.controller";

const router = express.Router();

// create a new product 
  router.post("/", createProductHandler);

  // create product variant 

  router.post("/:id/variants", createProductVariant);

  // search products by search term . 
  router.get("/search", searchProducts);
// get products 
  router.get("/:slug", getProductById);


 
// update product 
  router.put("/:id", updateProduct);

// update product variant 

router.put("/:id/variants/:variantId", updateProductVariant);

// router.put("/:id/specifications/:specId", updateProduct);

// get products with filters and pagination
router.get("/", getProducts);

// delete product (soft delete)
  // router.delete("/:id", createProductHandler);



export default router ;