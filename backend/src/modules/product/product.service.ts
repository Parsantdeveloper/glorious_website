
import { ConflictError, } from "utils/error";
import { CreateProductPayload } from "./product.schema";
import productRepository from "./product.repository";

export class ProductService {
    async createProduct(data:CreateProductPayload){
        const existingProduct = await productRepository.findByName(data.product.name);
        if(existingProduct){
            throw new ConflictError("Product with the same name already exists");
        }
        const product = await productRepository.createFirstProduct(data);
        if(!product){
            throw new Error("Failed to create product");
        }
        return product;
    }
 
     async getProductById(id:string){
        const product = await productRepository.findById(id);
        if(!product){
            throw new ConflictError("Product not found");
        }
        return product;
     }
    
}

  const productService = new ProductService();

  export default productService;