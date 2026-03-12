'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProductBasicForm from '@/components/dashboard/product/ProductBasicForm'
import VariantsSection from '@/components/dashboard/product/VariantSection'
import SpecificationsSection from '@/components/dashboard/product/SpecificationSelection'
import { Variant, Specification } from '@/types/full_product'
import { api } from '@/lib/axiosInstance'
import toast from 'react-hot-toast'
import { useFilterMetaStore } from '@/app/store/filterMetaStore'

export interface ProductFormData {
  product: {
    name: string
    description: string
    categoryId: string
    brandId: string
    isActive: boolean
  }
  variants: Variant[]
  specifications: Specification[]
}

export default function CreateProductPage() {
  const [formData, setFormData] = useState<ProductFormData>({
    product: {
      name: '',
      description: '',
      categoryId: '',
      brandId: '',
      isActive: true,
    },
    variants: [
      {
        id: Date.now().toString(), // fix: initial variant needs an id
        price: 0,
        salePrice: 0,
        stockCount: 0,
        attributes: {},
        images: [],
        weight: undefined,
        dimensions: undefined,
        isActive: true,
      },
    ],
    specifications: [],
  })

  const { categories, brands } = useFilterMetaStore()

  const handleProductChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      product: {
        ...prev.product,
        [field]: value,
      },
    }))
  }

  const handleVariantChange = (variantId: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant) =>
        variant.id === variantId ? { ...variant, [field]: value } : variant
      ),
    }))
  }

  const handleAddVariant = () => {
    const newVariant: Variant = {
      id: Date.now().toString(),
      price: 0,
      salePrice: 0,
      stockCount: 0,
      attributes: {},
      images: [],
      weight: 0,
      dimensions: null,
      isActive: true,
    }
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant],
    }))
  }

  const handleRemoveVariant = (variantId: string) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((v) => v.id !== variantId),
    }))
  }

  const handleSpecificationsChange = (specifications: Specification[]) => {
    setFormData((prev) => ({ ...prev, specifications }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
        const variants = formData.variants.map(({ id, ...rest }) => rest)

    try {
      const response = await api.post("/product", {
        product: formData.product,
        variants: variants,
        specifications: formData.specifications,
      })
      toast.success('Product created successfully!')
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error('Failed to create product. Please try again.')
      return ; 
    }
    redirect('/dashboard/product')

  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/product">
            <Button variant="ghost" size="sm" className="mb-4 cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
          <p className="text-gray-600 mt-2">Add a new product with variants and specifications</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ProductBasicForm
            data={formData.product}
            categories={categories}
            brands={brands}
            onChange={handleProductChange}
          />

          <VariantsSection
            variants={formData.variants}
            onVariantChange={handleVariantChange}
            onAddVariant={handleAddVariant}
            onRemoveVariant={handleRemoveVariant}
          />

          <SpecificationsSection
            specifications={formData.specifications}
            onSpecificationsChange={handleSpecificationsChange}
          />

          <div className="flex gap-4 justify-end pt-6">
            <Link href="/dashboard/product">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="bg-black text-white hover:bg-gray-800">
              Create Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}