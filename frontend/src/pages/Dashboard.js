import React from 'react'
import { useNavigate } from 'react-router-dom'
import MetricCard from '../components/dashboard/MetricCard'
import SalesChart from '../components/dashboard/SalesChart'
import OrdersTable from '../components/dashboard/OrdersTable'
import TopSellingChart from '../components/dashboard/TopSellingChart'
import {
  DollarSignIcon,
  UsersIcon,
  ShoppingCartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from 'lucide-react'
const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MetricCard
          title="Total Medicines"
          value="$12,500"
          icon={<DollarSignIcon />}
          iconBgColor="bg-[#CCFF33]"
          iconColor="text-[#0a3833]"
          changeColor="text-green-500"
        />
        <MetricCard
          title="Total Suppliers"
          value="1,200"
          icon={<UsersIcon />}
          iconBgColor="bg-[#FFE5E5]"
          iconColor="text-red-500"
          changeColor="text-red-500"
        />
        <MetricCard
          title="Total sales"
          value="$2,549+"
          icon={<DollarSignIcon />}
          iconBgColor="bg-white"
          iconColor="text-[#0a3833]"
          changeColor="text-green-500"
        />
      </div>
      {/* Sales Analytics */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Sales Analytics</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate('/sales')}
              className="text-blue-600 text-sm font-medium hover:text-blue-800"
            >
              View All Sales
            </button>
            <div className="bg-white border border-gray-200 rounded-md px-4 py-1.5 flex items-center">
              <span className="text-sm font-medium">This Month</span>
              <ChevronDownIcon size={16} className="ml-2" />
            </div>
            <button className="p-1.5 rounded-md border border-gray-200">
              <ChevronLeftIcon size={18} />
            </button>
            <button className="p-1.5 rounded-md border border-gray-200">
              <ChevronRightIcon size={18} />
            </button>
          </div>
        </div>
        <SalesChart />
      </div>
      {/* Latest Orders and Top Selling */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Latest Orders</h2>
            <button className="text-blue-600 text-sm font-medium">View All</button>
          </div>
          <OrdersTable />
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Top Selling Medicine</h2>
          </div>
          <TopSellingChart />
        </div>
      </div>
    </div>
  )
}
export default Dashboard;