import { useEffect, useMemo, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getProducts } from '@/core/requests';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

// Utility to clean empty values
const cleanObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj || {}).filter(([_, value]) => value !== '' && value != null)
  );
};

const SearchResults = ({ searchQuery, filters }) => {
  const cleanedFilters = useMemo(() => cleanObject(filters), [filters]);
  const navigate = useNavigate();
  const hasRestoredScroll = useRef(false); // Prevent double scroll

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    refetch,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['products', searchQuery, cleanedFilters],
    queryFn: ({ pageParam = 1 }) =>
      getProducts({
        ...cleanedFilters,
        name: searchQuery,
        page: pageParam,
      }),
    getNextPageParam: (lastPage, pages) =>
      lastPage.meta?.hasNextPage ? pages.length + 1 : undefined,
    staleTime: 5 * 60 * 1000,
  });

  const products = data?.pages.flatMap((page) => page?.data ?? []) || [];

  // 🧠 Save scroll position before navigating to product
  const handleProductClick = (id) => {
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    navigate(`/product/${id}`);
  };

  // ✅ Restore scroll position on mount
  useEffect(() => {
    refetch();

    const savedScroll = sessionStorage.getItem('scrollPosition');
    if (savedScroll && !hasRestoredScroll.current) {
      window.scrollTo(0, parseInt(savedScroll, 10));
      hasRestoredScroll.current = true;
      sessionStorage.removeItem('scrollPosition');
    }
  }, [cleanedFilters, searchQuery, refetch]);

  // ⏳ Loading Skeletons
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl shadow-md bg-white overflow-hidden">
            <Skeleton className="aspect-[4/3] w-full bg-gray-300" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-5 w-3/4 bg-gray-400" />
              <Skeleton className="h-4 w-1/2 bg-gray-400" />
              <Skeleton className="h-4 w-1/3 bg-gray-400" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ❌ Error State
  if (isError) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto my-10">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error?.message || 'Something went wrong.'}</AlertDescription>
      </Alert>
    );
  }

  // ⚠️ No Products
  if (!products.length) {
    return <p className="text-center py-10 text-gray-500">No products found.</p>;
  }

  return (
    <InfiniteScroll
      dataLength={products.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={`loading-more-${i}`} className="rounded-2xl shadow-md bg-white overflow-hidden">
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      }
      scrollThreshold={0.95}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {products.map((product) => {
          const hasDiscount = product.discount > 0;
          const discountedPrice = hasDiscount
            ? (product.price * (1 - product.discount / 100)).toFixed(2)
            : product.price.toFixed(2);

          return (
            <div
              onClick={() => handleProductClick(product._id)}
              key={product._id}
              className={`relative bg-white cursor-pointer rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col ${
                hasDiscount ? 'border border-red-300 bg-red-50' : ''
              }`}
            >
              {/* Discount Badge */}
              {hasDiscount && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10 shadow">
                  {product.discount}% OFF
                </div>
              )}

              {/* Product Image */}
              {product.images?.[0] && (
                <img
                  src={`${import.meta.env.VITE_API_URL}/${product.images[0]}`}
                  alt={product.name}
                  className="aspect-[4/3] object-cover w-full"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              )}

              {/* Product Info */}
              <div className="p-4 flex flex-col gap-1 flex-grow">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{product?.name}</h3>

                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <span className="text-base font-bold text-gray-900">₹{discountedPrice}</span>
                  {hasDiscount && (
                    <span className="text-sm line-through text-gray-500">₹{product.price.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </InfiniteScroll>
  );
};

export default SearchResults;
