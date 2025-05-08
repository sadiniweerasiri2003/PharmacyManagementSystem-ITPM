import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MedicineList = ({ medicines, onEdit, handleDelete }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white p-8 shadow-xl rounded-2xl mb-6">
      <h2 className="text-2xl font-bold mb-6 text-[#1B5E20]">Medicine List</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#1B5E20] text-white">
              <th className="px-6 py-4 text-left">Medicine ID</th>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Batch</th>
              <th className="px-6 py-4 text-left">Expiry</th>
              <th className="px-6 py-4 text-left">Price</th>
              <th className="px-6 py-4 text-left">Quantity</th>
              <th className="px-6 py-4 text-left">Last Restocked</th>
              <th className="px-6 py-4 text-left">Supplier ID</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {medicines.map((medicine) => (
              <tr 
                key={medicine._id} 
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">{medicine.medicineId}</td>
                <td className="px-6 py-4 font-medium">{medicine.name}</td>
                <td className="px-6 py-4">{medicine.batchNumber}</td>
                <td className="px-6 py-4">{new Date(medicine.expiryDate).toLocaleDateString()}</td>
                <td className="px-6 py-4">${medicine.price}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    medicine.quantity < 10 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {medicine.quantity}
                  </span>
                </td>
                <td className="px-6 py-4">{new Date(medicine.restockedDate).toLocaleDateString()}</td>
                <td className="px-6 py-4">{medicine.supplierId}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => navigate(`/update-medicine/${medicine._id}`)}
                      className="p-2 bg-[#1B5E20] text-white rounded-full hover:bg-[#1B5E20]/90 transition-all duration-200 hover:scale-110"
                      title="Edit Medicine"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(medicine._id)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-200 hover:scale-110"
                      title="Delete Medicine"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicineList;
