import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAddress, updateAddress } from '@/core/requests'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'react-hot-toast'
import { Loader2, MapPin, Save, X, Pencil } from 'lucide-react'

const UserAddress = () => {
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    line: '',
    line2: '',
    city: '',
    state: '',
    zipCode: ''
  })

  // Fetch address data
  const { data: address, isLoading } = useQuery({
    queryKey: ['userAddress'],
    queryFn: getAddress,
    onSuccess: (data) => {
      if (data?.data) {
        setFormData({
          line: data.data.line || '',
          line2: data.data.line2 || '',
          city: data.data.city || '',
          state: data.data.state || '',
          zipCode: data.data.zipCode || ''
        })
      }
    },
    onError: () => {
      toast.error('Failed to fetch address')
    }
  })

  // Update address mutation
  const { mutate: updateUserAddress, isPending } = useMutation({
    mutationFn: updateAddress,
    onSuccess: () => {
      toast.success('Address updated successfully')
      queryClient.invalidateQueries({ queryKey: ['userAddress'] })
      setIsEditing(false)
    },
    onError: (error) => {
      toast.error(error.response?.data?.meta?.message || 'Failed to update address')
    }
  })

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateUserAddress(formData)
  }

  const handleEditClick = () => {
    // When entering edit mode, populate form with current values
    setFormData({
      line: address?.data?.line || '',
      line2: address?.data?.line2 || '',
      city: address?.data?.city || '',
      state: address?.data?.state || '',
      zipCode: address?.data?.zipCode || ''
    })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center mt-10">
        <Loader2 className="animate-spin text-teal-green w-6 h-6" />
      </div>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-sm border border-stark-white-200">
      <CardHeader className="flex flex-row items-center justify-between bg-mint-cream rounded-t-lg border-b border-stark-white-200 p-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-teal-green" />
          <CardTitle className="text-lg md:text-xl font-semibold text-stark-white-950">
            Shipping Address
          </CardTitle>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleEditClick}
            className="text-sm border-stark-white-400 hover:bg-stark-white-100 text-stark-white-800"
          >
            <Pencil className="w-4 h-4 mr-1.5 text-teal-green" /> 
            Edit Address
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="p-6 bg-off-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Address Line 1 */}
          <div className="grid gap-2">
            <Label htmlFor="line" className="text-deep-green">
              Address Line 1
            </Label>
            {isEditing ? (
              <Input
                id="line"
                name="line"
                value={formData.line}
                onChange={handleChange}
                className="bg-pale-teal border-deep-green focus:ring-2 focus:ring-teal-green focus:border-transparent"
                placeholder={address?.data?.line || 'Enter address line 1'}
                required
              />
            ) : (
              <p className="text-stark-white-900 font-medium">
                {address?.data?.line || 'Not provided'}
              </p>
            )}
          </div>

          {/* Address Line 2 */}
          <div className="grid gap-2">
            <Label htmlFor="line2" className="text-deep-green">
              Address Line 2 (Optional)
            </Label>
            {isEditing ? (
              <Input
                id="line2"
                name="line2"
                value={formData.line2}
                onChange={handleChange}
                className="bg-pale-teal border-deep-green focus:ring-2 focus:ring-teal-green focus:border-transparent"
                placeholder={address?.data?.line2 || 'Enter address line 2 (optional)'}
              />
            ) : (
              <p className="text-stark-white-900 font-medium">
                {address?.data?.line2 || 'Not provided'}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City */}
            <div className="grid gap-2">
              <Label htmlFor="city" className="text-deep-green">
                City
              </Label>
              {isEditing ? (
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="bg-pale-teal border-deep-green focus:ring-2 focus:ring-teal-green focus:border-transparent"
                  placeholder={address?.data?.city || 'Enter city'}
                  required
                />
              ) : (
                <p className="text-stark-white-900 font-medium">
                  {address?.data?.city || 'Not provided'}
                </p>
              )}
            </div>

            {/* State */}
            <div className="grid gap-2">
              <Label htmlFor="state" className="text-deep-green">
                State/Province
              </Label>
              {isEditing ? (
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="bg-pale-teal border-deep-green focus:ring-2 focus:ring-teal-green focus:border-transparent"
                  placeholder={address?.data?.state || 'Enter state/province'}
                  required
                />
              ) : (
                <p className="text-stark-white-900 font-medium">
                  {address?.data?.state || 'Not provided'}
                </p>
              )}
            </div>
          </div>

          {/* ZIP Code */}
          <div className="grid gap-2">
            <Label htmlFor="zipCode" className="text-deep-green">
              ZIP/Postal Code
            </Label>
            {isEditing ? (
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="bg-pale-teal border-deep-green focus:ring-2 focus:ring-teal-green focus:border-transparent max-w-[200px]"
                placeholder={address?.data?.zipCode || 'Enter ZIP/postal code'}
                required
              />
            ) : (
              <p className="text-stark-white-900 font-medium">
                {address?.data?.zipCode || 'Not provided'}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-teal-green hover:bg-sea-green text-stark-white-50 shadow-sm transition-colors"
              >
                {isPending ? (
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Address
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="border-stark-white-400 text-stark-white-800 hover:bg-stark-white-100"
              >
                <X className="w-4 h-4 mr-1.5" /> 
                Cancel
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

export default UserAddress