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
import { useFilterMetaStore } from '@/app/store/filterMetaStore'
import { Product } from '@/types/full_product'

interface Specification {
  key: string
  value: string
}

interface ProductDialogProps {
  product?: Product
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit: (data: any) => void
  children?: React.ReactNode
}

export default function ProductDialog({
  product,
  isOpen: controlledIsOpen,
  onOpenChange,
  onSubmit,
  children,
}: ProductDialogProps) {
  const [isOpen, setIsOpen] = useState(controlledIsOpen ?? false)


  const [formData, setFormData] = useState({
    name: '',
    brandId: '',
    description: '',
    categoryId: '',
    // status: 'ACTIVE',
    specifications: [] as Specification[],
  })

  // Sync controlled open prop
  useEffect(() => {
    setIsOpen(controlledIsOpen ?? false)
  }, [controlledIsOpen])

  // Populate form when dialog opens or product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name ?? '',
        description: product.description ?? '',
        // Resolve IDs — product.brand and product.category may be objects with id
        brandId: (product.brand as any)?.id ?? product.brandId ?? '',
        categoryId: (product.category as any)?.id ?? product.categoryId ?? '',
        // status: product.status ?? 'ACTIVE',
        specifications: product.specifications ?? [],
      })
    } else {
      setFormData({
        name: '',
        brandId: '',
        description: '',
        categoryId: '',
        // status: 'ACTIVE',
        specifications: [],
      })
    }
  }, [product, isOpen])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    onOpenChange?.(open)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }],
    }))
  }

  const handleSpecificationChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      ),
    }))
  }

  const handleRemoveSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
    handleOpenChange(false)
  }
     const {brands, categories} = useFilterMetaStore();


  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children && (
        <div onClick={() => handleOpenChange(true)}>
          {children}
        </div>
      )}

      <DialogContent className="sm:max-w-[500px] rounded-2xl p-4 bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-black">
            {product ? 'Edit Product' : 'Create New Product'}
          </DialogTitle>
          <DialogDescription>
            {product
              ? 'Update product details and specifications'
              : 'Add a new product to your inventory'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Premium Wireless Headphones"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
              required
            />
          </div>

          {/* Brand & Category — dropdowns */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Brand
              </label>
              <select
                name="brandId"
                value={brands?.find((b: any) => b.id === formData.brandId)?.id || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
                required
              >
                <option value="" disabled>
                  Select brand
                </option>
                {brands?.map((b: { id: string; name: string }) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Category
              </label>
              <select
                name="categoryId"
                value={categories.find((c: any) => c.id === formData.categoryId)?.id || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
                required
              >
                <option value="" disabled>
                  Select category
                </option>
                {categories?.map((c: { id: string; name: string }) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Product description..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
            />
          </div>

          {/* Status */}
          {/* <div>
            <label className="block text-sm font-medium text-black mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div> */}

          {/* Specifications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-black">
                Specifications
              </label>
              <button
                type="button"
                onClick={handleAddSpecification}
                className="text-sm text-black hover:text-gray-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {formData.specifications.map((spec, index) => (
              <div key={index} className="flex gap-2 items-center">
                <div className="flex-1">
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                    placeholder="Key (e.g., Driver Size)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black text-sm"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                    placeholder="Value (e.g., 40mm)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSpecification(index)}
                  className="text-red-600 hover:text-red-700 p-2 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
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
              {product ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}