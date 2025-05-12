import React, { useEffect, useState } from 'react';
import { getSuggesstedProduct } from '@/core/requests';
import { Card, CardContent } from '@/components/ui/card'; // Assuming you're using this
import { Link } from 'react-router-dom'; // Optional if you want to link to product detail

const SuggestionProducts = ({ productId }) => {
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggested = async () => {
    try {
      setLoading(true);
      const res = await getSuggesstedProduct(productId);
      setSuggestedProducts(res.data || []);
    } catch (err) {
      console.error('Error fetching suggested products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchSuggested();
    }
  }, [productId]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">You Might Also Like</h2>

      {loading ? (
        <div>Loading...</div>
      ) : suggestedProducts.length === 0 ? (
        <p>No suggestions available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {suggestedProducts.map((product) => (
            <Card key={product._id} className="hover:shadow-lg transition">
              <Link to={`/product/${product._id}`}>
                <img
                  src={`${import.meta.env.VITE_API_URL}/${product.images[0]}` || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-t"
                />
                <CardContent className="p-3">
                  <h3 className="text-md font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-500">${product.price}</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestionProducts;
