import React from 'react'
import { SearchIcon, BellIcon, ChevronDownIcon } from 'lucide-react'
const Header = () => {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="text-lg font-medium">
          <h1 className="text-gray-800 font-semibold">Overview</h1>
        </div>
        <div className="flex items-center">
          <div className="relative mr-4">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-gray-50 rounded-full w-[300px] text-sm focus:outline-none"
            />
            <SearchIcon size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <div className="flex items-center cursor-pointer">
            <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden mr-2">
              <img
                src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mr-2">
              <div className="text-sm font-medium">Admin</div>
              <div className="text-xs text-gray-500">@SadiniWeerasiri</div>
            </div>
            <ChevronDownIcon size={16} className="text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  )
}
export default Header;