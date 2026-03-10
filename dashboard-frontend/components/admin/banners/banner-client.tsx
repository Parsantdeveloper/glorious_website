'use client'

import { useState,} from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import BannerForm from '@/components/dashboard/banner/BannerForm'
import BannerList from '@/components/dashboard/banner/BannerList'
import { Spinner } from '@/components/ui/spinner'
import { api } from '@/lib/axiosInstance'
import { set } from 'zod'

interface Banner {
  id: string
  imageUrl: string
  linkUrl?: string
  validFrom?: string
  validUntil?: string
  isActive: boolean
  order: number
}



export default function BannerPageClient({
    initialBanners
}:{
    initialBanners: Banner[]
}) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [loading, setLoading] = useState(false)


  const handleCreate = async(data: Partial<Banner>) => {
     try {
        setLoading(true)
        const responce = await api.post('/banner',data)
         const newBanner=responce.data.data;
        setBanners([...banners, newBanner])
        setLoading(false)
        setIsFormOpen(false)
     } catch (error) {
      setLoading(false)
        console.error('Error creating banner:', error)
     }
  }

  const handleUpdate = async(data: Partial<Banner>) => {
    try {
      setLoading(true)
        const responce = await api.put(`/banner/${editingBanner?.id}`,data)
        console.log(data);
        const newBanner=responce.data.data;
        setBanners(banners.map(b => b.id === newBanner.id ? newBanner : b))
        setLoading(false)
        setIsFormOpen(false)
     } catch (error) {
      setLoading(false)
        console.error('Error creating banner:', error)
     }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      setBanners(banners.filter(b => b.id !== id))
    }
    try {
      setLoading(true)
      await api.delete(`/banner/${id}`);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error('Error deleting banner:', error)
    }
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingBanner(null)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-black">Banners</h2>
          <p className="text-gray-600 mt-1">Manage your promotional banners</p>
        </div>
        <Button
          onClick={() => {
            setEditingBanner(null)
            setIsFormOpen(true)
          }}
          className="bg-black cursor-pointer text-white hover:bg-gray-800 flex items-center gap-2"
        >
          <Plus size={20} />
          Create Banner
        </Button>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-black">
                {editingBanner ? 'Edit Banner' : 'Create New Banner'}
              </h3>
              <button
                onClick={handleCloseForm}
                className="text-gray-500 hover:text-black"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <BannerForm
                banner={editingBanner}
                loading={loading}
                onSubmit={editingBanner ? handleUpdate : handleCreate}
              />
            </div>
          </div>
        </div>
      )}

      {/* Banner List */}
      <BannerList
        banners={banners}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
