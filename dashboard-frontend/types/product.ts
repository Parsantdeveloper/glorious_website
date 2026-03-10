export interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
  meta: Meta;
}

export interface Meta {
  total: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  slug: string;
  categoryId: string;
  brandId: string;
  avgRating: number | null;
  reviewCount: number;
  isActive: boolean;
  metadata: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  category: Category;
  brand: Brand;
  variants: Variant[];
}
export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
}

export interface Variant {
  id: string;
  sku: string;
  price: number;
  salePrice: number | null;
  stockCount: number;
  isInStock: boolean;
  attributes: Record<string, string>;
  images: ProductImage[];
}

export interface ProductImage {
  url: string;
  alt?: string;
  position?: number;
}

export interface Specification {
  id: string;
  productId: string;
  key: string;
  value: string;
}