import { useEffect, useMemo } from 'react';
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
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
    window.scrollTo(0, 0);
  }, [cleanedFilters, searchQuery, refetch]);

  const products = data?.pages.flatMap((page) => page?.data ?? []) || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto my-10">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error?.message || 'Something went wrong.'}</AlertDescription>
      </Alert>
    );
  }

  if (!products.length) {
    return <p className="text-center py-10 text-gray-500">No products found.</p>;
  }

  return (
    <InfiniteScroll
      dataLength={products.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<p className="text-center py-4 text-muted-foreground">Loading more products...</p>}
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
      onClick={() => navigate(`/product/${product?._id}`)}
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
          <span className="text-base font-bold text-gray-900">
          ₹{discountedPrice}
          </span>
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
