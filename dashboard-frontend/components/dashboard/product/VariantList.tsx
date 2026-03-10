'use client'

import { Button } from '@/components/ui/button'
import { Edit2, Trash2, Package } from 'lucide-react'
import { useState } from 'react'
import { Variant } from '@/types/full_product'


interface VariantListProps {
  variants: Variant[]
  onEdit: (variant: Variant) => void
  onDelete: (variantId: string) => void
}

export default function VariantList({ variants, onEdit, onDelete }: VariantListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = (variantId: string) => {
    if (window.confirm('Are you sure you want to delete this variant?')) {
      setDeletingId(variantId)
      onDelete(variantId)
    }
  }

  return (
    <div className="space-y-3">
      {variants.map(variant => (
        <div
          key={variant.id}
          className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4 hover:border-gray-300 transition-colors"
        >
          {/* Image */}
          <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
            {variant.images[0] && (
              <img
                src={variant.images[0]}
                alt={variant.images[0].alt || 'Variant Image'}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Variant Details */}
          <div className="flex-1">
            <div className="space-y-2">
              <div>
                <h4 className="font-semibold text-black">{variant.sku}</h4>
                <p className="text-sm text-gray-600">SKU: {variant.sku}</p>
              </div>

              {/* Attributes */}
              {variant.attributes && Object.keys(variant.attributes).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(variant.attributes).map(([key, value]) => (
                    <span
                      key={key}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                    >
                      {key}: {value}
                    </span>
                  ))}
                </div>
              )}

              {/* Pricing & Stock */}
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <p className="text-gray-600">Price</p>
                  <div className="flex items-baseline gap-2">
                    <p className="font-semibold text-black">
                      ${variant.price}
                    </p>
                    {variant.salePrice && (
                      <p className="text-gray-500 line-through text-xs">
                        ${variant.salePrice}
                      </p>
                    )}
                  </div>
                </div>
                {variant.salePrice && (
                  <div>
                    <p className="text-gray-600">Sale Price</p>
                    <p className="font-semibold text-black">
                      ${variant.salePrice}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600">Stock</p>
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4 text-gray-600" />
                    <p className={`font-semibold ${
                      variant.stockCount === 0
                        ? 'text-red-600'
                        : variant.stockCount < 10
                          ? 'text-orange-600'
                          : 'text-black'
                    }`}>
                      {variant.stockCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 text-black hover:bg-gray-50"
              onClick={() => onEdit(variant)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => handleDelete(variant.id)}
              disabled={deletingId === variant.id}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
