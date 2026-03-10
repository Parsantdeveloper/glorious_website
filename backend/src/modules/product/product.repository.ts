
import { describe } from "zod/v4/core";
import prisma from "../../config/prisma";
import { CreateProductPayload,UpdateProductPayload, UpdateProductVariantPayload ,UpdateProductSpecification, ProductVariant , GetProductsQuery} from "./product.schema";
import slug from "slug";
import { ProductOrderByWithRelationInput, ProductWhereInput } from "generated/prisma/models";
import generateSKU from "libs/skuGenerator";
import { SortOrder } from "generated/prisma/internal/prismaNamespace";
class ProductRepository {

    async createFirstProduct(data: CreateProductPayload) {
        let product_slug = await slug(data.product.name, { lower: true })

        const { product, variants, specifications } = data;
        const productRecord = await prisma.$transaction(
            async (tx) => {
                const new_product = await tx.product.create({
                    data: {
                        ...product,
                        specifications: specifications || undefined,
                        slug: product_slug,
                    }
                });
                const product_id = new_product.id;
                await Promise.all(
                    variants.map(async (variant) => {
                        return await tx.productVariant.create({
                            data: {
                                ...variant,
                                productId: product_id,
                            sku: generateSKU(product_slug, variant.attributes ),
                                attributes: variant.attributes ?? "undefined"
                            }
                        })
                    })
                )

                // if (specifications && specifications.length > 0) {
                //     await Promise.all(
                //         specifications.map(async (spec) => {
                //             return await tx.productSpecification.create({
                //                 data: {
                //                     ...spec,
                //                     productId: product_id
                //                 }
                //             })
                //         })
                //     )
                // }

                return new_product;
            }
        )
        return productRecord;
    }

    async findByName(name: string) {
        let product_slug = await slug(name, { lower: true })
        return await prisma.product.findUnique({
            where: {
                slug: product_slug
            }
        })
    }

    async findBySlug(slug: string) {
        return await prisma.product.findUnique({
            where: {
                slug
            },
            include: {
                variants: true,

            }
        })
    }

    async searchProducts(searchTerm: string) {
        return prisma.product.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                    },
                    {
                        description: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                    },
                ],
                isActive: true
            },
            select: {
                id: true,
                name: true,
                description: true,
                slug: true
            },
            take: 10
        });
    }

    async updateProduct(id:string , data:UpdateProductPayload) {
       const { name, description, categoryId, brandId, isActive } = data ;
       const product = await prisma.product.update({
        where:{
            id
        },
        data:{
            name,description,categoryId,brandId,isActive
        }
       })
         return product ;
     }

     async updateProductVariant(id:string,data:UpdateProductVariantPayload) {
        const productVariant = await prisma.productVariant.update({
            where:{
                id
            },
            data:{
                ...data,
                attributes: data.attributes ? JSON.stringify(data.attributes) : undefined
            }
        })
        return productVariant ;
     }

     async updateProductSpecification(id:string,data:UpdateProductSpecification) {
        const productSpecification = await prisma.productSpecification.update({
            where:{
                id
            },
            data:{
                ...data
            }
        })
        return productSpecification ;
     }

    async createProductVariant(productId:string, data:ProductVariant) {

         const product = await prisma.product.findUnique({
            where:{id:productId},
            select:{id:true,slug:true}
         })
         if(!product){
            throw new Error("Product not found");
         }
        
        const productVariant = await prisma.productVariant.create({
            
            data:{
                ...data,
                productId,
                sku: generateSKU(product.slug, data.attributes ),
                attributes: data.attributes ?? undefined

            }
        })
        return productVariant ;
        }

     async getProducts(input:GetProductsQuery){
        const { search, category, isActive, page, price , limit , brand , minPrice,maxPrice } = input;
        const whereClause:ProductWhereInput={
            AND:[
                search ? {
                    OR:[
                        {
                            name:{
                                contains: search,
                                mode: "insensitive"},
                                
                        },
                        {
                            description:{
                                    contains: search,
                                    mode: "insensitive"
                                }
                        }
                    ]
                }:{},
                category ? { categoryId: category } : {},
                brand ? { brandId: brand } : {},
                isActive !== undefined ? { isActive } : {},
                minPrice !== undefined || maxPrice !== undefined ? {
                    variants: {
                        some: {
                            AND:[
                                minPrice !== undefined ? { price: { gte: minPrice } } : {},
                                maxPrice !== undefined ? { price: { lte: maxPrice } } : {}
                            ]
                        }
                    }
                } : {},
              
            ]
        }
        const orderByClause:any = price ? { variants: { price: price as SortOrder } } : { createdAt: "desc" };

        // pagination 
          const skip = (page-1) * limit;   

        const [product , totalCount]=await Promise.all([
            prisma.product.findMany({
                where: whereClause,
                orderBy: orderByClause,
                skip,
                take: limit,
                include:{
                    category:{
                        select:{
                            id:true,
                            name:true,
                            slug:true
                        }
                        
                    },
                    brand:{
                        select:{
                            id:true,
                            name:true,
                            slug:true
                        }
                    },
                    variants:{
                        where:{isActive:true},
                        select:{
                            id:         true,
                       sku:        true,
            price:      true,
            salePrice:  true,
            stockCount: true,
            isInStock:  true,
            attributes: true,
            images:     true,
                        }
                    }
                }
            }),
            prisma.product.count({ where:whereClause}),

        ])

        return{
            data: product,
            meta:{
                total:totalCount,
                page:page,
                limit:limit,
                totalPages: Math.ceil(totalCount/limit)
            },

        }

     }

        

}
   
   


const productRepository = new ProductRepository();
export default productRepository;