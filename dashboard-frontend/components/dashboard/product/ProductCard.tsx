'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Package } from 'lucide-react'
import { useState } from 'react'
import { Product } from '@/types/product'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ProductCardProps {
  product: Product
  onDelete: (productId: string) => void
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const firstVariant = product.variants[0]
  const minPrice = Math.min(...product.variants.map(v => v.salePrice || v.price))
  const maxPrice = Math.max(...product.variants.map(v => v.price))
  const totalStock = product.variants.reduce((sum, v) => sum + v.stockCount, 0)

  const handleDelete = () => {
    setIsDeleting(true)
    onDelete(product.id)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors p-4 flex items-center gap-4">
      {/* Product Image */}
      <div className="relative w-24 h-24 shrink-0 bg-gray-100 rounded-md overflow-hidden">
        {firstVariant?.images[0] && (
          <img
            src={firstVariant.images[0].url || '/placeholder.png'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-black truncate">{product.name}</h3>
          <p className="text-sm text-gray-600 truncate">
            {product.brand.name} • {product.category.name}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-600 pt-1">
            <span>Npr {minPrice.toFixed(2)}</span>
            {minPrice !== maxPrice && (
              <span className="text-gray-500">- Npr {maxPrice.toFixed(2)}</span>
            )}
            <div className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              <span>{totalStock} in stock</span>
            </div>
          </div>
        </div>
      </div>

      {/* Variants Badge */}
      {product.variants.length > 0 && (
        <div className="shrink-0 px-3 py-1.5 bg-gray-100 rounded-md border border-gray-300">
          <span className="text-sm font-medium text-black">
            {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link href={`/dashboard/product/${product.slug}`}>
          <Button
            variant="outline"
            className="border-gray-300 text-black hover:bg-gray-50"
            size="sm"
          >
            Edit
          </Button>
        </Link>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
              disabled={isDeleting}
              size="sm"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete{' '}
                <span className="font-semibold text-black">"{product.name}"</span>{' '}
                and remove all its data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}