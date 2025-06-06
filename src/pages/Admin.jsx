import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  FaBars,
  FaTimes,
  FaGem,
  FaBoxOpen,
  FaUsers,
  FaStar,
  FaCog,
  FaHome,
  FaTags,
} from 'react-icons/fa';
import { IoMdSettings } from "react-icons/io";

import LogoutButton from '@/components/Logout';

const navItems = [
  { name: 'Dashboard', icon: FaHome, path: '/admin' },
  { name: 'Products', icon: FaBoxOpen, path: '/admin/products' },
  // { name: 'Categories', icon: FaTags, path: '/admin/categories' },
  { name: 'Orders', icon: FaGem, path: '/admin/orders' },
  { name: 'Custom Orders', icon: FaGem, path: '/admin/custom-orders' },
  { name: 'Customers', icon: FaUsers, path: '/admin/customers' },
  { name: 'Settings', icon: IoMdSettings, path: '/admin/settings' },
  // { name: 'Reviews', icon: FaStar, path: '/admin/reviews' },
  // { name: 'Settings', icon: FaCog, path: '/admin/settings' },
];


const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
const navigate = useNavigate();
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-stark-white-50 text-deep-green">
      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-pale-teal p-4 shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:block`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-dark-green">Jewellery Admin</h2>
          <button className="md:hidden" onClick={toggleSidebar}>
            <FaTimes />
          </button>
        </div>
        <nav className="space-y-4">
          {navItems.map(({ name, icon: Icon, path }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive
                    ? 'bg-forest-green text-white'
                    : 'hover:bg-grayish-teal text-deep-green'
                }`
              }
              onClick={() => setSidebarOpen(false)} // Close on mobile nav click
            >
              <Icon />
              <span>{name}</span>
            </NavLink>
          ))}
          {/* <LogoutButton /> */}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-mint-cream shadow px-4 py-4 flex justify-between items-center md:px-6">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-xl" onClick={toggleSidebar}>
              <FaBars />
            </button>
            <h1 onClick={()=>navigate('/')} className="text-xl font-semibold cursor-pointer">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <LogoutButton/>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-off-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Admin;
