import { getOrderByIdForShop } from '@/core/requests';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const OrderById = () => {
  const { id:orderId } = useParams(); // Assumes route is like /orders/:orderId
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderByIdForShop(orderId);
        setOrder(res.data);
      } catch (err) {
        setError('Failed to fetch order.');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Order Details</h1>
      <p><strong>Customer:</strong> {order?.userId?.name}</p>
      <p><strong>Email:</strong> {order?.userId?.email}</p>
      <p><strong>Phone:</strong> {order?.userId?.phoneNumber}</p>

      <h2 className="text-lg font-semibold mt-4">Products</h2>
      {order.products?.map((item, index) => (
        <div key={index} className="border-b py-2">
          <p><strong>Name:</strong> {item.productId?.name}</p>
          <p><strong>Category:</strong> {item.productId?.category}</p>
          <p><strong>Price:</strong> ₹{item.productId?.price}</p>
          <p><strong>Quantity:</strong> {item.quantity}</p>
          {item.productId?.images?.[0] && (
            <img src={`${import.meta.env.VITE_API_URL}/${item.productId.images[0]}`} alt="Product" className="w-24 mt-2" />
          )}
        </div>
      ))}

      <div className="mt-4">
        <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Payment:</strong> {order.paymentMethod}</p>
      </div>
    </div>
  );
};

export default OrderById;
