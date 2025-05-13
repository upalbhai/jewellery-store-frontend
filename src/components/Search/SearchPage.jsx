import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SearchResults from './SearchResults';
import SearchFilters from './SearchFilters';
import { Skeleton } from '@/components/ui/skeleton';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('name') || '';
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Simulate loading state for demonstration
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // You can replace this with real API loading
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="pt-[80px] px-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Filters section */}
        <div className="w-full md:w-1/4">
          <div className="md:sticky md:top-[100px]">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4 bg-gray-300" />
                <Skeleton className="h-6 w-full bg-gray-300" />
                <Skeleton className="h-6 w-5/6 bg-gray-300" />
                <Skeleton className="h-6 w-1/2 bg-gray-300" />
              </div>
            ) : (
              <SearchFilters searchQuery={query} onFilterChange={handleFilterChange} />
            )}
          </div>
        </div>

        {/* Results section */}
        <div className="w-full md:w-3/4">
          {loading ? (
            <div className="space-y-6">
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
          ) : (
            <SearchResults searchQuery={query} filters={filters} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
