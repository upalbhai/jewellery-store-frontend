import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/core/requests';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { debounce } from 'lodash';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ALL_OPTION_VALUE = 'all';

const SearchFilters = ({ searchQuery = '', onFilterChange }) => {
  const { data } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('name') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || ALL_OPTION_VALUE);
  const [selectedSubCategory, setSelectedSubCategory] = useState(searchParams.get('subCategory') || ALL_OPTION_VALUE);
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const updateURL = (filters) => {
    const params = new URLSearchParams();
    if (filters.name) params.set('name', filters.name);
    if (searchParams.get('category')) params.set('category', searchParams.get('category'));
    if (searchParams.get('subCategory')) params.set('subCategory', searchParams.get('subCategory'));
    if (searchParams.get('minPrice')) params.set('minPrice', searchParams.get('minPrice'));
    if (searchParams.get('maxPrice')) params.set('maxPrice', searchParams.get('maxPrice'));

    navigate({ search: params.toString() }, { replace: true });
  };

  const debouncedFilterChange = debounce((updatedFilters) => {
    updateURL(updatedFilters);
    
    const dbFilters = {
      ...updatedFilters,
      category: updatedFilters.category === ALL_OPTION_VALUE ? '' : updatedFilters.category,
      subCategory: updatedFilters.subCategory === ALL_OPTION_VALUE ? '' : updatedFilters.subCategory
    };
    onFilterChange(dbFilters);
  }, 500);

  useEffect(() => {
    debouncedFilterChange({
      name: searchTerm,
      category: selectedCategory,
      subCategory: selectedSubCategory,
      minPrice,
      maxPrice,
    });

    return () => debouncedFilterChange.cancel();
  }, [searchTerm, selectedCategory, selectedSubCategory, minPrice, maxPrice]);

  const handlePriceFilterApply = () => {
    const filters = {
      name: searchTerm,
      category: selectedCategory === ALL_OPTION_VALUE ? '' : selectedCategory,
      subCategory: selectedSubCategory === ALL_OPTION_VALUE ? '' : selectedSubCategory,
      minPrice,
      maxPrice,
    };
    onFilterChange(filters);
  };

  return (
    <div className="bg-stark-white-100 p-4 rounded-lg shadow-sm space-y-4">
      <h2 className="text-lg font-semibold text-stark-white-950">Filters</h2>

      {/* Search Input */}
      <div className="space-y-1">
        <Label htmlFor="search" className="text-stark-white-900">Search</Label>
        <Input
          id="search"
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-white"
        />
      </div>

      {/* Category Select */}
      <div className="space-y-1">
  <Label className="text-stark-white-800 font-medium">Category</Label>
  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
    <SelectTrigger className="bg-white/90 hover:bg-white w-full min-w-[200px] max-w-[300px] border-stark-white-300 focus:ring-2 focus:ring-stark-white-400 focus:ring-offset-1">
      <SelectValue placeholder="All" className="text-stark-white-900" />
    </SelectTrigger>
    <SelectContent className="bg-white/95 backdrop-blur-sm border-stark-white-300 shadow-lg">
      <SelectItem 
        value={ALL_OPTION_VALUE} 
        className="hover:bg-stark-white-100/80 focus:bg-stark-white-100/50 text-stark-white-900"
      >
        All
      </SelectItem>
      {data?.data?.categories?.map((cat, index) => (
        <SelectItem 
          key={index} 
          value={cat}
          className="hover:bg-stark-white-100/80 focus:bg-stark-white-100/50 text-stark-white-900"
        >
          {cat}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

      {/* Subcategory Select */}
      <div className="space-y-2">
  {/* Subcategory Select */}
  <div className="space-y-1">
    <Label className="text-stark-white-800 font-medium">Subcategory</Label>
    <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
      <SelectTrigger className="bg-white/90 hover:bg-white w-full min-w-[200px] max-w-[300px] border-stark-white-300 focus:ring-2 focus:ring-stark-white-400 focus:ring-offset-1">
        <SelectValue placeholder="All" className="text-stark-white-900" />
      </SelectTrigger>
      <SelectContent className="bg-white/95 backdrop-blur-sm border-stark-white-300 shadow-lg">
        <SelectItem 
          value={ALL_OPTION_VALUE} 
          className="hover:bg-stark-white-100/80 focus:bg-stark-white-100/50 text-stark-white-900"
        >
          All
        </SelectItem>
        {data?.data?.subCategories?.map((sub, index) => (
          <SelectItem 
            key={index} 
            value={sub}
            className="hover:bg-stark-white-100/80 focus:bg-stark-white-100/50 text-stark-white-900"
          >
            {sub}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  {/* Price Range Filters */}
  <div className="space-y-1">
    <Label htmlFor="min-price" className="text-stark-white-800 font-medium">Min Price</Label>
    <Input
      id="min-price"
      type="number"
      value={minPrice}
      onChange={(e) => setMinPrice(e.target.value)}
      className="bg-white/90 hover:bg-white w-full min-w-[200px] max-w-[300px] border-stark-white-300 focus:ring-2 focus:ring-stark-white-400 focus:ring-offset-1"
    />
  </div>
</div>

      {/* Price Range Filters */}


      <div className="space-y-1">
        <Label htmlFor="max-price" className="text-stark-white-900">Max Price</Label>
        <Input
          id="max-price"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="bg-white/90 hover:bg-white w-full min-w-[200px] max-w-[300px] border-stark-white-300 focus:ring-2 focus:ring-stark-white-400 focus:ring-offset-1"
          />
      </div>

      {/* <Button
        onClick={handlePriceFilterApply}
        className="w-full bg-deep-green hover:bg-dark-green text-white"
      >
        Apply Price Filters
      </Button> */}
    </div>
  );
};

export default SearchFilters;