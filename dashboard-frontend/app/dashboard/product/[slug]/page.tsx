'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import VariantList from '@/components/dashboard/product/VariantList'
import ProductDialog from '@/components/dashboard/product/ProductDialog'
import VariantDialog from '@/components/dashboard/product/VariantDialog'
import { ChevronLeft, Plus, Edit2 } from 'lucide-react'
import { api } from '@/lib/axiosInstance'
import { Product, Variant } from '@/types/full_product'
import { set } from 'better-auth'
import toast from 'react-hot-toast'
// ─── Skeleton ────────────────────────────────────────────────────────────────

function ProductSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-9 w-24 bg-gray-200 rounded-lg" />
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="h-8 w-1/3 bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-100 rounded" />
        <div className="flex gap-4">
          <div className="h-4 w-24 bg-gray-100 rounded" />
          <div className="h-4 w-24 bg-gray-100 rounded" />
          <div className="h-6 w-16 bg-gray-100 rounded-full" />
        </div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4">
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/4 bg-gray-200 rounded" />
              <div className="h-3 w-1/3 bg-gray-100 rounded" />
              <div className="h-3 w-1/2 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        setError(null)
        const res = await api.get(`/product/${slug}`)
        setProduct(res.data.data)
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Failed to load product. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [isAddVariantOpen, setIsAddVariantOpen] = useState(false)
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null)
  const [isEditVariantOpen, setIsEditVariantOpen] = useState(false)

  // ── Loading / error states ──────────────────────────────────────────────────

  if (loading) return <ProductSkeleton />

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">{error ?? 'Product not found'}</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleUpdateProduct = async(data: Product) => {
    setProduct(prev => prev ? { ...prev, ...data, specifications: data.specifications ?? prev.specifications } : prev)
    setIsEditProductOpen(false)
    try {
      const res = await api.put(`/product/${product.id}`, data);
      console.log(res.data)
      setProduct(prev => prev ? { ...prev, ...res.data.data } : prev)
      toast.success("Product updated successfully")
    } catch (error) {
      toast.error("Failed to update product")
    }
  }

  const handleAddVariant = (data: Variant) => {
    try {
      let payload = { ...data, productId: product.id }
      const res:any = api.post('/variant', payload)
      setProduct(prev => prev ? { ...prev, variants: [...(prev.variants ?? []), res.data.data] } : prev)
      toast.success("Variant added successfully")
    } catch (error) {
      toast.error("Failed to add variant")
    }
    setIsAddVariantOpen(false)
  }

  const handleUpdateVariant = (data: Variant) => {
    setProduct(prev =>
      prev
        ? {
            ...prev,
            variants: prev.variants.map(v =>
              v.id === editingVariant?.id ? { ...v, ...data } : v
            ),
          }
        : prev
    )
    try { 
      const res:any = api.put(`product/${product.slug}/variant/${editingVariant?.id}`, data);
        setProduct(prev =>
          prev
            ? {
                ...prev,
                variants: prev.variants.map(v =>
                  v.id === editingVariant?.id ? { ...v, ...res.data?.data } : v
                ),
              }
            : prev
        )
        toast.success("Variant updated successfully")
    } catch (error) {
      toast.error("Failed to update variant")
    }
    setIsEditVariantOpen(false)
    setEditingVariant(null)
  }

  const handleDeleteVariant = async(variantId: string) => {
    setProduct(prev =>
      prev ? { ...prev, variants: prev.variants.filter(v => v.id !== variantId) } : prev
    )
    try {
      let responce = await api.delete(`/product/variant/${variantId}`)
      toast.success("Variant deleted successfully")
       setProduct(prev => prev ? { ...prev, variants: prev.variants.filter(v => v.id !== variantId) } : prev)
    } catch (error) {
      toast.error("Failed to delete variant")
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

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
          <h2 className="text-2xl font-bold text-black">
            Variants ({product.variants?.length ?? 0})
          </h2>
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

        {product.variants?.length > 0 ? (
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
          onOpenChange={(open) => {
            setIsEditVariantOpen(open)
            if (!open) setEditingVariant(null)
          }}
          onSubmit={handleUpdateVariant}
        />
      )}
    </div>
  )
}