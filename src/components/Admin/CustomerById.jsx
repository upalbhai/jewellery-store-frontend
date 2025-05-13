import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getUserByIdForAdmin, updatePremiumStatus } from '@/core/requests';
import toast from 'react-hot-toast';
import { Skeleton } from '../ui/skeleton';

const CustomerById = () => {
  const { id } = useParams();

  const [isPremium, setIsPremium] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState('');

  // Fetch user details
  const { data, isLoading } = useQuery({
    queryKey: ['getUserByIdForAdmin', id],
    queryFn: () => getUserByIdForAdmin(id),
    enabled: !!id,
  });

  // Set user data when available
  useEffect(() => {
    if (data?.data) {
      setIsPremium(data.data.isPremium || false);
      setDiscount(data.data.premiumDiscount || 0);
    }
  }, [data]);

  // Mutation to update premium status
  const mutation = useMutation({
    mutationFn: () => updatePremiumStatus(id, isPremium, discount),
    onSuccess: (res) => {
      if (res.meta.success) {
        toast.success(res?.meta?.message||'Updated premium status successfully');
      } else {
        setError(res.meta.message);
      }
    },
    onError: (err) => {
      setError(err.message || 'Error updating premium status');
    },
  });

  const handleSubmit = () => {
    if (discount < 0 || discount > 100) {
      setError('Discount must be between 0 and 100');
      return;
    }

    setError('');
    mutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-xl mx-auto space-y-6 bg-white rounded shadow">
        <Skeleton className="h-8 w-48 bg-slate-300 rounded" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-64 bg-slate-400 rounded" />
          <Skeleton className="h-4 w-64 bg-slate-400 rounded" />
          <Skeleton className="h-4 w-64 bg-slate-400 rounded" />
        </div>
        <div className="space-y-4 mt-6">
          <Skeleton className="h-5 w-32 bg-slate-400 rounded" />
          <Skeleton className="h-10 w-24 bg-slate-400 rounded" />
          <Skeleton className="h-10 w-32 bg-slate-400 rounded" />
        </div>
      </div>
    );
  }

  const user = data?.data;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold">Customer Details</h2>

      <div className="space-y-2">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Phone Number:</strong> {user?.phoneNumber}</p>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-4">
          <label className="font-medium">Premium Status:</label>
          <input
            type="checkbox"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
            className="w-5 h-5"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="font-medium">Discount (%):</label>
          <input
            type="number"
            min="0"
            max="100"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="w-24 p-2 border rounded"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={mutation.isLoading}
          className="bg-deep-green text-white px-4 py-2 rounded hover:bg-forest-green"
        >
          {mutation.isLoading ? 'Updating...' : 'Update Premium'}
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default CustomerById;
