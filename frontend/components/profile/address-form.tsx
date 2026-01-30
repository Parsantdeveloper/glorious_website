'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'
import { z } from 'zod'

const baseAddressSchema = {
  fullName: z.string().min(2).max(100),
  phone: z.string().regex(/^(?:\+977)?9[6-9]\d{8}$/),
  district: z.string().min(2).max(50),  
  city: z.string().min(2).max(50),
  tole: z.string().min(2).max(100),
  postalCode: z.string().regex(/^\d{5}$/).optional(),
  addressLine: z.string().max(200).optional(),
};

export const createAddressSchema = z.object(baseAddressSchema);

export const updateAddressSchema = z.object(baseAddressSchema).partial();

interface Address {
  id: string
  fullName: string
  phone: string
  addressLine?: string
  tole: string
  district: string
  city: string
  postalCode?: string
  createdAt: string
}

interface AddressFormProps {
  userId: string
  address?: Address | null
  onSaved: (address: Address) => void
  onCancel: () => void
}

// Use Zod schema based on whether it's edit or create
const getSchema = (address?: Address) => (address ? updateAddressSchema : createAddressSchema)

export default function AddressForm({ userId, address, onSaved, onCancel }: AddressFormProps) {
  const schema = getSchema(address)

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: address ? { ...address } : {},
  })

  // Reset form when address prop changes
  React.useEffect(() => {
    if (address) reset({ ...address })
  }, [address, reset])

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      const method = address ? 'PUT' : 'POST'
      const url = address ? `${process.env.NEXT_PUBLIC_API_URL}/api/user/address/${address.id}` : `${process.env.NEXT_PUBLIC_API_URL}/api/user/address`

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // important if using cookies
        body: JSON.stringify({ ...data, userId }),
      })

      if (!response.ok) throw new Error('Failed to save address')

      const payload = await response.json()
      const savedAddress: Address = payload?.data ?? payload
      onSaved(savedAddress)
    } catch (err) {
      console.error(err)
      alert('Failed to save address. Please try again.')
    }
  }

  return (
    <Card className="border-border bg-card p-8">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-foreground">
          {address ? 'Edit Address' : 'Add New Address'}
        </h3>
        <button
          onClick={onCancel}
          className="rounded-lg p-1 hover:bg-secondary transition-colors"
          aria-label="Close form"
        >
          <X size={20} className="text-foreground" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
          <Input
            id="fullName"
            {...register('fullName')}
            placeholder="Enter your full name"
            className="border-border bg-background text-foreground placeholder:text-muted-foreground"
          />
          {errors.fullName && <p className="text-destructive text-sm">{errors.fullName.message}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
          <Input
            id="phone"
            {...register('phone')}
            placeholder="e.g., +9779812345678"
            className="border-border bg-background text-foreground placeholder:text-muted-foreground"
          />
          {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
        </div>

        {/* Address Line */}
        <div className="space-y-2">
          <Label htmlFor="addressLine">Address Line <span className="text-muted-foreground">(Optional)</span></Label>
          <Input
            id="addressLine"
            {...register('addressLine')}
            placeholder="Apartment, building name"
            className="border-border bg-background text-foreground placeholder:text-muted-foreground"
          />
          {errors.addressLine && <p className="text-destructive text-sm">{errors.addressLine.message}</p>}
        </div>

        {/* Tole */}
        <div className="space-y-2">
          <Label htmlFor="tole">Tole <span className="text-destructive">*</span></Label>
          <Input
            id="tole"
            {...register('tole')}
            placeholder="Enter your street/tole"
            className="border-border bg-background text-foreground placeholder:text-muted-foreground"
          />
          {errors.tole && <p className="text-destructive text-sm">{errors.tole.message}</p>}
        </div>

        {/* District & City */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="district">District <span className="text-destructive">*</span></Label>
            <Input
              id="district"
              {...register('district')}
              placeholder="Kathmandu"
              className="border-border bg-background text-foreground placeholder:text-muted-foreground"
            />
            {errors.district && <p className="text-destructive text-sm">{errors.district.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
            <Input
              id="city"
              {...register('city')}
              placeholder="Kathmandu"
              className="border-border bg-background text-foreground placeholder:text-muted-foreground"
            />
            {errors.city && <p className="text-destructive text-sm">{errors.city.message}</p>}
          </div>
        </div>

        {/* Postal Code */}
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code <span className="text-muted-foreground">(Optional)</span></Label>
          <Input
            id="postalCode"
            {...register('postalCode')}
            placeholder="e.g., 44600"
            className="border-border bg-background text-foreground placeholder:text-muted-foreground"
          />
          {errors.postalCode && <p className="text-destructive text-sm">{errors.postalCode.message}</p>}
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 border-t border-border pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? 'Saving...' : address ? 'Update Address' : 'Save Address'}
          </Button>
          <Button type="button" onClick={onCancel} variant="outline" className="flex-1 border-border bg-transparent">
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
