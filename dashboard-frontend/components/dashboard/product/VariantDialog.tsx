'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Trash2 } from 'lucide-react'
import React from 'react'
import { Variant,ProductImage ,  } from '@/types/full_product'
import ImageUpload from '@/components/ui/image-upload'

interface VariantDialogProps {
  variant?: Variant
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit: (data: any) => void
  children?: React.ReactNode
}

export default function VariantDialog({
  variant,
  isOpen: controlledIsOpen,
  onOpenChange,
  onSubmit,
  children,
}: VariantDialogProps) {
  const [isOpen, setIsOpen] = useState(controlledIsOpen ?? false)
  const [attributes, setAttributes] = useState<Array<{ key: string; value: string }>>([])
  const [formData, setFormData] = useState({
    price: 0,
    salePrice: null as number | null,
    stockCount: 0,
    images: [] as ProductImage[],
    attributes: {} as Record<string, string>,
  })

  useEffect(() => {
    if (variant) {
      setFormData({
        price: variant.price ,
        salePrice: variant.salePrice,
        stockCount: variant.stockCount,
        images: variant.images,
        attributes: variant.attributes,
      })
      setAttributes(
        Object.entries(variant.attributes).map(([key, value]) => ({
          key,
          value,
        }))
      )
    } else {
      setFormData({
        price: 0,
        salePrice: null,
        stockCount: 0,
        images: [],
        attributes: {},
      })
      setAttributes([])
    }
  }, [variant, isOpen])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    onOpenChange?.(open)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }))
  }

  const handleAddAttribute = () => {
    setAttributes([...attributes, { key: '', value: '' }])
  }

  const handleAttributeChange = (index: number, field: string, value: string) => {
    setAttributes(prev =>
      prev.map((attr, i) => (i === index ? { ...attr, [field]: value } : attr))
    )
  }

  const handleRemoveAttribute = (index: number) => {
    setAttributes(prev => prev.filter((_, i) => i !== index))
  }

  




  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const attributesObj = attributes.reduce(
      (acc, attr) => ({
        ...acc,
        [attr.key]: attr.value,
      }),
      {}
    )

    onSubmit({
      ...formData,
      attributes: attributesObj,
      images: formData.images.filter(img => img),
    })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children && (
        <div onClick={() => handleOpenChange(true)}>
          {children}
        </div>
      )}

      <DialogContent className="sm:max-w-150 p-8 rounded-2xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-black">
            {variant ? 'Edit Variant' : 'Create New Variant'}
          </DialogTitle>
          <DialogDescription>
            {variant
              ? 'Update variant details, pricing, and inventory'
              : 'Add a new variant with specific attributes and pricing'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* SKU & Name */}
          <div className="grid grid-cols-2 gap-4">
          
           
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Base Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Sale Price (Optional)
              </label>
              <input
                type="number"
                name="salePrice"
                value={formData.salePrice ?? ''}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    salePrice: e.target.value ? parseFloat(e.target.value) : null,
                  }))
                }
                placeholder="0.00"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Stock Quantity
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stockCount}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
              required
            />
          </div>

          {/* Attributes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-black">
                Attributes
              </label>
              <button
                type="button"
                onClick={handleAddAttribute}
                className="text-sm text-black hover:text-gray-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {attributes.map((attr, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1">
                  <input
                    type="text"
                    value={attr.key}
                    onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                    placeholder="Key (e.g., Color)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black text-sm"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={attr.value}
                    onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                    placeholder="Value (e.g., Black)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAttribute(index)}
                  className="text-red-600 hover:text-red-700 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Images */}
          <div className="space-y-3">
           <ImageUpload multiple onChange={} maxFiles={5} ></ImageUpload>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-gray-300"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-black text-white hover:bg-gray-800"
            >
              {variant ? 'Update Variant' : 'Create Variant'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
