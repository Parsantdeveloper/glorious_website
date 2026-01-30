'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import AddressForm from './address-form'
import { useAuthStore } from '@/app/store/useAuthStore'

export interface Address {
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
  addresses: Address[]
}

export default function AddressManagerClient({
  addresses,
}: AddressManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [addressList, setAddressList] = useState<Address[]>(addresses)
  const {user}=useAuthStore();

  const apiBaseUrl = useMemo(() => process.env.NEXT_PUBLIC_API_URL ?? '', [])

  const handleAddressSaved = (address: Address) => {
    if (editingAddress) {
      setAddressList((prev) => prev.map((item) => (item.id === address.id ? address : item)))
    } else {
      setAddressList((prev) => [address, ...prev])
    }
    setEditingAddress(null)
    setShowForm(false)
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setShowForm(true)
  }

  const handleDelete = async (addressId: string) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/user/address/${addressId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!res.ok) throw new Error('Failed to delete address')

      setAddressList((prev) => prev.filter((item) => item.id !== addressId))
    } catch (error) {
      console.error(error)
      alert('Failed to delete address. Please try again.')
    }
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Saved Addresses</h2>
          <p className="mt-1 text-muted-foreground">
            Manage your delivery addresses
          </p>
        </div>

        {!showForm && (
          <Button
            onClick={() => {
              setEditingAddress(null)
              setShowForm(true)
            }}
            className="gap-2"
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
            userId={user!.id}
            address={editingAddress}
            onSaved={handleAddressSaved}
            onCancel={() => {
              setEditingAddress(null)
              setShowForm(false)
            }}
          />
        </div>
       )} 

      {/* Address List */}
      {addressList.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            No addresses saved yet.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {addressList.map((address) => (
            <Card key={address.id} className="p-6">
              <div className="flex h-full flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">{address.fullName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {address.phone}
                    </p>
                  </div>

                  <div className="text-sm space-y-1">
                    {address.addressLine && <p>{address.addressLine}</p>}
                    <p>{address.tole}</p>
                    <p>
                      {address.district}, {address.city}
                      {address.postalCode && ` - ${address.postalCode}`}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-2 border-t pt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => handleEdit(address)}
                  >
                    <Edit2 size={16} />
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-2 text-destructive"
                    onClick={() => handleDelete(address.id)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
