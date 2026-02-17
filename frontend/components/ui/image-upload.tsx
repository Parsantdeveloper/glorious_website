'use client'

import { useState } from 'react'
import Image from 'next/image'
import { api } from '@/lib/axiosInstance'
import { Loader2 } from 'lucide-react'

export interface UploadedImage {
  url: string
  id: string
}

interface ImageUploadProps {
  value: UploadedImage | UploadedImage[] | null
  onChange: (value: UploadedImage | UploadedImage[]) => void
  multiple?: boolean
  maxFiles?: number
}

export default function ImageUpload({
  value,
  onChange,
  multiple = false,
  maxFiles = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const images = multiple
    ? (value as UploadedImage[]) ?? []
    : value
      ? [value as UploadedImage]
      : []

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    if (multiple && images.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} images allowed`)
      return
    }

    setUploading(true)

    try {
      const uploads = Array.from(files).map(async (file) => {
        const form = new FormData()
        form.append('image', file)

        const res = await api.post('/upload', form)

        return {
          url: res.data.data.url,
          id: res.data.data.public_id,
        } as UploadedImage
      })

      const uploadedImages = await Promise.all(uploads)

      if (multiple) {
        onChange([...images, ...uploadedImages])
      } else {
        onChange(uploadedImages[0])
      }
    } catch (error) {
      console.error('Image upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index)
    onChange(multiple ? updated : null!)
  }

  return (
    <div className="space-y-3">
      {/* Upload box */}
      <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition">
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => handleUpload(e.target.files)}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-gray-600">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-sm">Uploading image...</p>
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            Click or drag image here
          </p>
        )}
      </div>

      {/* Preview */}
      <div className="flex gap-3 flex-wrap">
        {images.map((img, index) => (
          <div
            key={img.id}
            className="relative w-24 h-24 rounded-lg overflow-hidden border"
          >
            <Image
              src={img.url}
              alt="Preview"
              fill
              className="object-cover"
            />

            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
