import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(2).max(255),
    description: z.string().min(2).max(5000).optional(),
    categoryId: z.string().uuid("Invalid categoryId"),
    brandId: z.string().uuid("Invalid brandId"),
    isActive: z.boolean().default(true),
});

export const productVariantSchema = z.object({
    price: z.number().positive(),
    salePrice: z.number().positive().optional(),
    stockCount: z.number().int().nonnegative(),

    attributes: z.json().optional(),
    images: z.array(
        z.object({
            url: z.string().url(),
            alt: z.string().optional(),
            position: z.number().int().nonnegative().optional(),
        })
    ).optional(),

    weight: z.number().positive().optional(),
    dimensions: z.object({
        length: z.number().positive(),
        width: z.number().positive(),
        height: z.number().positive(),
    }).optional(),

    isActive: z.boolean().default(true),
}).refine((data)=>{
    if(data.salePrice && data.salePrice > data.price){
        return {
            message:"Sale price cannot be greater than regular price",
            path:["salePrice"]
        }
    }
})

export const productSpecificationSchema = z.object({
    key: z.string().min(1).max(100),
    value: z.string().min(1).max(500),
});

export const createProductPayloadSchema=z.object({
    product: createProductSchema,
    variants: z.array(productVariantSchema).min(1),
    specifications: z.array(productSpecificationSchema).optional(),
})

export type CreateProductPayload = z.infer<typeof createProductPayloadSchema>;