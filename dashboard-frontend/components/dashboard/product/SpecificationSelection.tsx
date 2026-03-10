import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

interface Specification {
  key: string
  value: string
}

interface InternalSpecification extends Specification {
  _id: string
}

interface SpecificationsSectionProps {
  specifications: Specification[]
  onSpecificationsChange: (specifications: Specification[]) => void
}

export default function SpecificationsSection({
  specifications,
  onSpecificationsChange,
}: SpecificationsSectionProps) {
  // Internal state uses _id for React keys, never exposed outside
  const internal: InternalSpecification[] = specifications.map((spec, i) => ({
    ...spec,
    _id: `spec-${i}`,
  }))

  const handleAdd = () => {
    onSpecificationsChange([...specifications, { key: '', value: '' }])
  }

  const handleRemove = (index: number) => {
    onSpecificationsChange(specifications.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, field: 'key' | 'value', value: string) => {
    const updated = specifications.map((spec, i) =>
      i === index ? { ...spec, [field]: value } : spec
    )
    onSpecificationsChange(updated)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Product Specifications</CardTitle>
          <CardDescription>Add technical details and features (optional)</CardDescription>
        </div>
        <Button onClick={handleAdd} size="sm" className="bg-black text-white hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          Add Specification
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {internal.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No specifications added yet. Click "Add Specification" to add product details.
          </p>
        ) : (
          <div className="space-y-3">
            {internal.map((spec, index) => (
              <div
                key={spec._id}
                className="flex gap-3 items-end bg-gray-50 p-3 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-900 mb-1">Specification Key</label>
                  <input
                    type="text"
                    maxLength={100}
                    value={spec.key}
                    onChange={(e) => handleChange(index, 'key', e.target.value)}
                    placeholder="e.g., Output Power"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black text-gray-900 text-sm"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-900 mb-1">Value</label>
                  <input
                    type="text"
                    maxLength={500}
                    value={spec.value}
                    onChange={(e) => handleChange(index, 'value', e.target.value)}
                    placeholder="e.g., 20W"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black text-gray-900 text-sm"
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(index)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}