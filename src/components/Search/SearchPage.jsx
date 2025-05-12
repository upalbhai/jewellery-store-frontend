import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import SearchResults from './SearchResults';
import SearchFilters from './SearchFilters';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('name') || '';
  const [filters, setFilters] = useState({});

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="pt-[80px] px-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Filters section */}
        <div className="w-full md:w-1/4">
          <div className="md:sticky md:top-[100px]">
            <SearchFilters searchQuery={query} onFilterChange={handleFilterChange} />
          </div>
        </div>

        {/* Results section */}
        <div className="w-full md:w-3/4">
          <SearchResults searchQuery={query} filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
