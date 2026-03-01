
import prisma from "../../config/prisma";
import { CreateProductPayload } from "./product.schema";
import slug from "slug";
class ProductRepository {

    async createFirstProduct(data: CreateProductPayload) {
        let product_slug = await slug(data.product.name, { lower: true })

        const { product, variants, specifications } = data;
           const productRecord = await prisma.$transaction(
            async (tx) => {
                const new_product = await tx.product.create({
                    data: {
                        ...product,
                        slug: product_slug,
                    }
                });
                const product_id = new_product.id;
                await Promise.all(
                    variants.map(async (variant) => {
                        const sku = `${product_slug}-${Math.random().toString(36).substring(2, 7)}$${variant.dimensions?.width || ""}${variant.dimensions?.height || ""}${variant.dimensions?.length || ""}`;
                        return await tx.productVariant.create({
                            data: {
                                ...variant,
                                productId: product_id,
                                sku,
                                attributes: variant.attributes ?? "undefined"
                            }
                        })
                    })
                )

                if (specifications && specifications.length > 0) {
                    await Promise.all(
                        specifications.map(async (spec) => {
                            return await tx.productSpecification.create({
                                data: {
                                    ...spec,
                                    productId: product_id
                                }
                            })
                        })
                    )
                }

            }
        )
        return product;
    }

    async findByName(name:string){
        let product_slug = await slug(name, { lower: true })
        return await prisma.product.findUnique({
            where:{
                slug: product_slug
            }
        })
    }

    async findById(id:string){
        return await prisma.product.findUnique({
            where:{
                id
            },
            include:{
                variants:true,
                specifications:true
            }
        })
    }
}

const productRepository = new ProductRepository();
export default productRepository;