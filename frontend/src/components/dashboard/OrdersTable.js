import React from 'react'
import { EyeIcon, TrashIcon, UploadIcon } from 'lucide-react'
const OrdersTable = () => {
  const orders = [
    {
      id: '#ORD576',
      medicine: 'Atorvastatin',
      price: '$18.00',
      status: 'Delivered',
    },
    {
      id: '#ORD575',
      medicine: 'Omeprazole',
      price: '$12.00',
      status: 'Pending',
    },
    {
      id: '#ORD574',
      medicine: 'Metformin',
      price: '$22.00',
      status: 'Pending',
    },
  ]
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="text-left text-gray-500 text-sm border-b border-gray-200">
            <th className="pb-3 font-medium">Order ID</th>
            <th className="pb-3 font-medium">Medicine Name</th>
            <th className="pb-3 font-medium">Price</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-gray-100">
              <td className="py-4 text-gray-800">{order.id}</td>
              <td className="py-4 text-gray-800">{order.medicine}</td>
              <td className="py-4 text-gray-800">{order.price}</td>
              <td className="py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Delivered'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="py-4">
                <div className="flex space-x-2">
                  <button className="text-gray-500 hover:text-gray-700">
                    <EyeIcon size={18} />
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    <TrashIcon size={18} />
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    <UploadIcon size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default OrdersTable;