
import { Request, Response } from "express";
import { createProductPayloadSchema } from "./product.schema";
import productService from "./product.service";
import { ApiResponse } from "utils/ApiResponce";
 export const createProductHandler=async (req:Request, res:Response, next:Function)=>{
  try {
    const payload = createProductPayloadSchema.parse(req.body);
    const product = await productService.createProduct(payload);
    res.status(201).json( ApiResponse.success("Product created successfully", product));
  } catch (error) {
    next(error);
  }
 }

  export const getProductById = async (req:Request, res:Response, next:Function)=>{
    try {
        const  id :string = req.params.id as string;
        const product = await productService.getProductById(id);
        res.status(200).json( ApiResponse.success("Product retrieved successfully", product));
    } catch (error) {
        next(error)
    }
  }

