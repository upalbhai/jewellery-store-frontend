import { useEffect, useState } from 'react';
import { getAllOrders } from '@/core/requests';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CustomOrders = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getAllOrders({ page, limit: 5, search: query });
      setOrders(response.data || []);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, query]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  return (
    <div className="container mx-auto py-8 max-w-6xl bg-off-white">
      <Card className="border border-stark-white-300 shadow-sm">
        <CardHeader className="bg-mint-cream">
          <CardTitle className="text-2xl font-bold text-center text-deep-green">
            Custom Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              placeholder="Search orders..."
              value={query}
              onChange={handleSearch}
              className="w-full border border-light-teal focus:ring-2 focus:ring-teal-green"
            />
          </div>

          <div className="rounded-md border border-stark-white-200">
            <Table>
              <TableHeader className="bg-stark-white-100">
                <TableRow>
                  <TableHead className="font-bold text-forest-green">Order ID</TableHead>
                  <TableHead className="font-bold text-forest-green">User</TableHead>
                  <TableHead className="font-bold text-forest-green">Message</TableHead>
                  <TableHead className="font-bold text-forest-green">Images</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full my-2" />
                      ))}
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-deep-green">
                      No custom orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow
                      key={order._id}
                      className="cursor-pointer hover:bg-stark-white-100 transition"
                      onClick={() => navigate(`/admin/custom-order/${order._id}`)}
                    >
                      <TableCell className="font-medium">{order._id}</TableCell>
                      <TableCell>{order?.userId?.name || "Unknown"}</TableCell>
                      <TableCell className="max-w-xs truncate">{order.message}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {order.images?.map((img, index) => (
                            <img
                              key={index}
                              src={`${import.meta.env.VITE_API_URL}/${img}`}
                              alt="Custom order"
                              className="w-12 h-12 rounded object-cover border border-light-teal"
                            />
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="bg-teal-green text-white hover:bg-slate-green disabled:bg-gray-300"
            >
              Previous
            </Button>
            <span className="text-sm text-deep-green">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="bg-teal-green text-white hover:bg-slate-green disabled:bg-gray-300"
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomOrders;
