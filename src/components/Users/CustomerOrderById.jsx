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

  if (isLoading) return <div>Loading order...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  const order = data?.data;
  const products = order?.products || [];

  // Debug log

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Order Details</h2>
      <p><strong>Status:</strong> {order?.status}</p>
      <p><strong>Total:</strong> ₹{order?.totalAmount}</p>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Products in this order:</h3>
        {products.length ? (
          <>
            <ul className="space-y-2">
              {paginatedProducts.map((product, idx) => {
                const productInfo = product.productId;
                return (
                  <li key={product._id || idx} className="border p-2 rounded">
                    <p><strong>Name:</strong> {productInfo?.name || "Unknown Product"}</p>
                    <p><strong>Quantity:</strong> {product?.quantity}</p>
                    <p><strong>Price:</strong> ₹{productInfo?.price || "N/A"}</p>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                      className={page === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="text-sm text-gray-600">
                      Page {page} of {totalPages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                      className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        ) : (
          <p>No products found in this order.</p>
        )}
      </div>
    </div>
  );
};

export default CustomerOrderById;
