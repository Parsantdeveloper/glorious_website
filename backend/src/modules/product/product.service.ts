
import { ConflictError, } from "utils/error";
import { CreateProductPayload, UpdateProductPayload, UpdateProductVariantPayload,ProductVariant, GetProductsQuery } from "./product.schema";
import productRepository from "./product.repository";
import redis from "../../libs/redis";


export class ProductService {
    async createProduct(data: CreateProductPayload) {
        const existingProduct = await productRepository.findByName(data.product.name);
        if (existingProduct) {
            throw new ConflictError("Product with the same name already exists");
        }
        const product = await productRepository.createFirstProduct(data);
        if (!product) {
            throw new Error("Failed to create product");
        }
        return product;
    }

    async getProductBySlug(slug: string) {
        const cacheKey = `product:${slug}`;
        try {
            const chachedProduct = await redis.get(cacheKey);
            if (chachedProduct) {
                return JSON.parse(chachedProduct);
            }
            console.log("CACHE MISS:", cacheKey);

            const product = await productRepository.findBySlug(slug);
            console.log("product slug ", slug)
            if (!product) {
                throw new ConflictError("Product not found");
            }
            await redis.set(cacheKey, JSON.stringify(product), "EX", 300);
            console.log("cache set for", cacheKey)
            return product;
        } catch (error) {
            throw error;
        }

    }

    async searchProducts(searchTerm: string) {
        let searchKey = `search:${searchTerm}`;
        try {
            const cachedResults = await redis.get(searchKey);
            if (cachedResults) {
                return JSON.parse(cachedResults);
            }
            const results = await productRepository.searchProducts(searchTerm);
            await redis.set(searchKey, JSON.stringify(results), "EX", 300);
            return results;
        } catch (error) {
            throw error;
        }
    }
    async updateProduct(id: string, data: UpdateProductPayload) {
        try {
            let cacheKey = `product:${id}`;
            const updatedProduct = await productRepository.updateProduct(id, data);
            if (!updatedProduct) {
                throw new Error("Failed to update product");
            }
            await redis.del(cacheKey);
            return updatedProduct;
        } catch (error) {
            throw error;
        }
    }

    async updateProductVariant(id: string, variantId: string, data: UpdateProductVariantPayload) {
        try {
            let cacheKey = `product:${id}`;
            const updatedProductVariant = await productRepository.updateProductVariant(id, variantId, data);
            if (!updatedProductVariant) {
                throw new Error("Failed to update product variant");
            }
            await redis.del(cacheKey);
            return updatedProductVariant;
        } catch (error) {
            throw error;
        }
    }
    
    async createProductVariant(productId: string, data: ProductVariant) {
        try {
            let cacheKey = `product:${productId}`;
            const productVariant = await productRepository.createProductVariant(productId, data);
            if (!productVariant) {
                throw new Error("Failed to create product variant");
            }
            await redis.del(cacheKey);
            return productVariant;
        } catch (error) {
            throw error;
        }
    }
    
   async getProducts(query:GetProductsQuery){
    try {
        let cacheKey = `products:${JSON.stringify(query)}`;
        const cachedResults = await redis.get(cacheKey);
        if (cachedResults) {
            return JSON.parse(cachedResults);
        }
        const products = await productRepository.getProducts(query);
        await redis.set(cacheKey, JSON.stringify(products), "EX", 300);
        return products;
    } catch (error) {
        throw error;
    }
   }


}




const productService = new ProductService();

export default productService;