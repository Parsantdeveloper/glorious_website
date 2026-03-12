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
import { Variant, ProductImage } from '@/types/full_product'
import ImageUpload, { UploadedImage } from '@/components/ui/image-upload'

interface VariantDialogProps {
  variant?: Variant
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit: (data: any) => void
  children?: React.ReactNode
}

// Convert ProductImage (from API) → UploadedImage (for ImageUpload component)
function toUploadedImages(images: ProductImage[]): UploadedImage[] {
  return (images ?? []).map((img, i) => ({
    url: img.url,
    id: img.alt ?? `img-${i}`,           // use existing id or synthesise one
    position: img.position ?? i,
  }))
}

// Convert UploadedImage[] back → ProductImage[] for the submit payload
function toProductImages(images: UploadedImage[]): ProductImage[] {
  return images.map((img) => ({
    url: img.url,
    alt: img.id,
    position: img.position,
  }))
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
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])

  const [formData, setFormData] = useState({
    price: 0,
    salePrice: 0,
    stockCount: 0,
    weight: null as number | null,
    dimensions: {
      length: null as number | null,
      width: null as number | null,
      height: null as number | null,
    },
    isActive: true,
  })

  // Sync controlled open prop
  useEffect(() => {
    setIsOpen(controlledIsOpen ?? false)
  }, [controlledIsOpen])

  // Populate form when dialog opens or variant changes
  useEffect(() => {
    if (variant) {
      setFormData({
        price: variant.price ?? 0,
        salePrice: variant.salePrice ?? 0,
        stockCount: variant.stockCount ?? 0,
        weight: variant.weight ?? null,
        dimensions: {
          length: variant.dimensions?.length ?? null,
          width: variant.dimensions?.width ?? null,
          height: variant.dimensions?.height ?? null,
        },
        isActive: variant.isActive ?? true,
      })
      setAttributes(
        Object.entries(variant.attributes ?? {}).map(([key, value]) => ({
          key,
          value: String(value),
        }))
      )
      setUploadedImages(toUploadedImages(variant.images ?? []))
    } else {
      setFormData({
        price: 0,
        salePrice: 0,
        stockCount: 0,
        weight: null,
        dimensions: { length: null, width: null, height: null },
        isActive: true,
      })
      setAttributes([])
      setUploadedImages([])
    }
  }, [variant, isOpen])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    onOpenChange?.(open)
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? null : parseFloat(value),
    }))
  }

  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [name]: value === '' ? null : parseFloat(value),
      },
    }))
  }

  const handleAddAttribute = () => {
    setAttributes(prev => [...prev, { key: '', value: '' }])
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

    const attributesObj = attributes.reduce<Record<string, string>>(
      (acc, attr) => (attr.key ? { ...acc, [attr.key]: attr.value } : acc),
      {}
    )

    // Only include dimensions if at least one value is set
    const hasDimensions =
      formData.dimensions.length !== null ||
      formData.dimensions.width !== null ||
      formData.dimensions.height !== null

    onSubmit({
      ...formData,
      weight: formData.weight ?? undefined,
      dimensions: hasDimensions ? formData.dimensions : undefined,
      attributes: attributesObj,
      images: toProductImages(uploadedImages),
    })

    handleOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children && (
        <div onClick={() => handleOpenChange(true)}>
          {children}
        </div>
      )}

      <DialogContent className="sm:max-w-[560px] p-8 rounded-2xl bg-white max-h-[90vh] overflow-y-auto">
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

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Pricing ──────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Base Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleNumberChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Sale Price <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="number"
                name="salePrice"
                value={formData.salePrice ?? 0}
                onChange={handleNumberChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
              />
            </div>
          </div>

          {/* ── Stock ────────────────────────────────────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stockCount"
              value={formData.stockCount}
              onChange={handleNumberChange}
              placeholder="0"
              min="0"
              step="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
              required
            />
          </div>

          {/* ── Weight & Dimensions ──────────────────────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Weight (kg) <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight ?? ''}
              onChange={handleNumberChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Dimensions (cm) <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['length', 'width', 'height'] as const).map((dim) => (
                <div key={dim}>
                  <label className="block text-xs text-gray-500 mb-1 capitalize">{dim}</label>
                  <input
                    type="number"
                    name={dim}
                    value={formData.dimensions[dim] ?? ''}
                    onChange={handleDimensionChange}
                    placeholder="0"
                    step="0.1"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── Status ───────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, isActive: e.target.checked }))
              }
              className="w-4 h-4 rounded border-gray-300 accent-black"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-black">
              Active (visible in store)
            </label>
          </div>

          {/* ── Attributes ───────────────────────────────────────────────────── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-black">Attributes</label>
              <button
                type="button"
                onClick={handleAddAttribute}
                className="text-sm text-black hover:text-gray-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {attributes.length === 0 && (
              <p className="text-xs text-gray-400">
                No attributes yet — e.g. Color: Red, Size: XL
              </p>
            )}

            {attributes.map((attr, index) => (
              <div key={index} className="flex gap-2 items-center">
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
                  className="text-red-600 hover:text-red-700 p-2 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* ── Images ───────────────────────────────────────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Images
            </label>
            <ImageUpload
              value={uploadedImages}
              onChange={(val) =>
                setUploadedImages(Array.isArray(val) ? val : val ? [val] : [])
              }
              multiple
              maxFiles={8}
            />
          </div>

          {/* ── Submit ───────────────────────────────────────────────────────── */}
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