import React, { useEffect, useState, useCallback } from 'react';
import { downdOrderReceipt, getOrdersForCustomers } from '@/core/requests';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useNavigate } from 'react-router-dom';
import DownloadLoader from '../DownloadLoader';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
const navigate = useNavigate();



  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrdersForCustomers({ query: { page, limit: 10 } });

      setOrders(res.data);
      setTotalPages(res.meta.totalPages);
      setTotalOrders(res.meta.totalOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchOrders();
  }, [ page]);

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const simulateProgress = () => {
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
    return interval;
  };

  const handleDownload = async (orderId) => {
    setIsDownloading(true);
    const progressInterval = simulateProgress();

    try {
      const response = await downdOrderReceipt(orderId);
      
      // Create blob from arraybuffer
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt_${orderId}.pdf`;
      
      // Append to body and trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        clearInterval(progressInterval);
        setIsDownloading(false);
      }, 100);
      
    } catch (error) {
      console.error('Download failed:', error);
      clearInterval(progressInterval);
      setIsDownloading(false);
      alert('Failed to download receipt. Please try again.');
    }
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = 1;
    let endPage = Math.min(maxVisiblePages, totalPages);

    if (totalPages > maxVisiblePages) {
      const half = Math.floor(maxVisiblePages / 2);
      startPage = Math.max(1, page - half);
      endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    // Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious 
          onClick={(e) => {
            e.preventDefault();
            if (page > 1) setPage(page - 1);
          }}
          className={`cursor-pointer ${page === 1 ? 'pointer-events-none opacity-50' : ''}`}
          />
      </PaginationItem>
    );

    // First page
    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={(e) => {
              e.preventDefault();
              setPage(1);
            }}
            isActive={1 === page}
            className="cursor-pointer"

          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <span className="px-4">...</span>
          </PaginationItem>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
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

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <span className="px-4">...</span>
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={(e) => {
              e.preventDefault();
              setPage(totalPages);
            }}
            className="cursor-pointer"
            isActive={totalPages === page}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext
          onClick={(e) => {
            e.preventDefault();
            if (page < totalPages) setPage(page + 1);
          }}
          className={`cursor-pointer ${page === totalPages ? 'pointer-events-none opacity-50' : ''}`}
          />
      </PaginationItem>
    );

    return items;
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Orders Management</h1>
      
      {/* Search and Filters */}
      {isDownloading && (
        <DownloadLoader 
        isVisible={isDownloading} 
        progress={downloadProgress} 
      />      )}
      <div className="text-sm text-deep-green">
        Total Orders: {totalOrders} | Showing page {page} of {totalPages}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-green"></div>
        </div>
      ) : orders?.length === 0 ? (
        <div className="text-center py-12 text-stark-white-500">
          No orders found matching your criteria
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-stark-white-200 shadow">
          <Table>
            <TableHeader className="bg-pale-teal text-deep-green">
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Download Receipts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order._id} className="hover:bg-stark-white-50 transition">
                  <TableCell onClick={()=>navigate(`/profile/order/${order?._id}`)} className="cursor-pointer font-medium">{order._id}</TableCell>
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
                    {order?.paymentMethod?.replace(/_/g, ' ')}
                  </TableCell>
                  <TableCell>
                    {new Date(order?.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className='cursor-pointer' onClick={()=>handleDownload(order._id)}>
                    Download here
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}


      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              {renderPaginationItems()}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default Orders;