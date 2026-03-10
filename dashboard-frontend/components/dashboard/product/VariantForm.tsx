import { Variant } from '@/types/full_product'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import ImageUpload, { UploadedImage } from '@/components/ui/image-upload'
interface VariantFormProps {
  variant: Variant
  onVariantChange: (field: string, value: any) => void
}

export default function VariantForm({ variant, onVariantChange }: VariantFormProps) {
  
  const [newAttributeKey, setNewAttributeKey] = useState('')
  const [newAttributeValue, setNewAttributeValue] = useState('')
  const [ image , setImage ]=useState<UploadedImage[]>([])
    
    
  console.log("current image ",image)
  const handleAddAttribute = () => {
    if (newAttributeKey.trim() && newAttributeValue.trim()) {
      const attributes = { ...variant.attributes }
      attributes[newAttributeKey] = newAttributeValue
      onVariantChange('attributes', attributes)
      setNewAttributeKey('')
      setNewAttributeValue('')
    }
  }

  const handleRemoveAttribute = (key: string) => {
    const attributes = { ...variant.attributes }
    delete attributes[key]
    onVariantChange('attributes', attributes)
  }

  return (
    <div className="space-y-4">
      {/* Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Price *</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={variant.price}
            onChange={(e) => onVariantChange('price', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Sale Price</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={variant.salePrice || ''}
            onChange={(e) => onVariantChange('salePrice', e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="Leave empty if not on sale"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Stock Count *</label>
          <input
            type="number"
            required
            min="0"
            value={variant.stockCount}
            onChange={(e) => onVariantChange('stockCount', parseInt(e.target.value) || 0)}
            placeholder="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
          />
        </div>
      </div>

      {/* Weight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Weight (g)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={variant.weight || ''}
            onChange={(e) => onVariantChange('weight', e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="e.g., 900"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
            <input
              type="checkbox"
              checked={variant.isActive}
              onChange={(e) => onVariantChange('isActive', e.target.checked)}
              className="w-4 h-4 text-black rounded border-gray-300 focus:ring-2 focus:ring-black"
            />
            Variant is active
          </label>
        </div>
      </div>

      {/* Dimensions */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-semibold text-gray-900 mb-3">Dimensions (Optional)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Length (cm)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={variant.dimensions?.length || ''}
              onChange={(e) => {
                const length = e.target.value ? parseFloat(e.target.value) : 0
                onVariantChange('dimensions', {
                  length,
                  width: variant.dimensions?.width || 0,
                  height: variant.dimensions?.height || 0,
                })
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Width (cm)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={variant.dimensions?.width || ''}
              onChange={(e) => {
                const width = e.target.value ? parseFloat(e.target.value) : 0
                onVariantChange('dimensions', {
                  length: variant.dimensions?.length || 0,
                  width,
                  height: variant.dimensions?.height || 0,
                })
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Height (cm)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={variant.dimensions?.height || ''}
              onChange={(e) => {
                const height = e.target.value ? parseFloat(e.target.value) : 0
                onVariantChange('dimensions', {
                  length: variant.dimensions?.length || 0,
                  width: variant.dimensions?.width || 0,
                  height,
                })
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Images */}
       <ImageUpload
       maxFiles={5}
        multiple
        value={image}
        onChange={(val) => setImage(val as UploadedImage[])}
      />
      {/* Attributes */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-semibold text-gray-900 mb-3">Attributes (e.g., Color, Size)</h4>
        {Object.entries(variant.attributes || {}).length > 0 && (
          <div className="mb-4 space-y-2">
            {Object.entries(variant.attributes || {}).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{key}</p>
                  <p className="text-sm text-gray-600">{value}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveAttribute(key)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-900 mb-2">Attribute Name</label>
            <input
              type="text"
              value={newAttributeKey}
              onChange={(e) => setNewAttributeKey(e.target.value)}
              placeholder="e.g., Color"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-900 mb-2">Attribute Value</label>
            <input
              type="text"
              value={newAttributeValue}
              onChange={(e) => setNewAttributeValue(e.target.value)}
              placeholder="e.g., Red"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
            />
          </div>
          <Button
            type="button"
            onClick={handleAddAttribute}
            variant="outline"
            className="bg-white border-gray-300 text-black hover:bg-gray-50"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
