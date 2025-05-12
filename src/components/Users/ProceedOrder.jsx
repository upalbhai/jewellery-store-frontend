import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createOrder, verifyPayment, retryOrderPayment, getOrderByIdForShop } from '@/core/requests';
import { KEY_ID } from '@/core/consts';

const ProcessOrder = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { orderId } = useParams();
  const [orderSummary, setOrderSummary] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isRetry, setIsRetry] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false); // New state for verification loading

  // Load Razorpay script when component mounts
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch order details if this is a retry
  useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderByIdForShop(orderId),
    enabled: !!orderId,
    onSuccess: (data) => {
      if (data?.data) {
        setIsRetry(true);
        setOrderDetails(data.data);
        setOrderSummary(data.data.products);
        setTotalAmount(data.data.totalAmount);
      }
    },
    onError: () => {
      toast.error('Failed to load order details');
      navigate('/profile/orders');
    }
  });

  // Initialize payment handler
  const initializePayment = async (razorpayOrder, orderData) => {
    if (!window.Razorpay) {
      toast.error('Payment gateway failed to load. Please refresh the page.');
      return;
    }

    const options = {
      key: KEY_ID,
      amount: razorpayOrder.amount.toString(),
      currency: razorpayOrder.currency,
      order_id: razorpayOrder.id,
      name: 'My Jewelry Store',
      description: `Payment for your order`,
      image: '/logo.png',
      handler: async (response) => {
        try {
          setIsVerifyingPayment(true); // Start verification loading
          const paymentResponse = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderData
          });

          if (paymentResponse.meta.success) {
            toast.success('Payment Successful!');
            navigate('/profile/orders');
          } else {
            toast.error(paymentResponse.meta.message || 'Payment verification failed');
          }
        } catch (error) {
          toast.error('Error verifying payment');
          console.error('Payment verification error:', error);
        } finally {
          setIsVerifyingPayment(false); // End verification loading
        }
      },
      prefill: {
        name: orderData.userId?.name || 'Customer',
        email: orderData.userId?.email || 'customer@example.com',
        contact: orderData.userId?.phoneNumber || '+919876543210'
      },
      theme: {
        color: '#1a2c2e',
      },
      modal: {
        ondismiss: () => {
          setIsVerifyingPayment(false); // Ensure loading is stopped if modal is dismissed
          toast('Payment window closed', { icon: 'ℹ️' });
        }
      }
    };

    try {
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      setIsVerifyingPayment(false);
      console.error('Error opening Razorpay:', error);
      toast.error('Failed to open payment gateway. Please try again.');
    }
  };

  // Create payment intent mutation
  const { mutate: createOrderMutation, isLoading: isCreatingIntent } = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      initializePayment(data.data.razorpayOrder, data.data.orderData);
    },
    onError: (error) => {
      toast.error(error.response?.data?.meta?.message || 'Failed to initiate payment');
      console.error('Payment intent error:', error);
    },
  });

  // Retry payment mutation
  const { mutate: retryOrderPaymentMutation, isLoading: isRetrying } = useMutation({
    mutationFn: retryOrderPayment,
    onSuccess: (data) => {
      initializePayment(data.data.razorpayOrder, {
        ...data.data.order,
        userId: data.data.order.userId._id
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.meta?.message || 'Payment retry failed');
      console.error('Payment retry error:', error);
    },
  });

  // Handle payment initiation
  const handlePayment = () => {
    if (!orderSummary.length || totalAmount === 0) {
      toast.error('Invalid order details');
      return;
    }

    const orderData = {
      products: orderSummary.map(item => ({
        productId: item.productId?._id || item.productId,
        quantity: item.quantity,
      })),
      deliveryAddress: orderDetails?.deliveryAddress || state?.deliveryAddress || 'Sample address',
    };

    if (isRetry && orderDetails) {
      retryOrderPaymentMutation(orderDetails._id);
    } else {
      createOrderMutation(orderData);
    }
  };

  // Set initial order data if coming from cart
  useEffect(() => {
    if (state?.cartData && !orderId) {
      const cart = state.cartData;
      setOrderSummary(cart);
      const total = cart.reduce((acc, item) => acc + item.quantity * item.productId.price, 0);
      setTotalAmount(total);
    }
  }, [state?.cartData, orderId]);

  // Combined loading state
  const isLoading = isCreatingIntent || isRetrying || isVerifyingPayment;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-semibold mb-6">
        {isRetry ? 'Retry Payment' : 'Order Summary'}
      </h2>
      
      {orderDetails?.status === 'payment_failed' && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>Your previous payment failed. Please try again.</p>
          {orderDetails.paymentAttempts && (
            <p className="text-sm mt-1">
              Attempt {orderDetails.paymentAttempts} of 3
            </p>
          )}
        </div>
      )}

      <div className="space-y-4 mb-6">
        {orderSummary?.map((item, index) => (
          <div key={index} className="flex justify-between py-2 border-b">
            <div className="flex items-center gap-3">
              {item.productId?.images?.[0] && (
                <img 
                  src={`${import.meta.env.VITE_API_URL}/${item.productId.images[0]}`}
                  alt={item.productId.name}
                  className="w-12 h-12 object-cover rounded"
                  onError={(e) => {
                    e.target.src = '/placeholder-product.png';
                  }}
                />
              )}
              <div>{item.productId?.name || 'Product'}</div>
            </div>
            <div className="font-medium">
              {item.quantity} × ₹{item.productId?.price || '0'}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between py-4 border-t border-b mb-6">
        <strong>Total Amount:</strong>
        <strong>₹{totalAmount.toFixed(2)}</strong>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handlePayment}
          disabled={isLoading}
          className={`px-6 py-3 rounded-lg text-white ${
            isLoading
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-teal-600 hover:bg-teal-700'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isVerifyingPayment ? 'Verifying Payment...' : 'Processing...'}
            </span>
          ) : isRetry ? 'Retry Payment' : 'Proceed to Payment'}
        </button>
      </div>

      {isRetry && (
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/profile/orders')}
            className="text-slate-600 hover:text-slate-800 text-sm"
          >
            Back to My Orders
          </button>
        </div>
      )}
    </div>
  );
};

export default ProcessOrder;