import React, { useEffect, useState, useCallback } from 'react';
import { getAllOrdersForAdmin } from '@/core/requests';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from '@/components/ui/pagination';
import { debounce } from 'lodash';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '../ui/skeleton';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [filters, setFilters] = useState({
    paymentMethod: '',
    status: '',
    dateSort: '',
    search: ''
  });

  const navigate = useNavigate();
  // Define options for dropdowns
  const paymentMethods = [
    { value: 'all', label: 'All Payment Methods' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'cash_on_delivery', label: 'Cash on Delivery' },
    { value: 'razorpay', label: 'Razorpay' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateSortOptions = [
    { value: 'default', label: 'Sort by Date' },
    { value: 'latest', label: 'Latest First' },
    { value: 'oldest', label: 'Oldest First' }
  ];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrdersForAdmin({ 
        ...filters, 
        page,
        limit: 10
      });
      setOrders(res.data);
      setTotalPages(res.meta.totalPages);
      setTotalOrders(res.meta.totalOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    debouncedFilterChange({ [name]: value });
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    debouncedFilterChange({ search: value });
  };

  useEffect(() => {
    fetchOrders();
  }, [filters, page]);

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
      const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;
      
      if (page <= maxPagesBeforeCurrent) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (page + maxPagesAfterCurrent >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = page - maxPagesBeforeCurrent;
        endPage = page + maxPagesAfterCurrent;
      }
    }

    // Previous button
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

    // Page numbers
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

    // Next button
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
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Orders Management</h1>
      
      {/* Search and Filters */}
      <div className="space-y-4">
  <Input 
    name="search"
    placeholder="Search by customer name, email or order ID"
    onChange={handleSearch}
    className="max-w-lg bg-mint-cream text-deep-green"
  />

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <Select name="paymentMethod" onValueChange={(value) => handleFilterChange({ target: { name: 'paymentMethod', value } })}>
      <SelectTrigger className="bg-mint-cream text-deep-green">
        <SelectValue placeholder="Payment Method" />
      </SelectTrigger>
      <SelectContent className='bg-white'>
        {paymentMethods.map((method) => (
          <SelectItem key={method?.value} value={method?.value}>
            {method?.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Select name="status" onValueChange={(value) => handleFilterChange({ target: { name: 'status', value } })}>
      <SelectTrigger className="bg-mint-cream text-deep-green">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent className='bg-white'>
        {statusOptions.map((status) => (
          <SelectItem key={status?.value} value={status?.value}>
            {status?.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Select name="dateSort" onValueChange={(value) => handleFilterChange({ target: { name: 'dateSort', value } })}>
      <SelectTrigger className="bg-mint-cream text-deep-green">
        <SelectValue placeholder="Sort By Date" />
      </SelectTrigger>
      <SelectContent className='bg-white'>
        {dateSortOptions.map((option) => (
          <SelectItem key={option?.value} value={option?.value}>
            {option?.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
</div>

<div className="text-sm text-deep-green">
  Total Orders: {totalOrders} | Showing page {page} of {totalPages}
</div>

<div className="overflow-x-auto rounded-lg border border-stark-white-200 shadow">
    <Table>
      <TableHeader className="bg-pale-teal text-deep-green">
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          [...Array(5)].map((_, index) => (
            <TableRow key={`skeleton-${index}`} className="hover:bg-stark-white-50 transition">
              <TableCell><Skeleton className="h-4 w-32 bg-gray-400" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24 bg-gray-400" /></TableCell>
              <TableCell><Skeleton className="h-4 w-32 bg-gray-400" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20 bg-gray-400" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24 bg-gray-400" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24 bg-gray-400" /></TableCell>
            </TableRow>
          ))
        ) : orders?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-stark-white-500">
              No orders found
            </TableCell>
          </TableRow>
        ) : (
          orders?.map((order) => (
            <TableRow key={order._id} className="hover:bg-stark-white-50 transition">
              <TableCell onClick={()=>navigate(`/admin/order/${order._id}`)} className="cursor-pointer">
                {order._id}
              </TableCell>
              <TableCell>{order?.userId?.name || '-'}</TableCell>
              <TableCell>{order?.userId?.email || '-'}</TableCell>
              <TableCell className={
                order?.status === 'delivered'
                  ? 'text-green-600'
                  : order?.status === 'cancelled'
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }>
                {order?.status}
              </TableCell>
              <TableCell className="capitalize">
                {order?.paymentMethod?.replace(/_/g, ' ') || '-'}
              </TableCell>
              <TableCell>
                {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </div>

      {/* ShadCN Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            {renderPaginationItems()}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default Orders;