import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  DollarSignIcon,
  UsersIcon,
  PackageIcon,
  AlertTriangleIcon,
  TrendingUpIcon,
  ChevronDownIcon,
  Loader2Icon,
} from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import OrdersTable from '../components/dashboard/OrdersTable';
import TopSellingChart from '../components/dashboard/TopSellingChart';
import RestockAlert from '../components/RestockAlert';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    totalMedicines: 0,
    totalSuppliers: 0,
    totalSales: 0,
    lowStockCount: 0,
    todaySales: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  useEffect(() => {
    const fetchMetrics = async () => {
      // Check if cache is still valid
      if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [medicinesRes, suppliersRes, salesRes, todaySalesRes] = await Promise.all([
          axios.get('http://localhost:5001/api/medicines'),
          axios.get('http://localhost:5001/api/suppliers'),
          axios.get('http://localhost:5001/api/sales'),
          axios.get('http://localhost:5001/api/sales/today')
        ]);

        const medicines = medicinesRes.data;
        const suppliers = suppliersRes.data;
        const allSales = salesRes.data;
        const todaySales = todaySalesRes.data;

        // Calculate metrics
        const totalSalesAmount = allSales.reduce((total, sale) => {
          return total + sale.medicines.reduce((saleTotal, med) => saleTotal + med.totalprice, 0);
        }, 0);

        const todaySalesAmount = todaySales.reduce((total, sale) => {
          return total + sale.medicines.reduce((saleTotal, med) => saleTotal + med.totalprice, 0);
        }, 0);

        const lowStockItems = medicines.filter(med => med.quantity < 10);

        setMetrics({
          totalMedicines: medicines.length,
          totalSuppliers: suppliers.length,
          totalSales: totalSalesAmount,
          lowStockCount: lowStockItems.length,
          todaySales: todaySalesAmount
        });

        setLastFetched(Date.now());
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, CACHE_DURATION);
    return () => clearInterval(interval);
  }, [lastFetched]);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MetricCard
          title="Total Medicines"
          value={loading ? <Loader2Icon className="animate-spin" /> : metrics.totalMedicines}
          icon={<PackageIcon />}
          iconBgColor="bg-[#CCFF33]"
          iconColor="text-[#0a3833]"
          changeColor="text-green-500"
        />
        <MetricCard
          title="Total Suppliers"
          value={loading ? <Loader2Icon className="animate-spin" /> : metrics.totalSuppliers}
          icon={<UsersIcon />}
          iconBgColor="bg-[#CCFF33]"
          iconColor="text-[#0a3833]"
          changeColor="text-green-500"
        />
        <MetricCard
          title="Total Sales"
          value={loading ? <Loader2Icon className="animate-spin" /> : `$${metrics.totalSales.toFixed(2)}`}
          icon={<DollarSignIcon />}
          iconBgColor="bg-[#CCFF33]"
          iconColor="text-[#0a3833]"
          changeColor="text-green-500"
        />
      </div>

      {/* Critical Stock Alerts */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <AlertTriangleIcon className="text-orange-500 mr-2" size={24} />
            <h2 className="text-xl font-semibold text-[#0a3833]">Critical Stock Alerts</h2>
          </div>
          <button 
            onClick={() => navigate('/all-alerts')}
            className="text-[#0a3833] text-sm font-medium hover:text-green-700 flex items-center"
          >
            View All
            <ChevronDownIcon size={16} className="ml-1" />
          </button>
        </div>
        <RestockAlert limit={5} />
      </div>

      {/* Orders and Top Selling Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#0a3833]">Latest Orders</h2>
            <button 
              onClick={() => navigate('/orders')}
              className="text-[#0a3833] text-sm font-medium hover:text-green-700 flex items-center"
            >
              View All
              <ChevronDownIcon size={16} className="ml-1" />
            </button>
          </div>
          <OrdersTable />
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#0a3833]">Top Selling Medicines</h2>
          </div>
          <TopSellingChart />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
