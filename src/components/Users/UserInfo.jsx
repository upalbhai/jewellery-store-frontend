import React, { useState } from 'react';
import { getProfile, editProfile } from '@/core/requests';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton component
import { toast } from 'react-hot-toast';
import { Star } from 'lucide-react';
import { Loader2, Pencil, Save, X } from 'lucide-react';

const UserInfo = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
  });

  const { data:profile, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getProfile,
    onSuccess: (data) => {
        setFormData({
            name: data?.data?.user?.name || '',
            phoneNumber: data?.data?.user?.phoneNumber || '',
          });
    },
    onError: () => {
      toast.error('Failed to fetch profile data');
    },
  });
  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: editProfile,
    onSuccess: () => {
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.response.data.meta.message ||'Failed to update profile');
      console.error(error);
    },
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  const handleCancel = () => {
    setFormData({
        name: profile?.data?.user?.name || '',
        phoneNumber: profile?.data?.user?.phoneNumber || '',
      });
      
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto mt-6 shadow-sm border border-stark-white-200">
        <CardHeader className="flex flex-row items-center justify-between bg-stark-white-50 rounded-t-lg border-b border-stark-white-200 p-4">
          <Skeleton className="h-6 w-[200px] bg-gray-400" />
          <Skeleton className="h-9 w-[110px] bg-gray-400" />
        </CardHeader>
        
        <CardContent className="p-6 bg-off-white space-y-6">
          {/* Name Field Skeleton */}
          <div className="grid gap-2">
            <Skeleton className="h-4 w-[80px] bg-gray-400" />
            <Skeleton className="h-9 w-full bg-gray-400" />
          </div>
          
          {/* Phone Number Field Skeleton */}
          <div className="grid gap-2">
            <Skeleton className="h-4 w-[120px] bg-gray-400" />
            <Skeleton className="h-9 w-full bg-gray-400" />
          </div>
          
          {/* Email Field Skeleton */}
          <div className="grid gap-2">
            <Skeleton className="h-4 w-[50px] bg-gray-400" />
            <Skeleton className="h-5 w-[250px] bg-gray-400" />
          </div>
          
          {/* Premium Info Skeleton */}
          <div className="p-4 rounded-lg bg-gray-100 border border-gray-200">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full bg-gray-400" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[150px] bg-gray-400" />
                <Skeleton className="h-3 w-[200px] bg-gray-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-sm border border-stark-white-200">
      <CardHeader className="flex flex-row items-center justify-between bg-stark-white-50 rounded-t-lg border-b border-stark-white-200 p-4">
        <CardTitle className="text-lg md:text-xl font-semibold text-stark-white-950">
          User Information
        </CardTitle>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-sm border-stark-white-400 hover:bg-stark-white-100 text-stark-white-800"
          >
            <Pencil className="w-4 h-4 mr-1.5 text-teal-green" /> 
            Edit Profile
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="p-6 bg-off-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-deep-green">
              Name
            </Label>
            {isEditing ? (
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-stark-white-50 border-stark-white-300 focus:ring-2 focus:ring-teal-green focus:border-transparent"
              />
            ) : (
              <p className="text-stark-white-900 font-medium">
                {profile?.data?.user?.name}
              </p>
            )}
          </div>

          {/* Phone Number Field */}
          <div className="grid gap-2">
            <Label htmlFor="phoneNumber" className="text-deep-green">
              Phone Number
            </Label>
            {isEditing ? (
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="bg-stark-white-50 border-stark-white-300 focus:ring-2 focus:ring-teal-green focus:border-transparent"
              />
            ) : (
              <p className="text-stark-white-900 font-medium">
                {profile?.data?.user?.phoneNumber || 'Not provided'}
              </p>
            )}
          </div>

          {/* Email (non-editable) */}
          <div className="grid gap-2">
            <Label className="text-deep-green">Email</Label>
            <p className="text-stark-white-900 font-medium">
              {profile?.data?.user?.email}
            </p>
          </div>

          {/* Premium Info */}
          {profile?.data?.user?.isPremium && (
            <div className="p-4 rounded-lg bg-gradient-to-r from-pale-teal to-mint-cream border border-light-teal">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-sea-green/10">
                  <Star className="w-5 h-5 text-sea-green" />
                </div>
                <div>
                  <p className="font-semibold text-deep-green">
                    Premium Member
                  </p>
                  {profile?.data?.user?.premiumDiscount && (
                    <p className="text-sm text-teal-green mt-1">
                      Enjoy {profile?.data?.user?.premiumDiscount}% discount on all purchases
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

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
                Save Changes
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
  );
};

export default UserInfo;