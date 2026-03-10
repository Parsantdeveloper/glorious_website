'use client'

import { Product } from '@/types/product'
import ProductCard from './ProductCard'



interface ProductListProps {
  products: Product[]
  onDelete: (productId: string) => void
}

export default function ProductList({ products, onDelete }: ProductListProps) {
  return (
    <div className="grid grid-cols-1  gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
