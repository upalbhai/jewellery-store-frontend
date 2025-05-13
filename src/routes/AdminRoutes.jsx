import AdminSkeleton from '@/components/AdminSkeleton';
import React, { Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';

// Lazy-loaded components
const Admin = lazy(() => import('@/pages/Admin'));
const Dashboard = lazy(() => import('@/components/Admin/Dashboard'));
const Products = lazy(() => import('@/components/Admin/Products'));
const Orders = lazy(() => import('@/components/Admin/Orders'));
const Customers = lazy(() => import('@/components/Admin/Customers'));
const CustomerById = lazy(() => import('@/components/Admin/CustomerById'));
const ProductByID = lazy(() => import('@/components/Admin/ProductByID'));
const CustomOrders = lazy(() => import('@/components/Admin/CustomOrders'));
const CustomOrderById = lazy(() => import('@/components/Admin/CustomOrderById'));
const OrderById = lazy(() => import('@/components/Admin/OrderById'));

const AdminRoutes = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Routes>
        <Route path="/" element={<Admin />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customer/:id" element={<CustomerById />} />
          <Route path="product/:id" element={<ProductByID />} />
          <Route path="orders" element={<Orders />} />
          <Route path="custom-orders" element={<CustomOrders />} />
          <Route path="custom-order/:id" element={<CustomOrderById />} />
          <Route path="order/:id" element={<OrderById />} />
          <Route path="*" element={<Navigate to="/admin" />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
