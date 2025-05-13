import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFeaturePost } from '@/core/requests';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedProducts = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: getFeaturePost,
  });

  const navigate = useNavigate();

  const productsByCategory = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-12 px-4 sm:px-6 lg:px-12 py-8 bg-[color:var(--color-off-white)]">
        {[...Array(2)].map((_, i) => (
          <div key={i}>
            <Skeleton className="h-6 w-48 mb-4 bg-gray-400 rounded-md" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className=" bg-gray-400 h-72 w-full rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-[color:var(--color-stark-white-700)]">
        Failed to load featured products.
      </div>
    );
  }

  return (
    <div className="space-y-12 px-4 sm:px-6 lg:px-12 py-8 bg-[color:var(--color-off-white)]">
      {Object.entries(productsByCategory || {}).map(([category, products]) => (
        <div key={category}>
          <h2 className="text-2xl font-bold mb-6 text-[color:var(--color-deep-green)] border-l-4 pl-4 border-[color:var(--color-stark-white-600)] capitalize">
            {category}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {(products || []).map((product) => {
              const hasDiscount = product?.discount > 0;
              const discountedPrice = hasDiscount
                ? (product?.price * (1 - product?.discount / 100)).toFixed(2)
                : product?.price?.toFixed(2);

              return (
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  onClick={() => navigate(`/product/${product?._id}`)}
                  key={product?._id}
                  className={`cursor-pointer relative rounded-xl shadow-md p-4 flex flex-col border ${
                    hasDiscount
                      ? 'border-red-400 bg-red-50'
                      : 'border-[color:var(--color-stark-white-200)] bg-[color:var(--color-stark-white-50)]'
                  }`}
                >
                  {/* Discount Ribbon */}
                  {hasDiscount && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs z-10 font-bold px-2 py-1 rounded shadow">
                      {product?.discount}% OFF
                    </span>
                  )}

                  {/* Image */}
                  <div className="relative w-full h-40 overflow-hidden rounded-lg mb-3">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/${product?.images?.[0]}`}
                      alt={product?.name}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                    {!product?.isAvailable && (
                      <span className="absolute top-2 right-2 bg-gray-700 text-white text-xs px-2 py-1 rounded">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Product Name */}
                  <h3 className="text-lg font-semibold text-[color:var(--color-deep-green)]">
                    {product?.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[color:var(--color-slate-green)] line-clamp-2">
                    {product?.description}
                  </p>

                  {/* Price */}
                  <div className="mt-auto pt-3 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-[color:var(--color-stark-white-700)]">
                      ₹{discountedPrice}
                      </span>
                      {hasDiscount && (
                        <span className="text-sm line-through text-gray-500">
                          ₹{product?.price?.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedProducts;
