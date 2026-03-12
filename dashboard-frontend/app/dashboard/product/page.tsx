'use client'

import { useState,useEffect,useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ProductList from '@/components/dashboard/product/ProductList'
// import ProductDialog from '@/components/dashboard/product/ProductDialog'
import { Plus, Search } from 'lucide-react'
import {api} from '@/lib/axiosInstance'
import { Product } from '@/types/product'
import { useRouter } from 'next/navigation'
import ProductFilters, { ProductFilterValues, DEFAULT_FILTERS } from '@/components/dashboard/product/ProductFilter'
import { useFilterMetaStore } from '@/app/store/filterMetaStore'
import qs from "qs"
import { useDebounce } from 'use-debounce'
import { toast } from 'react-hot-toast'


// Mock product data


export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch] = useDebounce(searchQuery, 400)

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
   const [filters, setFilters] = useState<ProductFilterValues>(DEFAULT_FILTERS)

  const router = useRouter();
 const {categories, brands} = useFilterMetaStore();
 function buildProductParams(filters: ProductFilterValues) {
  return {
      search: searchQuery || undefined,
    brand: filters.brandIds?.length ? filters.brandIds : undefined,
    isActive: filters.isActive !== "all" ? filters.isActive === "active" : undefined,
    category: filters.categoryIds?.length ? filters.categoryIds : undefined,
    stockStatus: filters.stock !== "all" ? filters.stock : undefined,
    price: filters.sort?.includes("price")
      ? filters.sort.split("_")[1]
      : undefined,
    stock: filters.sort?.includes("stock")
      ? filters.sort.split("_")[1]
      : undefined,
  }
}
useEffect(() => {
  async function fetchProducts() {
    try {
const response = await api.get("/product", {
  params: buildProductParams(filters),
  paramsSerializer: (params) =>
    qs.stringify(params, { arrayFormat: "repeat" }),
})
      setProducts(response.data.data)

    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  fetchProducts()

}, [filters,debouncedSearch])
  
  console.log('Products filters:', filters)
  
  const handleCreateProduct = (data:any) => {
    const newProduct = {
      id: Date.now().toString(),
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date(),
      variants: [],
      specifications: data.specifications || [],
      ...data,
    }
    setProducts([...products, newProduct])
    setIsCreateDialogOpen(false)
  }

  const handleDeleteProduct = async(productId:string) => {
    setProducts(products.filter(p => p.id !== productId))
    try {
      const responce = await api.delete(`/product/${productId}`)
      toast.success("Product deleted successfully")
    } catch (error) {
      toast.error("Failed to delete product. Please try again.")
    }
  }
 

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col  justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory and variants</p>
        </div>
        <div className='flex items-center justify-between py-4'>

<ProductFilters
  availableCategories={categories}
  availableBrands={brands}
  values={filters}
  onChange={setFilters}
/>          <Button onClick={() => router.push("/dashboard/product/create")} className="bg-black cursor-pointer text-white hover:bg-gray-800 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
      
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by product name, brand, or category..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black placeholder-gray-500"
        />
      </div>

      {/* Products List */}
      {products.length > 0 ? (
        <ProductList
          products={products}
          onDelete={handleDeleteProduct}
        />
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600 text-lg">No products found</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your search or create a new product</p>
        </div>
      )}
    </div>
  )
}
