'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import AddressForm from './address-form'

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

interface AddressManagerProps {
  userId: string
}

export default function AddressManager({ userId }: AddressManagerProps) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  const fetchAddresses = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/addresses?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setAddresses(data)
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [userId])

  const handleAddressDeleted = (addressId: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== addressId))
  }

  const handleAddressSaved = (newAddress: Address) => {
    if (editingAddress) {
      setAddresses(addresses.map((addr) => (addr.id === newAddress.id ? newAddress : addr)))
      setEditingAddress(null)
    } else {
      setAddresses([...addresses, newAddress])
    }
    setShowForm(false)
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setShowForm(true)
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Saved Addresses</h2>
          <p className="mt-1 text-muted-foreground">Manage your delivery addresses</p>
        </div>
        {!showForm && (
          <Button
            onClick={() => {
              setEditingAddress(null)
              setShowForm(true)
            }}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={18} />
            Add Address
          </Button>
        )}
      </div>

      {/* Address Form */}
      {showForm && (
        <div className="mb-8">
          <AddressForm
            userId={userId}
            address={editingAddress}
            onSaved={handleAddressSaved}
            onCancel={() => {
              setShowForm(false)
              setEditingAddress(null)
            }}
          />
        </div>
      )}

      {/* Addresses Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary"></div>
        </div>
      ) : addresses.length === 0 ? (
        <Card className="border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">No addresses saved yet. Add your first address to get started.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id} className="border-border bg-card p-6">
              <div className="flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{address.fullName}</h3>
                    <p className="text-sm text-muted-foreground">{address.phone}</p>
                  </div>

                  <div className="space-y-2 text-sm text-foreground">
                    {address.addressLine && (
                      <p>{address.addressLine}</p>
                    )}
                    <p>{address.tole}</p>
                    <p>
                      {address.district}, {address.city}
                      {address.postalCode && ` - ${address.postalCode}`}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-2 border-t border-border pt-4">
                  <Button
                    onClick={() => handleEdit(address)}
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 border-border"
                  >
                    <Edit2 size={16} />
                    Edit
                  </Button>
                  <AddressDeleteButton addressId={address.id} onDeleted={() => handleAddressDeleted(address.id)} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}

function AddressDeleteButton({ addressId, onDeleted }: { addressId: string; onDeleted: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this address?')) return

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/addresses/${addressId}`, { method: 'DELETE' })
      if (response.ok) {
        onDeleted()
      }
    } catch (error) {
      console.error('Failed to delete address:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      onClick={handleDelete}
      disabled={isDeleting}
      variant="outline"
      size="sm"
      className="flex-1 gap-2 border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
    >
      <Trash2 size={16} />
      {isDeleting ? 'Deleting...' : 'Delete'}
    </Button>
  )
}
