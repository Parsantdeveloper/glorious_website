'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'

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

export default function AddressForm({ userId, address, onSaved, onCancel }: AddressFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    tole: '',
    district: '',
    city: '',
    postalCode: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (address) {
      setFormData({
        fullName: address.fullName,
        phone: address.phone,
        addressLine: address.addressLine || '',
        tole: address.tole,
        district: address.district,
        city: address.city,
        postalCode: address.postalCode || '',
      })
    }
  }, [address])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.fullName || !formData.phone || !formData.tole || !formData.district || !formData.city) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setIsSaving(true)
      const method = address ? 'PUT' : 'POST'
      const url = address ? `/api/addresses/${address.id}` : '/api/addresses'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save address')
      }

      const savedAddress = await response.json()
      onSaved(savedAddress)
    } catch (err) {
      setError('Failed to save address. Please try again.')
      console.error(err)
    } finally {
      setIsSaving(false)
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-semibold text-foreground">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="border-border bg-background text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-semibold text-foreground">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="border-border bg-background text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>

        {/* Address Line */}
        <div className="space-y-2">
          <Label htmlFor="addressLine" className="text-sm font-semibold text-foreground">
            Address Line <span className="text-muted-foreground">(Optional)</span>
          </Label>
          <Input
            id="addressLine"
            name="addressLine"
            type="text"
            value={formData.addressLine}
            onChange={handleChange}
            placeholder="e.g., Apartment, building name"
            className="border-border bg-background text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Tole */}
        <div className="space-y-2">
          <Label htmlFor="tole" className="text-sm font-semibold text-foreground">
            Tole <span className="text-destructive">*</span>
          </Label>
          <Input
            id="tole"
            name="tole"
            type="text"
            value={formData.tole}
            onChange={handleChange}
            placeholder="Enter your tole/street"
            className="border-border bg-background text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>

        {/* District and City Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="district" className="text-sm font-semibold text-foreground">
              District <span className="text-destructive">*</span>
            </Label>
            <Input
              id="district"
              name="district"
              type="text"
              value={formData.district}
              onChange={handleChange}
              placeholder="e.g., Kathmandu"
              className="border-border bg-background text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-semibold text-foreground">
              City <span className="text-destructive">*</span>
            </Label>
            <Input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g., Kathmandu"
              className="border-border bg-background text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>
        </div>

        {/* Postal Code */}
        <div className="space-y-2">
          <Label htmlFor="postalCode" className="text-sm font-semibold text-foreground">
            Postal Code <span className="text-muted-foreground">(Optional)</span>
          </Label>
          <Input
            id="postalCode"
            name="postalCode"
            type="text"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="e.g., 44600"
            className="border-border bg-background text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 border-t border-border pt-6">
          <Button
            type="submit"
            disabled={isSaving}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSaving ? 'Saving...' : address ? 'Update Address' : 'Save Address'}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-border bg-transparent"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
