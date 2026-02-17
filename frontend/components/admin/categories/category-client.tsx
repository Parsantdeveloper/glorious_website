'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CategoryForm from '@/components/dashboard/category/CategoryForm'
import CategoryList from '@/components/dashboard/category/CategoryList'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {api} from '@/lib/axiosInstance'

interface Category {
  id: string
  name: string
  description?: string
  slug: string
  imageUrl?: string
  imageId?: string
  parentId?: string | null
  isActive: boolean
  sortOrder: number
  metaTitle?: string
  metaDescription?: string
}

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return String(Date.now())
}

export default function CategoryPageClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCreate = async(data: Partial<Category>) => {
    setLoading(true)
    console.log(data)
     try {
     let res = await api.post(`/category`, data)
      if(!res){
        alert('Failed to create category. Please try again.')
      }
    } catch (error) {
      alert('Failed to create category. Please try again.')
    }
    const newCategory: Category = {
      id: createId(),
      name: data.name || 'Untitled',
      slug: data.slug || 'untitled',
      description: data.description,
      imageUrl: data.imageUrl,
      imageId: data.imageId,
      parentId: data.parentId || null,
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
    }
    setCategories((prev) => [...prev, newCategory])
    setLoading(false)
    setIsFormOpen(false)
  }

  const handleUpdate = async(data: Partial<Category>) => {
    if (!editingCategory) {
      return
    }
    console.log(data)
    setLoading(true)
     try {
     let res = await api.put(`/category/${editingCategory.id}`, data)
      if(!res){
        alert('Failed to update category details. Please try again.')
      }

    } catch (error) {
      alert('Failed to update category details. Please try again.')
    }
    const updatedCategory: Category = {
      ...editingCategory,
      ...data,
      parentId: data.parentId || null,
      isActive: data.isActive ?? editingCategory.isActive,
      sortOrder: data.sortOrder ?? editingCategory.sortOrder,
    }
   
    setCategories((prev) => prev.map((item) => (item.id === editingCategory.id ? updatedCategory : item)))
    setLoading(false)
    setIsFormOpen(false)
  }

  const handleDelete = async (id: string) => {
       try {
        let res =  await api.delete(`/category/${id}`);
        setCategories((prev) => prev.filter((item) => item.id !== id))
         if(res.status !== 200){
          alert('Failed to delete category. Please try again.')
         }
       } catch (error) {
        alert('Failed to delete category. Please try again.')
       }
      
  }

  const handleEdit = async(category: Category) => {
    setEditingCategory(category)
    setIsFormOpen(true)
    
    
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 mb-8 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold text-black">Categories</h2>
          <p className="text-gray-600 mt-1">Manage your product categories</p>
        </div>
        <Dialog
          open={isFormOpen}
          onOpenChange={(open) => {
            setIsFormOpen(open)
            if (!open) {
              setEditingCategory(null)
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingCategory(null)
                setIsFormOpen(true)
              }}
              className="bg-black cursor-pointer text-white hover:bg-gray-800 flex items-center gap-2"
            >
              <Plus size={20} />
              Create Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl w-full p-0">
            <div className="flex flex-col max-h-[85vh]">
              <DialogHeader className="border-b border-gray-200 p-6">
                <DialogTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
                <DialogDescription>
                  {editingCategory
                    ? 'Update the details of your category.'
                    : 'Add a new category and configure its details.'}
                </DialogDescription>
              </DialogHeader>
              <div className="p-6 overflow-y-auto">
                <CategoryForm
                  category={editingCategory}
                  categories={categories}
                  loading={loading}
                  onSubmit={editingCategory ? handleUpdate : handleCreate}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <CategoryList categories={categories} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  )
}
