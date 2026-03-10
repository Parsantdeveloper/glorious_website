'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ChevronDown,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Tag,
  Layers,
  CircleDot,
  Package,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Brand, Category } from '@/app/store/filterMetaStore'

// ─── Types ────────────────────────────────────────────────────────────────────

export type SortOption = 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'stock_asc' | 'stock_desc'
export type StockFilter = 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'
export type StatusFilter = 'all' | 'active' | 'inactive'

/** Values kept in local state — mirrors what the page passes to the API */
export interface ProductFilterValues {
  categoryIds: string[]   // UUIDs sent to ?category=
  brandIds: string[]      // UUIDs sent to ?brand=
  isActive: StatusFilter  // 'all' | 'active' | 'inactive'
  stock: StockFilter
  sort: SortOption
}

/** What the page/API actually receives after transformation */
export interface ProductApiParams {
  category?: string
  brand?: string
  isActive?: boolean
  stockStatus?: Exclude<StockFilter, 'all'>
  price?: 'asc' | 'desc'
  stock?: 'asc' | 'desc'
}

interface ProductFiltersProps {
  availableCategories?: Category[]
  availableBrands?: Brand[]
  values: ProductFilterValues
  onChange: (filters: ProductFilterValues) => void
  className?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SORT_LABELS: Record<SortOption, string> = {
  newest:     'Newest First',
  oldest:     'Oldest First',
  price_asc:  'Price: Low → High',
  price_desc: 'Price: High → Low',
  stock_asc:  'Stock: Low → High',
  stock_desc: 'Stock: High → Low',
}

const STOCK_LABELS: Record<StockFilter, string> = {
  all:          'All Stock',
  in_stock:     'In Stock',
  low_stock:    'Low Stock',
  out_of_stock: 'Out of Stock',
}

const STOCK_DOT: Record<StockFilter, string> = {
  all:          'bg-gray-400',
  in_stock:     'bg-emerald-500',
  low_stock:    'bg-amber-500',
  out_of_stock: 'bg-red-500',
}

const STATUS_OPTIONS: { value: StatusFilter; label: string; dot: string }[] = [
  { value: 'all',      label: 'All',      dot: 'bg-gray-400'    },
  { value: 'active',   label: 'Active',   dot: 'bg-emerald-500' },
  { value: 'inactive', label: 'Inactive', dot: 'bg-red-500'     },
]

export const DEFAULT_FILTERS: ProductFilterValues = {
  categoryIds: [],
  brandIds:    [],
  isActive:    'all',
  stock:       'all',
  sort:        'newest',
}

// ─── Helper: transform UI state → API params ──────────────────────────────────
// Call this in your page before sending the request

export function toApiParams(filters: ProductFilterValues): ProductApiParams {
  const params: ProductApiParams = {}

  // Backend accepts a single id — send the first selected
  if (filters.categoryIds.length > 0) params.category = filters.categoryIds[0]
  if (filters.brandIds.length > 0)    params.brand    = filters.brandIds[0]

  if (filters.isActive === 'active')   params.isActive = true
  if (filters.isActive === 'inactive') params.isActive = false

  if (filters.stock !== 'all') params.stockStatus = filters.stock

  if (filters.sort === 'price_asc')  params.price = 'asc'
  if (filters.sort === 'price_desc') params.price = 'desc'
  if (filters.sort === 'stock_asc')  params.stock = 'asc'
  if (filters.sort === 'stock_desc') params.stock = 'desc'
  // newest/oldest → no param needed, backend defaults to createdAt desc

  return params
}

// ─── Sub-component: id-based multi-select dropdown ───────────────────────────

interface IdMultiSelectProps {
  label: string
  icon: React.ReactNode
  options: { id: string; name: string }[]
  selectedIds: string[]
  onToggle: (id: string) => void
}

function IdMultiSelectDropdown({ label, icon, options, selectedIds, onToggle }: IdMultiSelectProps) {
  const hasSelection = selectedIds.length > 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'h-9 gap-1.5 border-gray-200 bg-white text-gray-700 font-medium text-sm',
            'hover:bg-gray-50 hover:border-gray-300 transition-all duration-150',
            'focus-visible:ring-1 focus-visible:ring-black focus-visible:ring-offset-0',
            hasSelection && 'border-black bg-black text-white hover:bg-gray-800 hover:border-gray-800'
          )}
        >
          <span className="flex items-center gap-1.5">
            {icon}
            {label}
            {hasSelection && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold bg-white text-black">
                {selectedIds.length}
              </span>
            )}
          </span>
          <ChevronDown className="w-3.5 h-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-52 border-gray-200 shadow-lg shadow-black/5"
        sideOffset={6}
      >
        <DropdownMenuLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider pb-1">
          {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-100" />

        {options.length === 0 ? (
          <div className="py-3 px-2 text-sm text-gray-400 text-center">No options available</div>
        ) : (
          options.map((opt) => (
            <DropdownMenuCheckboxItem
              key={opt.id}
              checked={selectedIds.includes(opt.id)}
              onCheckedChange={() => onToggle(opt.id)}
              className="text-sm text-gray-700 cursor-pointer focus:bg-gray-50 focus:text-gray-900"
            >
              {opt.name}
            </DropdownMenuCheckboxItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function ProductFilters({
  availableCategories = [],
  availableBrands = [],
  values,
  onChange,
  className,
}: ProductFiltersProps) {

  const toggleId = (key: 'categoryIds' | 'brandIds', id: string) => {
    const current = values[key]
    onChange({
      ...values,
      [key]: current.includes(id) ? current.filter((v) => v !== id) : [...current, id],
    })
  }

  const activeFilterCount =
    values.categoryIds?.length +
    values.brandIds.length +
    (values.isActive !== 'all' ? 1 : 0) +
    (values.stock !== 'all' ? 1 : 0)

  const clearAll = () => onChange(DEFAULT_FILTERS)

  // Badges resolve id → name for display
  const activeBadges: { label: string; onRemove: () => void }[] = [
    ...values.categoryIds.map((id) => ({
      label: availableCategories.find((c) => c.id === id)?.name ?? id,
      onRemove: () => toggleId('categoryIds', id),
    })),
    ...values.brandIds.map((id) => ({
      label: availableBrands.find((b) => b.id === id)?.name ?? id,
      onRemove: () => toggleId('brandIds', id),
    })),
    ...(values.isActive !== 'all'
      ? [{ label: values.isActive === 'active' ? 'Active' : 'Inactive', onRemove: () => onChange({ ...values, isActive: 'all' }) }]
      : []),
    ...(values.stock !== 'all'
      ? [{ label: STOCK_LABELS[values.stock], onRemove: () => onChange({ ...values, stock: 'all' }) }]
      : []),
  ]

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-wrap items-center gap-2">

        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500 mr-1">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filter</span>
        </div>

        {/* Category — stores UUID, displays name */}
        <IdMultiSelectDropdown
          label="Category"
          icon={<Layers className="w-3.5 h-3.5" />}
          options={availableCategories}
          selectedIds={values.categoryIds}
          onToggle={(id) => toggleId('categoryIds', id)}
        />

        {/* Brand — stores UUID, displays name */}
        <IdMultiSelectDropdown
          label="Brand"
          icon={<Tag className="w-3.5 h-3.5" />}
          options={availableBrands}
          selectedIds={values.brandIds}
          onToggle={(id) => toggleId('brandIds', id)}
        />

        {/* Status → isActive boolean */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'h-9 gap-1.5 border-gray-200 bg-white text-gray-700 font-medium text-sm',
                'hover:bg-gray-50 hover:border-gray-300 transition-all duration-150',
                'focus-visible:ring-1 focus-visible:ring-black focus-visible:ring-offset-0',
                values.isActive !== 'all' && 'border-black bg-black text-white hover:bg-gray-800 hover:border-gray-800'
              )}
            >
              <CircleDot className="w-3.5 h-3.5" />
              Status
              {values.isActive !== 'all' && (
                <span className="inline-flex items-center gap-1 text-xs bg-white/20 rounded px-1">
                  {values.isActive === 'active' ? 'Active' : 'Inactive'}
                </span>
              )}
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-44 border-gray-200 shadow-lg shadow-black/5" sideOffset={6}>
            <DropdownMenuLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider pb-1">
              Status
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-100" />
            <DropdownMenuRadioGroup
              value={values.isActive}
              onValueChange={(v) => onChange({ ...values, isActive: v as StatusFilter })}
            >
              {STATUS_OPTIONS.map(({ value, label, dot }) => (
                <DropdownMenuRadioItem key={value} value={value} className="text-sm text-gray-700 cursor-pointer focus:bg-gray-50">
                  <span className="flex items-center gap-2">
                    <span className={cn('w-2 h-2 rounded-full', dot)} />
                    {label}
                  </span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Stock */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'h-9 gap-1.5 border-gray-200 bg-white text-gray-700 font-medium text-sm',
                'hover:bg-gray-50 hover:border-gray-300 transition-all duration-150',
                'focus-visible:ring-1 focus-visible:ring-black focus-visible:ring-offset-0',
                values.stock !== 'all' && 'border-black bg-black text-white hover:bg-gray-800 hover:border-gray-800'
              )}
            >
              <Package className="w-3.5 h-3.5" />
              Stock
              {values.stock !== 'all' && (
                <span className="inline-flex items-center gap-1 text-xs bg-white/20 rounded px-1">
                  {STOCK_LABELS[values.stock]}
                </span>
              )}
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-48 border-gray-200 shadow-lg shadow-black/5" sideOffset={6}>
            <DropdownMenuLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider pb-1">
              Stock Level
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-100" />
            <DropdownMenuRadioGroup
              value={values.stock}
              onValueChange={(v) => onChange({ ...values, stock: v as StockFilter })}
            >
              {(Object.keys(STOCK_LABELS) as StockFilter[]).map((key) => (
                <DropdownMenuRadioItem key={key} value={key} className="text-sm text-gray-700 cursor-pointer focus:bg-gray-50">
                  <span className="flex items-center gap-2">
                    <span className={cn('w-2 h-2 rounded-full', STOCK_DOT[key])} />
                    {STOCK_LABELS[key]}
                  </span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 border-gray-200 bg-white text-gray-700 font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 focus-visible:ring-1 focus-visible:ring-black focus-visible:ring-offset-0"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              {SORT_LABELS[values.sort]}
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-52 border-gray-200 shadow-lg shadow-black/5" sideOffset={6}>
            <DropdownMenuLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider pb-1">
              Sort By
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-100" />
            <DropdownMenuRadioGroup
              value={values.sort}
              onValueChange={(v) => onChange({ ...values, sort: v as SortOption })}
            >
              {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([key, label]) => (
                <DropdownMenuRadioItem key={key} value={key} className="text-sm text-gray-700 cursor-pointer focus:bg-gray-50">
                  {label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-9 gap-1 text-gray-500 hover:text-black hover:bg-gray-100 text-sm font-medium ml-auto"
          >
            <X className="w-3.5 h-3.5" />
            Clear ({activeFilterCount})
          </Button>
        )}
      </div>

      {activeBadges.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {activeBadges.map((badge, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="h-6 gap-1 pl-2.5 pr-1.5 text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 border-0 rounded-full"
            >
              {badge.label}
              <button
                onClick={badge.onRemove}
                className="ml-0.5 rounded-full p-0.5 hover:bg-gray-300 transition-colors"
                aria-label={`Remove ${badge.label} filter`}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}