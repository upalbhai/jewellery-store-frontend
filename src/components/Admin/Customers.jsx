import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { fetchUsers } from "@/core/requests";
import { useNavigate } from "react-router-dom";

const Customers = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const limit = 10;
  const navigate = useNavigate();
  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", debouncedSearch, sortBy, order, page],
    queryFn: () =>
      fetchUsers({
        search: debouncedSearch,
        sortBy,
        order,
        page,
        limit,
      }),
    keepPreviousData: true,
  });

  const users = data?.data || [];
  const meta = data?.meta || {};

  return (
    <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Customers Management</h1>
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Search by name, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm bg-mint-cream"
        />

        <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
          <SelectTrigger className="w-[160px] bg-mint-cream">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className='bg-white'>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="phoneNumber">Phone</SelectItem>
            <SelectItem value="isPremium">Premium</SelectItem>
            <SelectItem value="createdAt">Created At</SelectItem>
          </SelectContent>
        </Select>

        <Select className='' value={order} onValueChange={(val) => setOrder(val)}>
          <SelectTrigger className="w-[120px] bg-mint-cream">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent className='bg-white'>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div className="text-red-500">Failed to load users</div>
      ) : (
        <div className="overflow-auto border-2 border-deep-green bg-oof-white  rounded-lg">
          <Table>
    <TableHeader className="bg-pale-teal">
      <TableRow>
        <TableHead className="font-semibold text-gray-700">Name</TableHead>
        <TableHead className="font-semibold text-gray-700">Email</TableHead>
        <TableHead className="font-semibold text-gray-700">Phone</TableHead>
        <TableHead className="font-semibold text-gray-700">Premium</TableHead>
        <TableHead className="font-semibold text-gray-700">Created At</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {users.map((user) => (
        <TableRow
          key={user._id}
          className="transition-colors hover:bg-blue-50/70 focus-within:bg-blue-100"
        >
          <TableCell
            onClick={() => navigate(`/admin/customer/${user?._id}`, { state: { user } })}
            className="cursor-pointer font-medium text-forest-green hover:underline transition"
          >
            {user.name}
          </TableCell>
          <TableCell className="text-gray-600">{user.email}</TableCell>
          <TableCell className="text-gray-600">{user.phoneNumber}</TableCell>
          <TableCell>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                user.isPremium
                  ? "bg-deep-green text-stark-white-50"
                  : "bg-stark-white-100 border-2 border-deep-green text-gray-500"
              }`}
            >
              {user.isPremium ? "Yes" : "No"}
            </span>
          </TableCell>
          <TableCell className="text-gray-500">
            {new Date(user?.createdAt).toLocaleDateString()}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>

        </div>
      )}
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: meta.totalPages || 1 }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={page === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(i + 1);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < meta.totalPages) setPage(page + 1);
                  }}
                  className={
                    page === meta.totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
    </div>
  );
};

export default Customers;
