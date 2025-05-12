import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '@/core/requests';
import { motion } from 'framer-motion';
import AddToCartButton from './AddToCartButton';
import ReviewComponent from './ReviewComponent';
import { CardContent } from './ui/card';
import { ChevronUp, MessageSquarePlus } from 'lucide-react';
import { Button } from './ui/button';
import SuggestionProducts from './SuggestionProducts';

const CustomerProductById = () => {
  const { id } = useParams();
  const [showReviews, setShowReviews] = useState(false)
  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });

  const product = data?.data;
  const images = product?.images || [];
  const [selectedImage, setSelectedImage] = useState(null);
  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);
  if (isLoading) {
    return (
      <div className="text-center py-10 text-[color:var(--color-deep-green)]">
        Loading product details...
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="text-center py-10 text-red-600">
        Failed to load product details.
      </div>
    );
  }

  return (
    <>
    
    <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10 bg-off-white">
      {/* Left: Image Section */}
      <div>
        <div className="w-full h-96 rounded-xl overflow-hidden shadow-md">
          <img
            src={`${import.meta.env.VITE_API_URL}/${selectedImage}`}
            alt="Main"
            className="w-full h-full object-cover"
          />
        </div>

        {images.length > 1 && (
          <div className="flex mt-4 gap-3 overflow-x-auto pb-1">
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 min-w-[80px] cursor-pointer rounded border-2 ${
                  selectedImage === img
                    ? 'border-deep-green'
                    : 'border-gray-200'
                }`}
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}/${img}`}
                  alt={`thumb-${idx}`}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Product Details */}
      <div className="flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold text-deep-green">{product.name}</h1>
          <p className="text-sm text-slate-green mt-2">{product.description}</p>

          <div className="mt-4 space-y-1 text-stark-white-700">
            <p><span className="font-semibold">Category:</span> {product.category}</p>
            <p><span className="font-semibold">Sub Category:</span> {product.subCategory}</p>
            <p><span className="font-semibold">Stock:</span> {product.stockQuantity}</p>
            <p>
              <span className="font-semibold">Availability:</span>{' '}
              {product.isAvailable ? (
                <span className="text-green-600 font-medium">In Stock</span>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-stark-white-700">
              ${product.price}
            </span>
            {product.discount > 0 && (
              <span className="text-sm font-semibold text-stark-white-600">
                -{product.discount}% OFF
              </span>
            )}
          </div>

          {/* <button
            className="mt-6 bg-deep-green text-white px-6 py-2 rounded hover:bg-opacity-90 transition"
            disabled={!product.isAvailable}
          >
            {product.isAvailable ? 'Add to Cart' : 'Unavailable'}
          </button> */}
          <div className='mt-6 px-6 py-2 rounded'>

          <AddToCartButton productId={product?._id} />
          </div>

        </div>
    <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReviews(!showReviews)}
            className="text-teal-green mt-3 bg-off-white  gap-2"
          >
            {showReviews ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Hide Reviews
              </>
            ) : (
              <>
                <MessageSquarePlus className="h-4 w-4" />
                Write/View Reviews
              </>
            )}
          </Button>
      </div>
    </div>
          
      {showReviews && (
        <CardContent className="pt-4">
            <ReviewComponent productId={product?._id} />
        </CardContent>
      )}
  <SuggestionProducts productId={product?._id} />
    </>
  );
};

export default CustomerProductById;
