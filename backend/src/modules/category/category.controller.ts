
import { Request,Response,NextFunction } from "express";
import { CategoryService } from "./category.service";
import { CreateCategorySchema,GetCategoriesSchema,UpdateCategorySchema} from "./category.schema";
import { ApiResponse } from "utils/ApiResponce";
const categoryService=new CategoryService();

export const createCategory=async(req:Request,res:Response,next:NextFunction)=>{
  try {
    let category = await categoryService.createCategory(CreateCategorySchema.parse(req.body));
    res.status(201).json( ApiResponse.success( category,"Category created successfully"));
  } catch (error) {
    next(error)
  }
}

export const getCategories=async(req:Request,res:Response,next:NextFunction)=>{
  try {
    let categories = await categoryService.getCategories(GetCategoriesSchema.parse(req.query));
res.status(200).json(
  new ApiResponse({
    success: true,
    message: "Categories fetched successfully",
    data: categories.data,
    meta: categories.meta,
  })
);  } catch (error) {
    next(error)
  }
}


export const updateCategory= async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const data = UpdateCategorySchema.parse(req.body)
    const id:string =req.params.id as string ;
  const category = await categoryService.updateCategory({
  id,
  data,
})
res.status(200).json( ApiResponse.success(category,"Category updated successfully"))
  } catch (error) {
    next(error)
  }
}

export const deleteCategory=async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const id = req.params.id as string;
    const category = await categoryService.deleteCategory(id);
    res.status(200).json(ApiResponse.success(category,"Category deleted successfully"))
  } catch (error) {
    next(error)
  }
}