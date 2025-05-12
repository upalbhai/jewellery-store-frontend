import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { BASE_URL, ORDERS } from '@/core/consts';

const CustomOrderById = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}${ORDERS.CUSTOM_ORDERS}/${id}`, {
          withCredentials: true,
        });
        setOrder(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch order details');
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 text-center">
            <Skeleton className="h-6 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <div className="grid grid-cols-3 gap-4 w-full mt-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto py-8 max-w-4xl text-center">
        <h2 className="text-xl font-semibold text-stark-white-700">
          Order not found
        </h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card className="shadow-lg bg-off-white border border-stark-white-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-deep-green">
            Custom Order Details
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-deep-green">
          {/* Customer Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-stark-white-700">Customer Details</h3>
            <div className="flex items-center space-x-4 p-4 bg-mint-cream rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {order?.userId?.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  <span className="font-semibold">Name:</span> {order.userId.name}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Email:</span> {order.userId.email}
                </p>
                {order.userId.phoneNumber && (
                  <p className="text-sm">
                    <span className="font-semibold">Phone:</span> {order.userId.phoneNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Message */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-stark-white-700">Customer Message</h3>
            <div className="p-4 bg-mint-cream rounded-lg">
              <p className="whitespace-pre-line text-deep-green">{order.message}</p>
            </div>
          </div>

          {/* Order Images */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-stark-white-700">Uploaded Images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {order.images.map((img, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-lg border border-stark-white-300 bg-off-white">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${img.replace(/\\/g, "/")}`}
                    alt={`Custom order ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomOrderById;
