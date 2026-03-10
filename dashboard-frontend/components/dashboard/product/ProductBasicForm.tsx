import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
interface ProductBasicFormProps {
  data: {
    name: string
    description: string
    categoryId: string
    brandId: string
    isActive: boolean
  }
  categories: Array<{ id: string; name: string }>
  brands: Array<{ id: string; name: string }>
  onChange: (field: string, value: any) => void
}

export default function ProductBasicForm({
  data,
  categories,
  brands,
  onChange,
}: ProductBasicFormProps) {
    
      

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
        <CardDescription>Add basic details about your product</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
            Product Name *
          </label>
          <input
            id="name"
            type="text"
            required
            minLength={2}
            maxLength={255}
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="e.g., BoomBox Mini Speaker"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
          />
          <p className="text-xs text-gray-500 mt-1">2-255 characters</p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
            Description
          </label>
          <textarea
            id="description"
            minLength={2}
            maxLength={5000}
            value={data.description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Describe your product in detail..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
          />
          <p className="text-xs text-gray-500 mt-1">Max 5000 characters</p>
        </div>

        {/* Category and Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-2">
              Category *
            </label>
            <select
              id="category"
              required
              value={data.categoryId}
              onChange={(e) => onChange('categoryId', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-900 mb-2">
              Brand *
            </label>
            <select
              id="brand"
              required
              value={data.brandId}
              onChange={(e) => onChange('brandId', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
            >
              <option value="">Select a brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-3">
          <input
            id="isActive"
            type="checkbox"
            checked={data.isActive}
            onChange={(e) => onChange('isActive', e.target.checked)}
            className="w-4 h-4 text-black rounded border-gray-300 focus:ring-2 focus:ring-black"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-900">
            Product is active
          </label>
        </div>
      </CardContent>
    </Card>
  )
}
