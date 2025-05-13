// src/components/Skeletons/AdminSkeleton.jsx
const AdminSkeleton = () => {
    return (
      <div className="flex h-screen bg-stark-white-50 text-deep-green">
        {/* Sidebar skeleton */}
        <aside className="w-64 bg-gray-300 p-4 shadow-lg hidden md:block animate-pulse">
          <div className="h-8 bg-gray-400 rounded mb-6"></div>
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-6 bg-gray-400 rounded w-3/4"></div>
            ))}
          </div>
        </aside>
  
        {/* Main content skeleton */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navbar */}
          <header className="bg-mint-cream shadow px-6 py-4 flex justify-between items-center animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-1/3"></div>
            <div className="h-6 bg-gray-300 rounded w-20"></div>
          </header>
  
          {/* Content area */}
          <main className="flex-1 overflow-y-auto p-6 bg-off-white animate-pulse">
            <div className="space-y-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-5 bg-gray-300 rounded w-full"></div>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  };
  
  export default AdminSkeleton;
  