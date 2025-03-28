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
  // Delete Sale
  const handleDelete = async (orderid) => {
    if (window.confirm("Are you sure you want to delete this sale?")) {
      try {
        const response = await fetch(`http://localhost:5001/api/sales/${orderid}`, { method: "DELETE" });

        if (response.ok) {
          setSales(sales.filter((sale) => sale.orderid !== orderid));
        } else {
          alert("Failed to delete sale.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Sales Records</h2>

      {/* Create Bill Button */}
      <button onClick={() => navigate("/billing")} className="bg-blue-500 text-white py-2 px-4 rounded mb-4">
        Create a Bill
      </button>

      {/* Sales Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Medicine ID</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Unit Price</th>
            <th className="border p-2">Total Price</th>
            <th className="border p-2">Payment</th>
            <th className="border p-2">Cashier</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.orderid} className="border">
              <td className="border p-2">{sale.orderid}</td>
              <td className="border p-2">{sale.medicineId}</td>
              <td className="border p-2">{sale.qty_sold}</td>
              <td className="border p-2">{sale.unitprice}</td>
              <td className="border p-2">{sale.totalprice}</td>
              <td className="border p-2">{sale.payment_type}</td>
              <td className="border p-2">{sale.cashier_id}</td>
              <td className="border p-2">
                <button onClick={() => handleDelete(sale.orderid)} className="bg-red-500 text-white py-1 px-2 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesDashboard;
