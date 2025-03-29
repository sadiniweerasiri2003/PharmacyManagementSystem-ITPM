import React from 'react'
import {
  LayoutGridIcon,
  PackageIcon,
  ShoppingCartIcon,
  TrendingUpIcon,
  UsersIcon,
  CreditCardIcon,
  LifeBuoyIcon,
  SettingsIcon,
  LockIcon
} from 'lucide-react'
const NavItem = ({ icon, label }) => {
  return (
    <div className="flex items-center py-3 px-2 text-gray-300 hover:text-white cursor-pointer">
      <div className="mr-3">{icon}</div>
      <span>{label}</span>
    </div>
  )
}
const Sidebar = () => {
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
        <NavItem icon={<PackageIcon size={20} />} label="Overview" />
          <NavItem icon={<PackageIcon size={20} />} label="Medicines" />
          <NavItem icon={<ShoppingCartIcon size={20} />} label="Sales" />
          <NavItem icon={<TrendingUpIcon size={20} />} label="Suppliers" />
          <NavItem icon={<UsersIcon size={20} />} label="SupplierOrders" />
        </div>
      </div>
    </div>
  )
}
export default Sidebar;