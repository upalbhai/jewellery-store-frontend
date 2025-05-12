import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createReview, getAllReviews, editReview, deleteReview } from '@/core/requests';
import { toast } from 'react-hot-toast';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const ReviewComponent = ({ productId }) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState(1);
  const [page, setPage] = useState(1);
  const limit = 3; // Number of reviews per page

  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);

  // Fetch Reviews with Pagination
  const { data, isLoading } = useQuery({
    queryKey: ['reviews', productId, page],
    queryFn: () => getAllReviews(productId, page, limit),
    keepPreviousData: true,
  });

  const createMutation = useMutation({
    mutationFn: ({ text, rating }) => createReview({ content: text, rating }, productId),
    onSuccess: () => {
      toast.success('Review posted!');
      setReviewText('');
      setRating(1);
      queryClient.invalidateQueries(['reviews', productId]);
    },
    onError: (error) => toast.error(error?.response?.data?.error?.message ||'Failed to post review'),
  });

  const editMutation = useMutation({
    mutationFn: ({ reviewId, text, rating }) => editReview({ reviewId, content: text, rating }),
    onSuccess: () => {
      toast.success('Review updated!');
      setEditingId(null);
      setEditText('');
      setEditRating(1);
      queryClient.invalidateQueries(['reviews', productId]);
    },
    onError: () => toast.error('Failed to update review'),
  });

  const deleteMutation = useMutation({
    mutationFn: (reviewId) => deleteReview(reviewId, productId),
    onSuccess: () => {
      toast.success('Review deleted');
      queryClient.invalidateQueries(['reviews', productId]);
    },
    onError: () => toast.error('Failed to delete review'),
  });

  const handlePostReview = () => {
    if (!reviewText.trim()) return toast.error('Review cannot be empty');
    createMutation.mutate({ text: reviewText, rating });
  };

  const handleUpdateReview = () => {
    if (!editText.trim()) return toast.error('Updated review is empty');
    editMutation.mutate({ reviewId: editingId, text: editText, rating: editRating });
  };

  return (
<div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
  <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">Product Reviews</h2>

  {/* Create Review */}
  <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
    <textarea
      value={reviewText}
      onChange={(e) => setReviewText(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      rows={3}
      placeholder="Share your thoughts about this product..."
    />
    
    <div className="mt-3 flex items-center">
      <label className="mr-3 text-gray-700 font-medium">Rating: </label>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'} hover:scale-110 transition-transform`}
            onClick={() => setRating(star)}
          >
            ★
          </button>
        ))}
      </div>
    </div>

    <button
      onClick={handlePostReview}
      className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm font-medium disabled:opacity-50"
      disabled={!reviewText || !rating}
    >
      Post Review
    </button>
  </div>

  {/* Review List */}
  {isLoading ? (
    <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ) : (
    <div className="space-y-5">
      {
        data?.data?.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
            No reviews yet. Be the first to review!
          </div>
        ) : (
          data?.data?.map((review) => (
            <div
              key={review._id}
              className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-full">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-800">{review.userId?.name}</p>
                    <div className="flex items-center mt-1">
                      {Array.from({ length: 5 }, (_, index) => (
                        <span
                          key={index}
                          className={`text-lg ${index < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <small className="text-gray-500 text-sm">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </small>
                </div>

                {editingId === review._id ? (
                  <div className="mt-3">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                      rows={3}
                    />
                    <div className="flex items-center mb-3">
                      <label className="mr-3 text-gray-700 font-medium">Rating: </label>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`text-xl ${star <= editRating ? 'text-yellow-500' : 'text-gray-300'} hover:scale-110 transition-transform mx-1`}
                            onClick={() => setEditRating(star)}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleUpdateReview}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 mt-3 leading-relaxed">{review.content}</p>
                )}
              </div>

              {user?._id === review.userId?._id && !editingId && (
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setEditingId(review._id);
                      setEditText(review.content);
                      setEditRating(review.rating);
                    }}
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
                    title="Edit"
                  >
                    <FiEdit className="text-lg" />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(review._id)}
                    className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <FiTrash className="text-lg" />
                  </button>
                </div>
              )}
            </div>
          ))
        )
      }
    </div>
  )}

  {/* Pagination */}
  <div className="mt-8 flex justify-center space-x-4">
    {page > 1 && (
      <button
        onClick={() => setPage((prev) => prev - 1)}
        className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium shadow-sm"
      >
        Previous
      </button>
    )}
    {data?.meta?.page < data?.meta?.totalPages && (
      <button
        onClick={() => setPage((prev) => prev + 1)}
        className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm"
      >
        Next
      </button>
    )}
  </div>
</div>
  );
};

export default ReviewComponent;
