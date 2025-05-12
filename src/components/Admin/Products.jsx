import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from '@/components/ui/pagination';
import { debounce } from 'lodash';
import { deleteProduct, getProducts } from '@/core/requests';
import ProductFormModal from '../ProductFormModal';
import { Button } from '../ui/button';
import { FaEdit, FaTrash } from 'react-icons/fa';
import StylishLoader from '../StylishLoader';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    name: '',
    minPrice: '',
    maxPrice: '',
  });

  const [isModalOpen, setModalOpen] = useState(false);
  const [productData, setProductData] = useState(null);
  const [deleteProductData, setDeleteProductData] = useState(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);

const openDeleteModal = (product) => {
  setDeleteProductData(product);
  setShowDeleteModal(true);
};

const closeDeleteModal = () => {
  setDeleteProductData(null);
  setShowDeleteModal(false);
};

const handleDeleteProduct = async () => {
  try {
    const response = await deleteProduct(deleteProductData._id);
    if(response?.meta?.success){

      toast.success( response?.meta?.message ||"Product deleted successfully");
      closeDeleteModal();
      fetchProducts();
    }
    // Optionally refetch or update the product list
  } catch (error) {
    console.error('error deleting product',error)
    toast.error(error?.response?.data?.meta?.message || "Failed to delete product");
  }
};

  const openAddProductModal = () => {
    setProductData(null);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setProductData(product);
    setModalOpen(true);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts({ ...filters, page });
      setProducts(res.data);
      setTotalPages(res.meta.totalPages);
      setTotalProducts(res.meta.totalProducts || res.meta.totalItems || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFilterChange = useCallback(
    debounce((updated) => {
      setPage(1);
      setFilters((prev) => ({ ...prev, ...updated }));
    }, 500),
    []
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    debouncedFilterChange({ [name]: value });
  };

  useEffect(() => {
    fetchProducts();
  }, [filters, page]);

  const paginationItems = useMemo(() => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = 1, endPage = totalPages;

    if (totalPages > maxVisiblePages) {
      const maxBefore = Math.floor(maxVisiblePages / 2);
      const maxAfter = Math.ceil(maxVisiblePages / 2) - 1;

      if (page <= maxBefore) {
        endPage = maxVisiblePages;
      } else if (page + maxAfter >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
      } else {
        startPage = page - maxBefore;
        endPage = page + maxAfter;
      }
    }

    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (page > 1) setPage(page - 1);
          }}
          className={page === 1 ? 'pointer-events-none opacity-50' : ''}
        />
      </PaginationItem>
    );

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage(i);
            }}
            isActive={i === page}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    items.push(
      <PaginationItem key="next">
        <PaginationNext
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (page < totalPages) setPage(page + 1);
          }}
          className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
        />
      </PaginationItem>
    );

    return items;
  }, [page, totalPages]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">Products Management</h1>
      <Button
  onClick={openAddProductModal}
  className="flex items-center gap-2 bg-gradient-to-r from-off-white to-pale-teal hover:from-pale-teal hover:to-off-white text-dark-green font-semibold px-5 py-2 rounded-xl shadow-md transition-all duration-300 border-deep-green border-2"
>
  <Plus className="w-4 h-4" />
  Add New Product
</Button>

      <ProductFormModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        productData={productData}
        getProducts={fetchProducts}
        isEdit={!!productData}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Input name="name" placeholder="Search name..." onChange={handleInputChange} />
        <Input name="minPrice" type="number" placeholder="Min Price" onChange={handleInputChange} />
        <Input name="maxPrice" type="number" placeholder="Max Price" onChange={handleInputChange} />
      </div>

      <div className="text-sm text-gray-600">
        Total Products: {totalProducts} | Page {page} of {totalPages}
      </div>

      {loading ? (
        <StylishLoader />
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">No products found</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 bg-white">
  <Table >
    <TableHeader className="bg-pale-teal">
      <TableRow>
        <TableHead className="w-16 p-4">Image</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Category</TableHead>
        <TableHead>Price</TableHead>
        <TableHead>Stock</TableHead>
        <TableHead>Availability</TableHead>
        <TableHead className="w-12">Edit</TableHead>
        <TableHead className="w-12">Delete</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {products.map((product) => (
        <TableRow
          key={product._id}
          className="transition-colors hover:bg-blue-50/70 focus-within:bg-blue-100"
        >
          {console.log('products images',product.images[0])}
          <TableCell>
            <img
              src={`${import.meta.env.VITE_API_URL}/${product.images?.[0] || "placeholder.jpg"}`}
              alt={product?.name}
              className="h-12 w-12 object-cover rounded-md border border-gray-200 shadow-sm"
            />
          </TableCell>
          <TableCell
            onClick={() => navigate(`/admin/product/${product?._id}`)}
            className="cursor-pointer font-medium text-blue-700 hover:underline transition"
          >
            {product?.name}
          </TableCell>
          <TableCell className="text-gray-600">{product?.category}</TableCell>
          <TableCell className="font-semibold text-gray-800">₹{product?.price}</TableCell>
          <TableCell className="text-center">{product?.stockQuantity}</TableCell>
          <TableCell>
            <span
              className={`inline-block min-w-[90px] text-center px-3 py-1 rounded-full text-xs font-semibold transition ${
                product.isAvailable
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.isAvailable ? "In Stock" : "Out of Stock"}
            </span>
          </TableCell>
          <TableCell>
            <FaEdit
              onClick={() => openEditModal(product)}
              className="text-blue-500 hover:text-blue-700 cursor-pointer text-xl transition"
              title="Edit"
            />
          </TableCell>
          <TableCell>
            <FaTrash
              onClick={() => openDeleteModal(product)}
              className="text-red-500 hover:text-red-700 cursor-pointer text-xl transition"
              title="Delete"
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>

      )}

{deleteProductData && (
  <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
    <AlertDialogContent className="bg-stark-white-100 shadow-lg rounded-lg p-6">
      <AlertDialogHeader>
        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete <span className="font-semibold">{deleteProductData?.productName}</span>? This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={closeDeleteModal}>Cancel</AlertDialogCancel>
        <AlertDialogAction
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={handleDeleteProduct}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)}



      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>{paginationItems}</PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default Products;
