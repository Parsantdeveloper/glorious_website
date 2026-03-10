'use client'

import Image from 'next/image'
import { Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Banner {
  id: string
  imageUrl: string
  linkUrl?: string
  validFrom?: string
  validUntil?: string
  isActive: boolean
  order: number
}

interface BannerListProps {
  banners: Banner[]
  onEdit: (banner: Banner) => void
  onDelete: (id: string) => void
}

export default function BannerList({ banners, onEdit, onDelete }: BannerListProps) {
  if (banners.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-600">No banners yet. Create your first banner to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {banners.map((banner) => (
        <div
          key={banner.id}
          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white"
        >
          <div className="flex gap-6 p-6">
            {/* Image Preview */}
            <div className="flex-shrink-0 w-48 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={banner.imageUrl || "/placeholder.svg"}
                alt="Banner preview"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Banner Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-black">Banner {banner.order}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        banner.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {banner.linkUrl && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Link:</span> {banner.linkUrl}
                    </p>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                {banner.validFrom && (
                  <div>
                    <p className="text-gray-600">
                      <span className="font-medium text-black">Valid From:</span> {banner.validFrom}
                    </p>
                  </div>
                )}
                {banner.validUntil && (
                  <div>
                    <p className="text-gray-600">
                      <span className="font-medium text-black">Valid Until:</span> {banner.validUntil}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => onEdit(banner)}
                  variant="outline"
                  size="sm"
                  className="border-black text-black hover:bg-gray-100 flex items-center gap-2"
                >
                  <Edit2 size={16} />
                  Edit
                </Button>
                <Button
                  onClick={() => onDelete(banner.id)}
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
