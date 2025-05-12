import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiGrid, FiHome, FiInfo, FiLogIn, FiLogOut, FiMenu, FiPhone, FiSearch, FiShoppingCart, FiUser, FiX } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { Button } from "@/components/ui/button";
import LogoutButton from './Logout';
import NotificationBell from './NotificationBell';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
// import { FiUser } from "react-icons/fi"
const Navbar = () => {
  const { user, cart } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-off-white text-deep-green shadow-sm fixed w-full z-50 border-b border-stark-white-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-deep-green hover:text-stark-white-600 transition-colors"
        >
          Madhusudhan Ratnam
        </Link>

        {/* Desktop Menu */}
        

{/* Inside your JSX */}
<div className="hidden md:flex items-center gap-8">
  <div className="flex items-center gap-6">
    <Link
      to="/"
      className="text-stark-white-700 hover:text-stark-white-500 transition-colors font-medium"
    >
      Home
    </Link>
    <Link
      to="/search"
      className="text-stark-white-700 hover:text-stark-white-500 transition-colors font-medium"
    >
      Explore
    </Link>
    <Link
      to="/about"
      className="text-stark-white-700 hover:text-stark-white-500 transition-colors font-medium"
    >
      About
    </Link>
    <Link
      to="/contact"
      className="text-stark-white-700 hover:text-stark-white-500 transition-colors font-medium"
    >
      Contact
    </Link>

    {user && (
      <>
        <Link
          to="/cart"
          className="relative text-stark-white-700 hover:text-stark-white-500 transition-colors"
        >
          <FiShoppingCart className="text-xl" />
          {cart?.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Link>

        <NotificationBell />

        {/* Profile Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="text-stark-white-700 hover:text-stark-white-500 transition-colors font-medium flex items-center gap-1">
              <FiUser className="text-lg" />
              Profile
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 bg-white rounded shadow p-2 space-y-2">
            <Link
              to="/profile"
              className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded"
            >
              View Profile
            </Link>
            {user.role === "admin" && (
              <Link
                to="/admin"
                className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded"
              >
                Admin Dashboard
              </Link>
            )}
          </PopoverContent>
        </Popover>
      </>
    )}
  </div>

  {/* Login / Logout */}
  {user ? (
    <LogoutButton />
  ) : (
    <Button
      variant="outline"
      onClick={() => navigate('/login')}
      className="border-stark-white-300 text-stark-white-700 hover:bg-stark-white-100 hover:text-stark-white-800 flex items-center gap-2 px-4 py-2"
    >
      <FiLogIn className="text-lg" />
      Login
    </Button>
  )}
</div>


        {/* Mobile Hamburger Icon */}
        <div className="md:hidden">
          <button
            onClick={handleToggleMenu}
            className="p-2 rounded-md hover:bg-stark-white-100 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <FiX className="text-2xl text-stark-white-800" />
            ) : (
              <FiMenu className="text-2xl text-stark-white-800" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
  <div className="md:hidden bg-stark-white-50 px-6 pt-4 pb-6 space-y-5 border-t border-stark-white-200">
    {/* Navigation Links */}
    <Link
      to="/"
      className="flex items-center gap-2 text-stark-white-700 hover:text-stark-white-500 transition-colors font-medium py-2"
      onClick={handleToggleMenu}
    >
      <FiHome /> Home
    </Link>
    <Link
      to="/search"
      className="flex items-center gap-2 text-stark-white-700 hover:text-stark-white-500 transition-colors font-medium py-2"
      onClick={handleToggleMenu}
    >
      <FiSearch /> Explore
    </Link>
    <Link
      to="/about"
      className="flex items-center gap-2 text-stark-white-700 hover:text-stark-white-500 transition-colors font-medium py-2"
      onClick={handleToggleMenu}
    >
      <FiInfo /> About
    </Link>
    <Link
      to="/contact"
      className="flex items-center gap-2 text-stark-white-700 hover:text-stark-white-500 transition-colors font-medium py-2"
      onClick={handleToggleMenu}
    >
      <FiPhone /> Contact
    </Link>

    {/* User-specific menu */}
    {user && (
      <>
        <div
          className="relative flex items-center gap-2 text-stark-white-700 cursor-pointer hover:text-stark-white-500 transition-colors py-2"
          onClick={() => {
            navigate('/cart');
            handleToggleMenu();
          }}
        >
          <FiShoppingCart className="text-xl" />
          Cart
          {cart?.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart?.length}
            </span>
          )}
        </div>

        <div className="py-2">
          <NotificationBell />
        </div>

        <p
          className="flex items-center gap-2 text-stark-white-700 hover:text-stark-white-500 transition-colors cursor-pointer py-2"
          onClick={() => {
            navigate('/profile');
            handleToggleMenu();
          }}
        >
          <FiUser /> Profile
        </p>

        {user?.role === 'admin' && (
          <p
            className="flex items-center gap-2 text-stark-white-700 hover:text-stark-white-500 transition-colors cursor-pointer py-2"
            onClick={() => {
              navigate('/admin');
              handleToggleMenu();
            }}
          >
            <FiGrid /> Admin
          </p>
        )}
      </>
    )}

    {/* Mobile Login/Logout */}
    <div className="pt-4">
      {user ? (
        <LogoutButton className="w-full" />
      ) : (
        <Button
          variant="outline"
          onClick={() => {
            navigate('/login');
            handleToggleMenu();
          }}
          className="w-full border-stark-white-300 text-stark-white-700 hover:bg-stark-white-100 flex items-center justify-center gap-2 py-2"
        >
          <FiLogIn className="text-lg" />
          Login
        </Button>
      )}
    </div>
  </div>
)}
    </nav>
  );
};

export default Navbar;