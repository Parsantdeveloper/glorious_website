
import { describe } from "zod/v4/core";
import prisma from "../../config/prisma";
import { CreateProductPayload,UpdateProductPayload, UpdateProductVariantPayload ,UpdateProductSpecification, ProductVariant , GetProductsQuery} from "./product.schema";
import slug from "slug";
import { ProductOrderByWithRelationInput, ProductWhereInput } from "generated/prisma/models";
import generateSKU from "libs/skuGenerator";
import { SortOrder } from "generated/prisma/internal/prismaNamespace";
import { Prisma } from "generated/prisma/browser";

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
        include: productInclude
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
       const { name, description, categoryId, brandId, isActive,specifications } = data ;
       const product = await prisma.product.update({
        where:{
            id
        },
        data:{
            name,description,categoryId,brandId,isActive,specifications
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
                attributes: data.attributes || undefined
            }
        })
        return productVariant ;
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

    async softDeleteProductVariant(id:string){
       const variant = await prisma.productVariant.update({
        where:{id},
        data:{isActive:false}
       })
       return variant ;  
    }

   async getProducts(input: GetProductsQuery) {
    const {
      search,
      category,
      brand,
      isActive,
      page,
      limit,
      price,
      stock,
      minPrice,
      maxPrice,
      stockStatus,
    } = input;

    // ── Where clause ────────────────────────────────────────────────────────

    const whereClause: ProductWhereInput = {
      AND: [
        // Full-text search on name + description
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},

        // Category filter
        category ? { categoryId: { in: category } } : {},

        // Brand filter
        brand ? { brandId: { in: brand } } : {},

        // Active status
        isActive !== undefined ? { isActive } : {isActive: true},

        // Price range — match products that have at least one variant in range
        minPrice !== undefined || maxPrice !== undefined
          ? {
              variants: {
                some: {
                  AND: [
                    minPrice !== undefined ? { price: { gte: minPrice } } : {},
                    maxPrice !== undefined ? { price: { lte: maxPrice } } : {},
                  ],
                },
              },
            }
          : {},

        // Stock status filter
        stockStatus === "out_of_stock"
          ? {
              variants: {
                every: { isInStock: false },
              },
            }
          : stockStatus === "in_stock"
          ? {
              variants: {
                some: { isInStock: true, stockCount: { gt: 10 } },
              },
            }
          : stockStatus === "low_stock"
          ? {
              variants: {
                some: { isInStock: true, stockCount: { gt: 0, lte: 10 } },
              },
            }
          : {},
      ],
    };

    // ── Order by clause ──────────────────────────────────────────────────────
    // Prisma does NOT support orderBy on relation scalar fields (variants.price).
    // Strategy:
    //   - price / stock sort  → fetch all matching IDs with raw aggregation, then paginate
    //   - createdAt sort      → standard Prisma orderBy (fast, index-friendly)

    const needsRelationSort = price !== undefined || stock !== undefined;

    if (needsRelationSort) {
      return this.getProductsSortedByVariant({
        whereClause,
        price,
        stock,
        page,
        limit,
      });
    }

    // Standard sort (newest / oldest)
    const orderByClause: Prisma.ProductOrderByWithRelationInput = {
      createdAt: "desc",
    };

    // ── Paginate ─────────────────────────────────────────────────────────────

    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        orderBy: orderByClause,
        skip,
        take: limit,
        include: productInclude,
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    return buildResponse(products, totalCount, page, limit);
  }

    async getMetaForFilters(){
        const [categories, brands] = await Promise.all([
            prisma.category.findMany({
                where:{isActive:true},
                select:{
                    id:true,
                    name:true,
                    slug:true
                }
            }),
            prisma.brand.findMany({
                where:{isActive:true},
                select:{
                    id:true,
                    name:true,
                    slug:true
                }
            })
        ])
        return { categories, brands };
    } 

    async softDeleteProduct(id:string){
      const product = await prisma.product.update({
        where:{id},
        data:{isActive:false}
      })
      return product ;
    }
    
    private async getProductsSortedByVariant({
    whereClause,
    price,
    stock,
    page,
    limit,
  }: {
    whereClause: ProductWhereInput;
    price?: SortOrder;
    stock?: SortOrder;
    page: number;
    limit: number;
  }) {
    // 1. Fetch ALL matching product IDs with their aggregated variant data
    const productsWithAggregates = await prisma.product.findMany({
      where: whereClause,
      select: {
        id: true,
        variants: {
          where: { isActive: true },
          select: { price: true, stockCount: true },
        },
      },
    });

    // 2. Compute sort key per product
    type SortableProduct = { id: string; sortPrice: number; sortStock: number };

    const sortable: SortableProduct[] = productsWithAggregates.map((p) => {
      const prices = p.variants.map((v) => Number(v.price));
      const stocks = p.variants.map((v) => v.stockCount ?? 0);
      return {
        id: p.id,
        sortPrice: prices.length ? Math.min(...prices) : Infinity,
        sortStock: stocks.reduce((a, b) => a + b, 0),
      };
    });

    // 3. Sort
    sortable.sort((a, b) => {
      if (price) {
        const diff = price === "asc"
          ? a.sortPrice - b.sortPrice
          : b.sortPrice - a.sortPrice;
        if (diff !== 0) return diff;
      }
      if (stock) {
        const diff = stock === "asc"
          ? a.sortStock - b.sortStock
          : b.sortStock - a.sortStock;
        if (diff !== 0) return diff;
      }
      return 0;
    });

    const totalCount = sortable.length;

    // 4. Paginate IDs
    const skip = (page - 1) * limit;
    const pageIds = sortable.slice(skip, skip + limit).map((p) => p.id);

    if (pageIds.length === 0) {
      return buildResponse([], totalCount, page, limit);
    }

    // 5. Fetch full data for this page — preserve sorted order
    const products = await prisma.product.findMany({
      where: { id: { in: pageIds } },
      include: productInclude,
    });

    // Re-sort to match the order of pageIds (findMany doesn't guarantee order)
    const ordered = pageIds
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean);

    return buildResponse(ordered, totalCount, page, limit);
  }


}

const productInclude = {
  category: {
    select: { id: true, name: true, slug: true },
  },
  brand: {
    select: { id: true, name: true, slug: true },
  },
  variants: {
    where: { isActive: true },
    select: {
      id: true,
      sku: true,
      price: true,
      salePrice: true,
      stockCount: true,
      isInStock: true,
      attributes: true,
      dimensions:true,
      images: true,
    },
  },
} satisfies Prisma.ProductInclude;

// ── Response builder ───────────────────────────────────────────────────────────

function buildResponse<T>(data: T[], total: number, page: number, limit: number) {
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };

   
}

const productRepository = new ProductRepository();
export default productRepository;
