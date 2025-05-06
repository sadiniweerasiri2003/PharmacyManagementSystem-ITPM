import React from "react";
import { Edit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";


const MedicineList = ({ medicines, onEdit, handleDelete }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white p-6 shadow-lg rounded-2xl mb-6">
      <h2 className="text-xl font-semibold mb-4">Medicine List</h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Medicine ID</th>  {/* New column */}
            <th className="border p-2">Name</th>
            <th className="border p-2">Batch</th>
            <th className="border p-2">Expiry</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Last Restocked</th>
            <th className="border p-2">Supplier ID</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine) => (
            <tr key={medicine._id} className="text-center">
              <td className="border p-2">{medicine.medicineId}</td>  {/* New cell */}
              <td className="border p-2">{medicine.name}</td>
              <td className="border p-2">{medicine.batchNumber}</td>
              <td className="border p-2">{medicine.expiryDate}</td>
              <td className="border p-2">${medicine.price}</td>
              <td className="border p-2">{medicine.quantity}</td>
              <td className="border p-2">{medicine.restockedDate}</td>
              <td className="border p-2">{medicine.supplierId}</td>
              <td className="border p-2 flex justify-center gap-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow-md flex items-center gap-2"
                  onClick={() => navigate(`/update-medicine/${medicine._id}`)}
                >
                  <Edit size={18} />
                  Update
                </button>

                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(medicine._id)}
                >
                  <Trash size={18} />
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicineList;
