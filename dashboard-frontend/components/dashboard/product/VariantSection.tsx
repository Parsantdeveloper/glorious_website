import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { Variant } from '@/types/full_product'
import VariantForm from './VariantForm'

interface VariantsSectionProps {
  variants: Variant[]
  onVariantChange: (variantId: string, field: string, value: any) => void
  onAddVariant: () => void
  onRemoveVariant: (variantId: string) => void
}

export default function VariantsSection({
  variants,
  onVariantChange,
  onAddVariant,
  onRemoveVariant,
}: VariantsSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Product Variants</CardTitle>
          <CardDescription>Add different versions of your product (colors, sizes, etc.)</CardDescription>
        </div>
        <Button onClick={onAddVariant} size="sm" className="bg-black text-white hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          Add Variant
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {variants.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No variants added yet. Click "Add Variant" to create one.</p>
        ) : (
          variants.map((variant, index) => (
            <div key={variant.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Variant {index + 1}</h3>
                {variants.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveVariant(variant.id || "")}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <VariantForm
                variant={variant}
                onVariantChange={(field, value) => onVariantChange(variant.id || "", field, value)}
              />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}