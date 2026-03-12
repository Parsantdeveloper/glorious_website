'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {api} from '@/lib/axiosInstance'
import { Banner } from '@/types/banner'

interface BannerFormProps {
  banner?: Banner | null
  loading?: boolean
  onSubmit: (data: Partial<Banner>) => void
}

export default function BannerForm({ banner,loading, onSubmit }: BannerFormProps) {
  const [formData, setFormData] = useState({
    imageId: '',
    imageUrl: '',
    linkUrl: '',
    validFrom: '',
    validUntil: '',
    isActive: true,
  })

  const [imagePreview, setImagePreview] = useState('')

useEffect(() => {
  if (!banner) {
    setFormData({
      imageUrl: '',
      imageId: '',
      linkUrl: '',
      validFrom: '',
      validUntil: '',
      isActive: true,
    })
    setImagePreview('')
    return
  }

  setFormData({
    imageUrl: banner.imageUrl,
    imageId: banner.imageId,
    linkUrl: banner.linkUrl || '',
    validFrom: banner.validFrom || '',
    validUntil: banner.validUntil || '',
    isActive: banner.isActive,
  })

  setImagePreview(banner.imageUrl)
}, [banner])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleImageChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    console.log(file);
    if (!file) return ;
    const form = new FormData()
    form.append('image', file)
    try {
      const response = await api.post('/upload', form)
      const imageUrl = response.data.data.url;
      console.log("Uploaded Image URL:", imageUrl);
      setFormData(prev => ({
        ...prev,
        imageUrl,
        imageId: response.data.data.public_id,
      }))
      setImagePreview(imageUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-black mb-3">
          Banner Image
        </label>
        <div className="space-y-3">
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {imagePreview ? (
              <div className="space-y-2">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="text-sm text-gray-600">Click to change image</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-600">Drag and drop your image here or click to select</p>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Link URL */}
      <div>
        <label htmlFor="linkUrl" className="block text-sm font-medium text-black mb-2">
          Link URL (Optional)
        </label>
        <input
          type="url"
          id="linkUrl"
          name="linkUrl"
          value={formData.linkUrl}
          onChange={handleChange}
          placeholder="https://example.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
        />
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="validFrom" className="block text-sm font-medium text-black mb-2">
            Valid From (Optional)
          </label>
          <input
            type="date"
            id="validFrom"
            name="validFrom"
            value={formData.validFrom}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
          />
        </div>
        <div>
          <label htmlFor="validUntil" className="block text-sm font-medium text-black mb-2">
            Valid Until (Optional)
          </label>
          <input
            type="date"
            id="validUntil"
            name="validUntil"
            value={formData.validUntil}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
          />
        </div>
      </div>

      {/* Active Status */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="w-4 h-4 rounded border-gray-300 cursor-pointer"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-black cursor-pointer">
          Active
        </label>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-6 border-t border-gray-200">
        <Button
          type="submit"
          className="flex-1 bg-black text-white hover:bg-gray-800"
          disabled={loading}
        >
          {banner ? 'Update Banner' : 'Create Banner'}
        </Button>
      </div>
    </form>
  )
}
