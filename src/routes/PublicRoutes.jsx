import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy-loaded pages
const Homepage = lazy(() => import('@/pages/Homepage'));
const Cart = lazy(() => import('@/pages/Cart'));
const ProcessOrder = lazy(() => import('@/components/Users/ProceedOrder'));
const Signup = lazy(() => import('@/components/SignUp'));
const Login = lazy(() => import('@/components/Login'));
const ContactUsForm = lazy(() => import('@/pages/ContactUsForm'));
const AboutUs = lazy(() => import('@/pages/AboutUs'));
const VerifyEmail = lazy(() => import('@/components/VerifyEmail'));
const ResendVerificationCode = lazy(() => import('@/components/ResendVerificationCode'));
const SearchPage = lazy(() => import('@/components/Search/SearchPage'));
const CustomerProductById = lazy(() => import('@/components/CustomerProductById'));
const ResetPassword = lazy(() => import('@/components/Users/ResetPassword'));
const ForgotPassword = lazy(() => import('@/components/Users/ForgotPassword'));

// User profile layout and nested routes
const UserProfileLayout = lazy(() => import('@/pages/UserProfileLayout'));
const UserInfo = lazy(() => import('@/components/Users/UserInfo'));
const UserOrders = lazy(() => import('@/components/Users/UserOrders'));
const UserCustomOrder = lazy(() => import('@/components/Users/UserCustomOrder'));
const CustomerOrderById = lazy(() => import('@/components/Users/CustomerOrderById'));
const UserNotifications = lazy(() => import('@/components/Users/UserNotifications'));
const UserAddress = lazy(() => import('@/components/Users/UserAddress'));

const PublicRoutes = () => {
  const { user } = useSelector((state) => state.auth);
  const PageSkeleton = () => (
    <div className="max-w-6xl mx-auto p-4 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-4">
        {/* <Skeleton className="h-10 w-64 bg-gray-400 rounded-md" /> */}
        {/* <Skeleton className="h-4 w-80 bg-gray-400 rounded-md" /> */}
      </div>
  
      {/* Content Grid Skeleton */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Skeleton className="h-80 bg-gray-400 rounded-lg" />
          <Skeleton className="h-6 w-full bg-gray-400 rounded-md" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-6 w-full bg-gray-400 rounded-md" />
          <Skeleton className="h-6 w-3/4 bg-gray-400 rounded-md" />
          <Skeleton className="h-40 w-full bg-gray-400 rounded-md" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 bg-gray-400 rounded-md" />
            <Skeleton className="h-10 bg-gray-400 rounded-md" />
          </div>
        </div>
      </div>
  
      {/* Additional Section Skeleton */}
      <div className="space-y-4 pt-8">
        <Skeleton className="h-6 w-48 bg-gray-400 rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 bg-gray-400 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 mb-8">
        <Navbar />
      </header>

      <main className="flex-grow pt-8 md:pt-6 lg:pt-8">
        <Suspense fallback={<div className="text-center py-10"><PageSkeleton/></div>}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route
              path="/cart"
              element={user ? <Cart /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/process-order"
              element={user ? <ProcessOrder /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/profile"
              element={user ? <UserProfileLayout /> : <Navigate to="/login" replace />}
            >
              <Route index element={<UserInfo />} />
              <Route path="orders" element={<UserOrders />} />
              <Route path="custom-order" element={<UserCustomOrder />} />
              <Route path="order/:id" element={<CustomerOrderById />} />
              <Route path="notifications" element={<UserNotifications />} />
              <Route path="address" element={<UserAddress />} />
            </Route>
            <Route path="/sign-up" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<ContactUsForm />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/resend-code" element={<ResendVerificationCode />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/product/:id" element={<CustomerProductById />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </main>

      <footer className="bg-gray-100">
        <Footer />
      </footer>
    </div>
  );
};

export default PublicRoutes;
