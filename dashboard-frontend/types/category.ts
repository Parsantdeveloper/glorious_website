

export interface Category {
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