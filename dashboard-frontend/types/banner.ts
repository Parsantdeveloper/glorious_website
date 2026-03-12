

export interface Banner {
  id: string
  imageUrl: string
  imageId: string  // add this
  linkUrl?: string
  validFrom?: string
  validUntil?: string
  isActive: boolean
  order: number
}