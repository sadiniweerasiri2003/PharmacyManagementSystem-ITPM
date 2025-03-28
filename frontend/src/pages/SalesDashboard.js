import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SalesDashboard = () => {
  const [sales, setSales] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/sales/today");
        const data = await response.json();
        setSales(data);
      } catch (error) {
        console.error("Error fetching sales:", error);
      }
    };

    fetchSales();
  }, []);

  const handleDelete = async (invoiceId) => {
    if (window.confirm("Are you sure you want to delete this sale?")) {
      try {
        const response = await fetch(`http://localhost:5001/api/sales/${invoiceId}`, {
          method: "DELETE",
        });
  
        if (response.ok) {
          // Remove the deleted sale from the state
          setSales((prevSales) => prevSales.filter((sale) => sale.invoiceId !== invoiceId));
        } else {
          const errorData = await response.json();
          alert(`Failed to delete sale: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error deleting sale. Please try again.");
      }
    }
  };
  

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Sales Records</h2>

  

      {/* Sales Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border p-2">Invoice ID</th>
              <th className="border p-2">Medicine Name</th>
              <th className="border p-2">Qty Sold</th>
              <th className="border p-2">Unit Price</th>
              <th className="border p-2">Total Price</th>
              <th className="border p-2">Payment Type</th>
              <th className="border p-2">Cashier ID</th>
              <th className="border p-2">Order Date</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((sale) => (
                sale.medicines.map((medicine, index) => (
                  <tr key={`${sale.invoiceId}-${index}`} className="text-center hover:bg-gray-50">
                    {index === 0 && (
                      <td rowSpan={sale.medicines.length} className="border p-2">{sale.invoiceId}</td>
                    )}
                    <td className="border p-2">{medicine.name}</td>
                    <td className="border p-2">{medicine.qty_sold}</td>
                    <td className="border p-2">{medicine.unitprice}</td>
                    <td className="border p-2">{medicine.totalprice}</td>
                    {index === 0 && (
                      <>
                        <td rowSpan={sale.medicines.length} className="border p-2">{sale.payment_type}</td>
                        <td rowSpan={sale.medicines.length} className="border p-2">{sale.cashier_id}</td>
                        <td rowSpan={sale.medicines.length} className="border p-2">{new Date(sale.orderdate_time).toLocaleString()}</td>
                        <td rowSpan={sale.medicines.length} className="border p-2">
                          <button onClick={() => handleDelete(sale.invoiceId)} className="bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-600 transition duration-200">
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ))
            ) : (
              <tr>
                <td colSpan="9" className="border p-4 text-center text-gray-500">No sales records available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesDashboard;
