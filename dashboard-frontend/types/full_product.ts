export interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
  meta: Meta;
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
  meta: Record<string, any>;
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

  category?: Category;
  brand?: Brand;

  variants: Variant[];
  specifications?: Specification[];
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
  id?: string;
  productId?: string;
  sku?: string;
  price: number;
  salePrice: number | 0;
  stockCount: number;

  isActive: boolean;
  isInStock?: boolean;

  attributes: Record<string, string>;

  images: ProductImage[];

  weight?: number;
  dimensions?: dimension | null;

  createdAt?: string;
  updatedAt?: string;
}

export interface ProductImage {
  url: string;
  alt?: string;
  position?: number;
}



type dimension={
    length:number , 
    width:number , 
    height:number
}

export interface Specification {
  id?: string;
  key: string;
  value: string;
}