import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { addToCart as addToCartAPI } from '@/core/requests';
import { useDispatch } from 'react-redux';
import { setCartData } from '@/features/auth/authSlice';
import toast from 'react-hot-toast';

const AddToCartButton = ({ productId }) => {
  const dispatch = useDispatch();

  const { mutate, isPending } = useMutation({
    mutationFn: () => addToCartAPI(productId),
    onSuccess: (data) => {
      toast.success(data?.meta?.message || 'Product added to cart')
      dispatch(setCartData(data?.data)); // assuming response contains the added product
    },
    onError: (error) => {
      toast.error(error.response.data.meta.message || error.message || "You are not authorised")
      console.error('Add to cart failed:', error);
    }
  });

  return (
    <button
      onClick={() => mutate()}
      disabled={isPending}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
    >
      {isPending ? 'Adding...' : 'Add to Cart'}
    </button>
  );
};

export default AddToCartButton;
