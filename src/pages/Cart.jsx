import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { FiTrash } from 'react-icons/fi';
import { getCartItems, removeCartItems } from '@/core/requests';
import { removeFromCart } from '@/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { cart } = useSelector((state) => state.auth);
  const [quantities, setQuantities] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  const { data, isLoading, isError } = useQuery({
    queryKey: ['cart'],
    queryFn: getCartItems,
    onError: (error) => {
      toast.error(error.response?.data?.meta?.message || 'Failed to load cart items');
    },
  });

  useEffect(() => {
    if (data?.data) {
      const initialQuantities = {};
      data.data.forEach(item => {
        initialQuantities[item._id] = item.quantity || 1;
      });
      setQuantities(initialQuantities);
    }
  }, [data]);

  const removeMutation = useMutation({
    mutationFn: removeCartItems,
    onSuccess: (data, productId) => {
      dispatch(removeFromCart(productId));
      queryClient.invalidateQueries(['cart']);
      toast.success(data?.meta?.message || 'Item removed from cart');
    },
    onError: (error) => {
      toast.error(error.response?.data?.meta?.message || 'Failed to remove item');
    },
  });

  const handleQuantityChange = (id, value) => {
    const numValue = Number(value);
    
    if (isNaN(numValue)) {
      setValidationErrors(prev => ({ ...prev, [id]: 'Please enter a valid number' }));
      return;
    }
    
    if (numValue < 1) {
      setValidationErrors(prev => ({ ...prev, [id]: 'Quantity must be at least 1' }));
      return;
    }
    
    setQuantities(prev => ({ ...prev, [id]: numValue }));
    setValidationErrors(prev => ({ ...prev, [id]: '' }));
  };

  const validateQuantities = () => {
    const errors = {};
    let isValid = true;
    
    data?.data?.forEach(item => {
      const quantity = quantities[item._id];
      if (!quantity || isNaN(quantity) || quantity < 1) {
        errors[item._id] = 'Quantity must be at least 1';
        isValid = false;
      }
    });
    
    setValidationErrors(errors);
    return isValid;
  };

  const proceedToOrder = () => {
    if (!validateQuantities()) {
      toast.error('Please fix all quantity errors before proceeding');
      return;
    }

    const updatedCart = data?.data?.map((item) => ({
      ...item,
      quantity: quantities[item._id],
    }));

    navigate('/process-order', { state: { cartData: updatedCart } });
  };

  // Skeleton loading component for cart items
  const CartItemSkeleton = () => (
    <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white">
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-md bg-gray-400" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40 bg-gray-400" />
          <Skeleton className="h-4 w-32 bg-gray-400" />
          <Skeleton className="h-8 w-20 bg-gray-400" />
        </div>
      </div>
      <Skeleton className="w-6 h-6 rounded-full bg-gray-400" />
    </div>
  );

  if (isLoading) return (
    <div className="max-w-4xl mx-auto py-10">
      <Skeleton className="h-8 w-48 mb-6 bg-gray-400" />
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <CartItemSkeleton key={index} />
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <Skeleton className="h-10 w-40 bg-gray-400" />
      </div>
    </div>
  );

  if (isError) return <div className="text-center py-10 text-red-500">Failed to load cart</div>;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>
      {data?.data?.length === 0 ? (
        <div className="text-gray-500">Your cart is empty.</div>
      ) : (
        <>
          <div className="space-y-4">
            {data?.data?.map((item) => (
              <div
                key={item?._id}
                className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white"
              >
                <div className="flex items-center gap-4">
                  {item?.productId?.images?.[0] ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/${item.productId.images[0]}`}
                      alt={item?.productId?.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <Skeleton className="w-16 h-16 rounded-md bg-gray-400" />
                  )}
                  <div>
                    <h4 className="text-lg font-medium">{item?.productId?.name || 'Product Name'}</h4>
                    {item?.productId?.discount ? (
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-900 font-semibold">
                          ₹{item?.productId?.price - (item?.productId?.price * item?.productId?.discount) / 100}
                        </p>
                        <p className="text-sm text-gray-500 line-through">
                          ₹{item?.productId?.price}
                        </p>
                        <p className="text-xs text-green-600 font-medium">
                          ({item?.productId?.discount}% OFF)
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-900 font-semibold">₹{item?.productId?.price || '0'}</p>
                    )}
                    <div className="mt-1">
                      <input
                        type="number"
                        min="1"
                        className={`border rounded px-2 py-1 w-20 ${
                          validationErrors[item._id] ? 'border-red-500' : ''
                        }`}
                        value={quantities[item._id] || ''}
                        onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                      />
                      {validationErrors[item._id] && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors[item._id]}</p>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeMutation.mutate(item._id)}
                  className="text-red-500 hover:text-red-700"
                  title="Remove"
                  disabled={removeMutation.isLoading}
                >
                  {removeMutation.isLoading ? 'Removing...' : <FiTrash className="text-xl" />}
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={proceedToOrder}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
              disabled={Object.values(validationErrors).some(error => error)}
            >
              Proceed to Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;