import React from 'react'
import { useNavigate } from 'react-router-dom';
import {
  LayoutGridIcon,
  PackageIcon,
  ShoppingCartIcon,
  TrendingUpIcon,
  UsersIcon,
  ChartBarIcon,
  ClipboardListIcon
} from 'lucide-react'

const NavItem = ({ icon, label, onClick }) => {
  return (
    <div className="flex items-center py-3 px-2 text-gray-300 hover:text-white cursor-pointer" onClick={onClick}>
      <div className="mr-3">{icon}</div>
      <span>{label}</span>
    </div>
  )
}

const Sidebar = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');

  return (
    <div className="w-[220px] bg-[#0a3833] text-white flex flex-col h-full">
      <div className="p-4 flex items-center border-b border-[#164e47]">
        <div className="h-8 w-8 rounded-md bg-[#61D64B] flex items-center justify-center mr-2">
          <span className="text-[#0a3833] font-bold text-xl">+</span>
        </div>
        <span className="text-xl font-bold">MediSync</span>
      </div>
      <div className="flex-1 py-4">
        <div className="px-4 mb-6">
          {userRole === 'admin' ? (
            <>
              <NavItem 
                icon={<LayoutGridIcon size={20} />} 
                label="Overview" 
                onClick={() => navigate('/dashboard')}
              />
              <NavItem 
                icon={<PackageIcon size={20} />} 
                label="Medicines" 
                onClick={() => navigate('/inventory-dashboard')}
              />
              <NavItem 
                icon={<UsersIcon size={20} />} 
                label="Suppliers" 
                onClick={() => navigate('/supplier-dashboard')}
              />
              <NavItem 
                icon={<ClipboardListIcon size={20} />} 
                label="Supplier Orders" 
                onClick={() => navigate('/orders')}
              />
              <NavItem 
                icon={<ChartBarIcon size={20} />} 
                label="Sales History" 
                onClick={() => navigate('/sales')}
              />
            </>
          ) : (
            <>
              <NavItem 
                icon={<ShoppingCartIcon size={20} />} 
                label="Billing" 
                onClick={() => navigate('/billing')}
              />
              <NavItem 
                icon={<ChartBarIcon size={20} />} 
                label="Sales History" 
                onClick={() => navigate('/sales')}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;