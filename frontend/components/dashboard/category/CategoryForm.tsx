'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import ImageUpload, { UploadedImage } from '@/components/ui/image-upload'
interface Category {
  id: string
  name: string
  description?: string
  imageUrl?: string
  imageId?: string
  parentId?: string | null
  isActive: boolean
  sortOrder: number
  metaTitle?: string
  metaDescription?: string
}

interface CategoryFormProps {
  category?: Category | null
  categories: Category[]
  loading?: boolean
  onSubmit: (data: Partial<Category>) => void
}

interface CategoryFormValues {
  name: string
  description: string
  imageUrl: string
  imageId: string
  parentId: string
  isActive: boolean
  sortOrder: number
  metaTitle: string
  metaDescription: string
}



export default function CategoryForm({ category, categories, loading, onSubmit }: CategoryFormProps) {
    const [image, setImage] = useState<UploadedImage | null>(null)

  const form = useForm<CategoryFormValues>({
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
      imageId: '',
      parentId: '',
      isActive: true,
      sortOrder: 0,
      metaTitle: '',
      metaDescription: '',
    },
  })

form.setValue('imageUrl', image?.url||'')
form.setValue('imageId', image?.id || '')


  const parentOptions = useMemo(() => {
    if (!categories.length) {
      return []
    }
    return categories.map((item) => ({
      id: item.id,
      name: item.name,
    }))
  }, [categories])

 useEffect(() => {
  if (!category?.imageUrl || !category.imageId) {
    setImage(null)
    return
  }

  setImage({
    url: category.imageUrl,
    id: category.imageId,
  })
}, [category])

  useEffect(() => {
    if (!category) {
      form.reset({
        name: '',
        description: '',
        imageUrl: '',
        imageId: '',
        parentId: '',
        isActive: true,
        sortOrder: 0,
        metaTitle: '',
        metaDescription: '',
      })
      
      return
    }

    form.reset({
      name: category.name,
      description: category.description || '',
      imageUrl: category.imageUrl || '',
      imageId: category.imageId || '',
      parentId: category.parentId || '',
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      metaTitle: category.metaTitle || '',
      metaDescription: category.metaDescription || '',
    })
  

    }, [category, form])

  const handleSubmit = (data: CategoryFormValues) => {
    onSubmit({
      ...data,
      description: data.description || undefined,
      imageUrl: data.imageUrl || undefined,
      imageId: data.imageId || undefined,
      parentId: data.parentId || undefined,
      metaTitle: data.metaTitle || undefined,
      metaDescription: data.metaDescription || undefined,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Smartphones" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  rows={3}
                  placeholder="Short description of the category"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
  <Label className="text-sm font-medium">Category Image</Label>

  <div className="mt-2">
    <ImageUpload
      value={image}
      multiple={false}
      onChange={(img) => {
    const uploaded = img as UploadedImage
        
        setImage(uploaded)

        form.setValue('imageUrl', uploaded.url, {
          shouldDirty: true,
          shouldValidate: true,
        })

        form.setValue('imageId', uploaded.id, {
          shouldDirty: true,
          shouldValidate: true,
        })
      }}
    />
  </div>
</div>



        

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Category (Optional)</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="">No parent</option>
                    {parentOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sortOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort Order</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    onChange={(event) => field.onChange(Number(event.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="metaTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Title (Optional)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="SEO title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="metaDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Description (Optional)</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  rows={3}
                  placeholder="SEO description"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-3">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(event) => field.onChange(event.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                  />
                </FormControl>
                <FormLabel className="cursor-pointer">Active</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <Button type="submit" className="flex-1 bg-black text-white hover:bg-gray-800" disabled={loading}>
            {category ? 'Update Category' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
