import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "@/core/requests";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PRODUCTS_PER_PAGE = 2;

const SkeletonCard = () => (
  <div className="border rounded p-4 animate-pulse bg-gray-400 h-32" />
);

const CustomerOrderById = () => {
  const { id: orderId } = useParams();
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["orderDetails", orderId],
    queryFn: () => getOrderById({ orderId }),
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-md shadow-md space-y-6 max-w-4xl mx-auto">
      <div className="p-4 space-y-4">
        <div className="h-6 bg-gray-400 rounded w-1/3 animate-pulse" />
        <div className="h-4 bg-gray-400 rounded w-1/4 animate-pulse" />
        <div className="h-4 bg-gray-400 rounded w-1/4 animate-pulse" />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
</div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center py-8">
        Error: {error?.message || "Something went wrong."}
      </div>
    );
  }

  const order = data?.data;
  const products = order?.products || [];
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  return (
    <div className="p-6 bg-white rounded-md shadow-md space-y-6 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
        <p className="text-gray-600">
          <strong>Status:</strong> {order?.status || "N/A"}
        </p>
        <p className="text-gray-600">
          <strong>Total:</strong> ₹{order?.totalAmount?.toFixed(2) || "0.00"}
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Products in this order:
        </h3>

        {products?.length ? (
          <>
            <ul className="space-y-4">
              {paginatedProducts.map((product, idx) => {
                const productInfo = product?.productId;
                return (
                  <li
                    key={product?._id || idx}
                    className="border rounded-lg p-4 flex gap-4 bg-gray-50 shadow-sm"
                  >
                    <img
                      src={productInfo?.clodinaryImages?.[0]}
                      alt={productInfo?.name}
                      className="w-24 h-24 object-cover rounded"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                    <div className="flex flex-col justify-between">
                      <p>
                        <strong>Name:</strong>{" "}
                        {productInfo?.name || "Unknown Product"}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {product?.quantity || 0}
                      </p>
                      <p>
                        <strong>Price:</strong> ₹
                        {productInfo?.price?.toFixed(2) || "N/A"}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Pagination */}
            <div className="mt-6">
              <Pagination>
                <PaginationContent className="flex items-center gap-6">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      className={`${
                        page === 1 ? "pointer-events-none opacity-50" : ""
                      }`}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="text-sm text-gray-600">
                      Page {page} of {totalPages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={`${
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        ) : (
          <p className="text-gray-500">No products found in this order.</p>
        )}
      </div>
    </div>
  );
};

export default CustomerOrderById;
