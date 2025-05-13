import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProductById, addProductDiscount, removeProductDiscount } from "@/core/requests";
import { useState } from "react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ProductByID = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [discountValue, setDiscountValue] = useState("");
  const [inputError, setInputError] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const addDiscountMutation = useMutation({
    mutationFn: addProductDiscount,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["product", id]);
      setDiscountValue("");
      toast.success(res?.meta?.message || 'Discount added successfully', {
        position: "bottom-right",
        duration: 4000,
      });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add discount', {
        position: "bottom-right",
      });
    }
  });

  const removeDiscountMutation = useMutation({
    mutationFn: removeProductDiscount,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["product", id]);
      toast.success(res?.meta?.message || 'Discount removed successfully', {
        position: "bottom-right",
        duration: 4000,
      });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to remove discount', {
        position: "bottom-right",
      });
    }
  });

  const handleAddDiscount = () => {
    const discount = parseInt(discountValue);
    if (isNaN(discount) ){
      setInputError("Please enter a valid number");
      return;
    }
    if (discount < 1 || discount > 100) {
      setInputError("Discount must be between 1% and 100%");
      return;
    }
    setInputError("");
    addDiscountMutation.mutate({ id, discount });
  };

  const handleRemoveDiscount = () => {
    if (!product?.discount) {
      toast("No discount to remove", { icon: "ℹ️" });
      return;
    }
    removeDiscountMutation.mutate({ id });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48 mb-6 bg-gray-400" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-lg bg-gray-700" />
            <div className="grid grid-cols-3 gap-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg bg-gray-900" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="m-6">
        {/* <ExclamationTriangleIcon className="h-4 w-4" /> */}
        <AlertTitle>Error loading product</AlertTitle>
        <AlertDescription>
          {error?.message || "Failed to load product data. Please try again later."}
        </AlertDescription>
      </Alert>
    );
  }

  const product = data?.data;
  const images = product?.images || [product?.image].filter(Boolean);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">{product?.name}</h1>
        <Badge variant={product?.stockQuantity > 0 ? "default" : "destructive"}>
          {product?.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="rounded-lg border overflow-hidden">
            <img
              src={`${import.meta.env.VITE_API_URL}/${images[0]}`}
              alt="Main product"
              className="w-full h-80 object-contain bg-gray-50"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-3 gap-2">
              {images.slice(1).map((img, index) => (
                <img
                  key={index}
                  src={`${import.meta.env.VITE_API_URL}/${img}`}
                  alt={`Product ${index + 2}`}
                  className="w-full h-24 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Price:</span>
                <div className="flex items-center gap-2">
                  {product.discount ? (
                    <>
                      <span className="text-lg font-bold text-primary">
                      ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                      </span>
                      <span className="text-sm line-through text-gray-500">
                      ₹{product?.price}
                      </span>
                      <Badge variant="secondary" className="ml-2">
                        {product?.discount}% OFF
                      </Badge>
                    </>
                  ) : (
                    <span className="text-lg font-bold">${product?.price}</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Category:</span>
                <span className="capitalize">{product.category}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Stock Quantity:</span>
                <span>{product?.stockQuantity}</span>
              </div>

              {product?.discount ? (
                <Alert className="bg-green-50">
                  {/* <CheckCircledIcon className="h-4 w-4 text-green-600" /> */}
                  <AlertDescription>
                    This product has a {product?.discount}% discount applied.
                  </AlertDescription>
                </Alert>
              ) : ''}

              <div>
                <h3 className="font-semibold mb-2">Description:</h3>
                <p className="text-gray-700">{product?.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Discount Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Manage Discount</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    placeholder="Enter discount %"
                    value={discountValue}
                    onChange={(e) => {
                      setDiscountValue(e.target.value);
                      setInputError("");
                    }}
                    min={1}
                    max={100}
                    className="max-w-[150px]"
                  />
                  <Button
                  className='bg-deep-green text-white'
                    onClick={handleAddDiscount}
                    disabled={addDiscountMutation.isPending || !discountValue}
                  >
                    {addDiscountMutation.isPending ? "Applying..." : "Apply"}
                  </Button>
                </div>
                {inputError && (
                  <p className="text-sm text-red-500 mt-1">{inputError}</p>
                )}
              </div>

              <Button
                variant="outline" className='mb-4 bg-red-600 text-white'
                onClick={handleRemoveDiscount}
                disabled={removeDiscountMutation.isPending || !product.discount}
              >
                {removeDiscountMutation.isPending 
                  ? "Removing..." 
                  : "Remove Discount"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductByID;