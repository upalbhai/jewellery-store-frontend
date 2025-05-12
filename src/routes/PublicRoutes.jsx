import { ContactUsForm } from '@/pages/ContactUsForm';
import CustomerProductById from '@/components/CustomerProductById';
import Footer from '@/components/Footer';
import Login from '@/components/Login';
import Navbar from '@/components/Navbar';
import ResendVerificationCode from '@/components/ResendVerificationCode';
import SearchPage from '@/components/Search/SearchPage';
import Signup from '@/components/SignUp';
import CustomerOrderById from '@/components/Users/CustomerOrderById';
import ForgotPassword from '@/components/Users/ForgotPassword';
import ResetPassword from '@/components/Users/ResetPassword';
import UserAddress from '@/components/Users/UserAddress';
import UserCustomOrder from '@/components/Users/UserCustomOrder';
import UserInfo from '@/components/Users/UserInfo';
import UserNotifications from '@/components/Users/UserNotifications';
import UserOrders from '@/components/Users/UserOrders';
import VerifyEmail from '@/components/VerifyEmail';
import Cart from '@/pages/Cart';
import Homepage from '@/pages/Homepage';
import UserProfileLayout from '@/pages/UserProfileLayout';
import Profile from '@/pages/UserProfileLayout';
import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import AboutUs from '@/pages/AboutUs';
import ProcessOrder from '@/components/Users/ProceedOrder';

const PublicRoutes = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar at the top */}
      <header className="sticky top-0 z-50 mb-8">
        <Navbar />
      </header>

      {/* Main content area with proper spacing */}
      <main className="flex-grow pt-8 md:pt-6 lg:pt-8">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route
            path="/cart"
            element={user ? <Cart /> : <Navigate to="/login" replace />} // ✅ protected route
          />
          <Route
            path="/process-order"
            element={user ? <ProcessOrder /> : <Navigate to="/login" replace />} // ✅ protected route
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
      </main>

      {/* Footer can be added here if needed */}
      <footer className="bg-gray-100 "><Footer /></footer>
    </div>
  )
}

export default PublicRoutes
