'use client'

import { useState , useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import VariantList from '@/components/dashboard/product/VariantList'
import ProductDialog from '@/components/dashboard/product/ProductDialog'
import VariantDialog from '@/components/dashboard/product/VariantDialog'
import { ChevronLeft, Plus, Edit2, Trash2 } from 'lucide-react'
import { api } from '@/lib/axiosInstance'
import { Product, Variant } from '@/types/full_product'

 

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [product, setProduct] = useState<Product | null>(null)

   useEffect(()=>{
    async function fetchProduct(){
      try {
      const product = await api.get(`/product/${slug}`)
      setProduct(product.data.data)
      console.log('Fetched product:', product.data)
    } catch (error) {
      console.error('Error fetching product:', error)
    }
  }
  fetchProduct();
    
   },[])
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [isAddVariantOpen, setIsAddVariantOpen] = useState(false)
  const [editingVariant, setEditingVariant] = useState(null)
  const [isEditVariantOpen, setIsEditVariantOpen] = useState(false)

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Product not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </div>
    )
  }

  const handleUpdateProduct = (data:Product) => {
    setProduct({
      ...product,
      ...data,
      specifications: data.specifications || product.specifications,
    })
    setIsEditProductOpen(false)
  }

  const handleAddVariant = (data:Variant) => {
    const newVariant = {
      id: Date.now().toString(),
      ...data,
    }
    setProduct({
      ...product,
      variants: [...product.variants, newVariant],
    })
    setIsAddVariantOpen(false)
  }

  const handleUpdateVariant = (data:Variant) => {
    setProduct({
      ...product,
      variants: product.variants.map(v =>
        v.id === editingVariant?.id ? { ...v, ...data } : v
      ),
    })
    setIsEditVariantOpen(false)
    setEditingVariant(null)
  }

  const handleDeleteVariant = (variantId: string) => {
    setProduct({
      ...product,
      variants: product.variants.filter(v => v.id !== variantId),
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2 border-gray-300"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Product Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-black">{product.name}</h1>
            <p className="text-gray-600 mt-2">{product.description}</p>
            <div className="flex items-center gap-4 mt-4">
              <span className="text-sm">
                <span className="font-medium text-black">Brand:</span>
                <span className="text-gray-600 ml-2">{product.brand?.name}</span>
              </span>
              <span className="text-sm">
                <span className="font-medium text-black">Category:</span>
                <span className="text-gray-600 ml-2">{product.category?.name}</span>
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-black">
                {product.status}
              </span>
            </div>
          </div>
          <ProductDialog
            product={product}
            isOpen={isEditProductOpen}
            onOpenChange={setIsEditProductOpen}
            onSubmit={handleUpdateProduct}
          >
            <Button className="bg-black text-white hover:bg-gray-800 flex items-center gap-2">
              <Edit2 className="w-4 h-4" />
              Edit Product
            </Button>
          </ProductDialog>
        </div>

        {/* Specifications */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-medium text-black mb-3">Specifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {product.specifications.map((spec, idx) => (
                <div key={idx}>
                  <p className="text-sm text-gray-600">{spec.key}</p>
                  <p className="text-black font-medium">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Variants Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black">Variants ({product.variants?.length})</h2>
          <VariantDialog
            isOpen={isAddVariantOpen}
            onOpenChange={setIsAddVariantOpen}
            onSubmit={handleAddVariant}
          >
            <Button className="bg-black text-white hover:bg-gray-800 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Variant
            </Button>
          </VariantDialog>
        </div>

        {product.variants?.length && product.variants.length >=0 ? (
          <VariantList
            variants={product.variants}
            onEdit={(variant) => {
              setEditingVariant(variant)
              setIsEditVariantOpen(true)
            }}  
            onDelete={handleDeleteVariant}
          />
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600">No variants yet</p>
            <p className="text-gray-500 text-sm mt-2">Create your first variant to get started</p>
          </div>
        )}
      </div>

      {/* Edit Variant Dialog */}
      {editingVariant && (
        <VariantDialog
          variant={editingVariant}
          isOpen={isEditVariantOpen}
          onOpenChange={setIsEditVariantOpen}
          onSubmit={handleUpdateVariant}
        />
      )}
    </div>
  )
}
