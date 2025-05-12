import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  FaBars,
  FaTimes,
  FaShoppingBag,
  FaBell,
  FaUser,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';

const userNavItems = [
  { name: 'User Info', icon: FaUser, path: '/profile' },
  { name: 'Customise Order', icon: FaShoppingBag, path: '/profile/custom-order' },
  { name: 'Orders', icon: FaShoppingBag, path: '/profile/orders' },
  { name: 'Notifications', icon: FaBell, path: '/profile/notifications' },
  { name: 'Address', icon: FaMapMarkerAlt, path: '/profile/address' },
];

const UserProfileLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
const {user} = useSelector((state)=>state.auth)
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <div className="flex h-screen bg-stark-white-50 text-deep-green">
      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-pale-teal p-4 shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:block`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-dark-green">Your Profile</h2>
          <button className="md:hidden" onClick={toggleSidebar}>
            <FaTimes />
          </button>
        </div>
        <nav className="space-y-4">
          {userNavItems.map(({ name, icon: Icon, path }) => (
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
              onClick={() => setSidebarOpen(false)}
            >
              <Icon />
              <span>{name}</span>
            </NavLink>
          ))}
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
            <h1 className="text-xl font-semibold">Welcome, {user?.name}</h1>
          </div>
        </header>

        {/* Outlet for routed content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-off-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserProfileLayout;
