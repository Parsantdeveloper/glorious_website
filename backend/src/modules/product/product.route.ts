import express from "express"
 import { createProductHandler, createProductVariant, getMetaForFilters, getProductById, getProducts, searchProducts, softDeleteProduct, softDeleteProductVariant, updateProduct, updateProductVariant, } from "./product.controller";
const router = express.Router();

// create a new product 
  router.post("/", createProductHandler);

  // create product variant 

  // get products with filters and pagination
router.get("/", getProducts);

  router.post("/:id/variants", createProductVariant);

  // search products by search term . 
  router.get("/search", searchProducts);
// get products 
  router.get("/:slug", getProductById);

//update product variant 

router.put("/:slug/variant/:variantId", updateProductVariant);
 
// update product 
  router.put("/:id", updateProduct);


// router.put("/:id/specifications/:specId", updateProduct);



// delete product (soft delete)
  // router.delete("/:id", createProductHandler);

 // get meta for filters 

 router.get("/filters/meta", getMetaForFilters);

 // soft delete product 

 router.delete("/:id",softDeleteProduct);

 // soft delete product variant
 
 router.delete("/variant/:variantId", softDeleteProductVariant);

export default router ;