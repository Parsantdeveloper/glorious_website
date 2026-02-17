
import { CreateCategoryInput, UpdateCategoryInput } from "./category.schema";
import slug from "slug";
import prisma from "config/prisma";
import { ConflictError } from "utils/error";
import { GetCategoriesInput } from "./category.schema";
import { Prisma } from "generated/prisma/browser";
import { updateImageName } from "modules/uploads/uploads.controller";
import { destroyImage } from "libs/ImageDestroyer";
export class CategoryService {

  async createCategory(input: CreateCategoryInput) {
    const { name } = input;
    const slugName = slug(name, { lower: true });

    // Check if slug already exists
    const existing = await prisma.category.findUnique({
      where: { slug: slugName },
    });

    if (existing) throw new ConflictError("Category already exists");
    let imageId: string | undefined
    let imageUrl: string | undefined

    if (input.imageId) {
      let image = await updateImageName(input.imageId);
      if (!image) {
        throw new Error('Failed to process image');
      }
      imageId = image.public_id;
      imageUrl = image.secure_url;
    }
    const category = await prisma.category.create({
      data: {
        ...input,
        slug: slugName,
        imageId,
        imageUrl
      },
    });


    return category;
  }

  async getCategories(input: GetCategoriesInput) {
    const { parentId, search, page, limit } = input;
    const where: Prisma.CategoryWhereInput = {
      ...(parentId != undefined && { parentId }),
      isActive: true,
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }),
    }
    const [data, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [
          { sortOrder: "asc" },
          // { createdAt: "desc" },
        ],
        select: {
          id: true,
          name: true,
          slug: true,
          parentId: true,
          imageUrl: true,
          sortOrder: true,
        },
      }),
      prisma.category.count({ where }),
    ]);
    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

async updateCategory(input: UpdateCategoryInput) {
  const { id, data } = input;

  // 1. Fetch existing category image
  const existingCategory = await prisma.category.findUnique({
    where: { id },
    select: { imageId: true },
  });

  if (!existingCategory) {
    throw new Error("Category not found");
  }

  let imageUpdate = {};

  // 2. If new image is provided
  if (data.imageId) {
    const updatedImage = await updateImageName(data.imageId);

    imageUpdate = {
      imageId: updatedImage.publicId,
      imageUrl: updatedImage.secureUrl,
    };
  }

  // 3. Update category
  const category = await prisma.category.update({
    where: { id },
    data: {
      ...data,
      ...imageUpdate,
    },
  });

  // 4. Destroy ONLY old image (never the new one)
  if (
    data.imageId &&
    existingCategory.imageId &&
    existingCategory.imageId !== category.imageId
  ) {
    await destroyImage(existingCategory.imageId);
  }

  return category;
}


  async deleteCategory(id: string) {
    const category = await prisma.category.update({
      where: { id },
      data: {
        isActive: false
      }
    })
    if (!category) throw new Error("Category not found");
    return category;
  }
}