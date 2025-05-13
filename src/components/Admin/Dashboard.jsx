import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { BarChart } from "./Charts/BarChart";
import { PieChart } from "./Charts/PieChart";
import api from "@/core/api";
import { BASE_URL, DASHBOARD } from "@/core/consts";
import { ScrollArea } from "../ui/scroll-area";

const Dashboard = () => {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [date, setDate] = useState(new Date());

  const fetchStats = async (month, year) => {
    try {
      setLoading(true);
      console.log('month',year)
      const response = await api.get(`${BASE_URL}${DASHBOARD.DASHBOARD_STATS}`, {
        params: month || year ? { month: month === 'all' ? '' : month, year:year === 'all' ? '' :year } : {},
        withCredentials: true,
      });
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(month, year);
  }, [month, year]);

  // Memoized chart data for better performance
  const topProductsChartData = useMemo(() => {
    if (!stats?.topSellingProducts) return [];
    return stats.topSellingProducts.map(item => ({
      name: item.name,
      value: item.totalQuantity,
    }));
  }, [stats]);

  const topCategoriesChartData = useMemo(() => {
    if (!stats?.topSellingCategories) return [];
    return stats.topSellingCategories.map(item => ({
      name: item._id,
      value: item.totalQuantity,
    }));
  }, [stats]);

  const costlyOrdersChartData = useMemo(() => {
    if (!stats?.topCostlyOrders) return [];
    return stats.topCostlyOrders.map(order => ({
      name: order.userId.name,
      value: order.totalAmount,
    }));
  }, [stats]);

  const getFilterDisplayText = () => {
    if (!year) return "All time (compared to previous year)";
    if (month === 'all' || !month) return `Year ${year} (compared to ${parseInt(year)-1})`;
    
    const monthName = new Date(2000, parseInt(month) - 1, 1).toLocaleString('default', { month: 'long' });
    const prevMonth = new Date(2000, parseInt(month) - 2, 1).toLocaleString('default', { month: 'long' });
    return `${monthName} ${year} (compared to ${prevMonth})`;
  };

  return (
    <div className="min-h-screen bg-off-white p-6">
      <div className="mb-8">
  <h1 className="text-3xl font-bold text-deep-green">Jewelry Store Dashboard</h1>
  <p className="text-slate-green">
    {getFilterDisplayText()} Performance Overview
  </p>
  <p className="text-xs text-gray-500 mt-1">
    Trends show comparison with previous period
  </p>
</div>

      {/* Date Filters */}
      <div className="flex gap-4 mb-8">
        <Select 
          onValueChange={(value) => setYear(value)} 
          value={year}
        >
          <SelectTrigger className="w-[180px] bg-mint-cream border-light-teal">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent className='bg-off-white'>
            <SelectItem value="all">All Years</SelectItem>
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)?.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          onValueChange={(value) => setMonth(value)} 
          value={month} 
          disabled={!year}
        >
          <SelectTrigger className="w-[180px] bg-mint-cream border-light-teal">
            <SelectValue placeholder={year ? "Select Month" : "Select Year First"} />
          </SelectTrigger>
          <SelectContent className='bg-off-white'>
            <SelectItem value="all">All Months</SelectItem>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <SelectItem key={month} value={String(month)}>
                {new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  <SummaryCard 
    title="Total Revenue" 
    value={stats?.totalRevenue} 
    loading={loading}
    icon="💰"
    trend={stats?.comparison?.totalRevenue?.trend || 'neutral'}
    comparison={stats?.comparison?.totalRevenue}
    format={(val) => `₹${(val || 0).toLocaleString()}`}
  />
  
  <SummaryCard 
    title="Total Sales" 
    value={stats?.totalSales} 
    loading={loading}
    icon="🛒"
    trend={stats?.comparison?.totalSales?.trend || 'neutral'}
    comparison={stats?.comparison?.totalSales}
    format={(val) => (val || 0).toLocaleString()}
  />
  
  <SummaryCard 
    title="Avg. Order Value" 
    value={stats?.avgPricePerOrder} 
    loading={loading}
    icon="📊"
    trend={stats?.comparison?.avgPricePerOrder?.trend || 'neutral'}
    comparison={stats?.comparison?.avgPricePerOrder}
    format={(val) => `₹${Math.round(val || 0).toLocaleString()}`}
  />
  
  <SummaryCard 
    title="New Customers" 
    value={stats?.totalUsers} 
    loading={loading}
    icon="👥"
    trend={stats?.comparison?.totalUsers?.trend || 'neutral'}
    comparison={stats?.comparison?.totalUsers}
    format={(val) => (val || 0).toLocaleString()}
  />
</div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Selling Products */}
        <Card className="border-light-teal">
          <CardHeader>
            <CardTitle className="text-deep-green">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="bg-slate-300 h-[300px] w-full" />
            ) : (
              <BarChart
                data={topProductsChartData}
                colors={['#3a6567']}
                xAxisLabel="Products"
                yAxisLabel="Quantity Sold"
                height={400}
              />
            )}
          </CardContent>
        </Card>

        {/* Top Selling Categories */}
        <Card className="border-light-teal">
          <CardHeader>
            <CardTitle className="text-deep-green">Top Selling Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="bg-slate-300 h-[300px] w-full" />
            ) : (
              <PieChart
                data={topCategoriesChartData}
                colors={[
                  '#3a6567',
                  '#4b8081',
                  '#659c9c',
                  '#8dbbba',
                  '#b8d7d5',
                ]}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Costly Orders */}
        <Card className="border-light-teal">
          <CardHeader>
            <CardTitle className="text-deep-green">Top Costly Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="bg-slate-300 h-[300px] w-full" />
            ) : (
              <div className="space-y-4">
                {stats?.topCostlyOrders?.map((order, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-mint-cream rounded-lg">
                    <div>
                      <p className="font-medium text-deep-green">{order?.userId?.name}</p>
                      <p className="text-sm text-slate-green">
                        {order.products.map(p => p?.productId?.name).join(', ')}
                      </p>
                    </div>
                    <span className="font-bold text-teal-green">
                      ₹{order?.totalAmount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Custom Orders */}
        <Card className="border-light-teal">
  <CardHeader>
    <CardTitle className="text-deep-green">Latest Custom Orders</CardTitle>
  </CardHeader>
  <CardContent>
    {loading ? (
      <Skeleton className="bg-slate-300 h-[300px] w-full" />
    ) : (
      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {stats?.latestCustomOrders?.map((order, index) => (
            <div key={index} className="flex items-start gap-4 p-3 bg-mint-cream rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-deep-green">{order?.userId?.name || 'Guest'}</p>
                <p className="text-sm text-slate-green line-clamp-2">
                  {order.message}
                </p>
                <p className="text-xs text-slate-green mt-1">
                  {order.createdAt && format(new Date(order.createdAt), "MMM dd, yyyy h:mm a")}
                </p>
              </div>
              <div className="flex gap-2">
                {order.images?.slice(0, 1).map((img, i) => (
                  <img 
                    key={i}
                    src={`${import.meta.env.VITE_API_URL}/${img}`} 
                    alt="Custom order" 
                    className="h-12 w-12 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          ))}
          {stats?.latestCustomOrders?.length === 0 && (
            <p className="text-center text-slate-green py-8">No custom orders found</p>
          )}
        </div>
      </ScrollArea>
    )}
    <div className="">
                <div className="text-3xl mt-4 text-teal-green">{stats?.totalCustomOrders || 0}</div>
                <p className="text-slate-green">Custom jewelry requests</p>
              </div>
  </CardContent>
</Card>
      </div>
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ 
  title, 
  value, 
  loading, 
  icon, 
  trend, 
  format = (val) => val, 
  comparison 
}) => {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-500',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→',
  };

  const getPercentageChange = () => {
    if (!comparison || comparison.previous === 0) return 'N/A';
    const change = ((comparison.current - comparison.previous) / comparison.previous) * 100;
    return `${Math.abs(Math.round(change))}%`;
  };

  const getTrendText = () => {
    if (!comparison) return 'No comparison data';
    
    const percentage = getPercentageChange();
    if (trend === 'up') return `↑ ${percentage} higher than last period`;
    if (trend === 'down') return `↓ ${percentage} lower than last period`;
    return `→ No change from last period`;
  };

  return (
    <Card className="border-sea-green bg-sky-100 border-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-deep-green">
          {title}
        </CardTitle>
        <span className="text-2xl">{icon}</span>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="bg-slate-300 h-8 w-3/4" />
        ) : (
          <>
            <div className="text-2xl font-bold text-deep-green">
              {format(value || 0)}
            </div>
            <div className={`text-xs ${trendColors[trend]}`}>
              {getTrendText()}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Dashboard;