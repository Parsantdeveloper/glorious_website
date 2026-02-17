'use client'

import { Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
interface Category {
  id: string
  name: string
  description?: string
  //   slug: string
  imageUrl?: string
  imageId?: string
  parentId?: string | null
  isActive: boolean
  sortOrder: number
  metaTitle?: string
  metaDescription?: string
}

interface CategoryListProps {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
}

export default function CategoryList({ categories, onEdit, onDelete }: CategoryListProps) {
  if (categories?.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-600">No categories yet. Create your first category to get started.</p>
      </div>
    )
  }

  const parentLookup = new Map(categories?.map((category) => [category.id, category.name]))

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white"
        >
          <div className="flex flex-col gap-6 p-6 md:flex-row">
            <div className="flex-shrink-0 w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 md:w-48">
              {category.imageUrl ? (
                <img
                  src={category.imageUrl || '/placeholder.svg'}
                  alt="Category preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  No image
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-black">{category.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${category.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {category.isActive ? 'InActive' : 'Active'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      Sort {category.sortOrder}
                    </span>
                  </div>
                  {/* <p className="text-sm text-gray-600">
                    <span className="font-medium text-black">Slug:</span> {category.slug}
                  </p> */}
                  {category.parentId && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-black">Parent:</span>{' '}
                      {parentLookup.get(category.parentId) || category.parentId}
                    </p>
                  )}
                  {category.description && (
                    <p className="text-sm text-gray-600 mt-2">{category.description}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 text-sm text-gray-600 md:grid-cols-2">
                {category.metaTitle && (
                  <p>
                    <span className="font-medium text-black">Meta Title:</span> {category.metaTitle}
                  </p>
                )}
                {category.metaDescription && (
                  <p>
                    <span className="font-medium text-black">Meta Description:</span> {category.metaDescription}
                  </p>
                )}
                {category.imageId && (
                  <p>
                    <span className="font-medium text-black">Image ID:</span> {category.imageId}
                  </p>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => onEdit(category)}
                  variant="outline"
                  size="sm"
                  className="border-black text-black hover:bg-gray-100 flex items-center gap-2"
                >
                  <Edit2 size={16} />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      onClick={() => onDelete(category.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                       This will permanently inactive your
                        category from store .
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
