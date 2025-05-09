import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SalesDashboard = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/sales/today");
      const data = await response.json();
      setSales(data);
    } catch (error) {
      console.error("Error fetching sales:", error);
      setError("Failed to fetch sales data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (invoiceId) => {
    if (window.confirm("Are you sure you want to delete this sale?")) {
      try {
        const response = await fetch(`http://localhost:5001/api/sales/${invoiceId}`, {
          method: "DELETE",
        });
  
        if (response.ok) {
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

  const handleRemoveMedicine = async (invoiceId, medicineId, medicineName) => {
    // Only allow removal if the sale has more than one medicine
    const sale = sales.find(s => s.invoiceId === invoiceId);
    if (sale.medicines.length <= 1) {
      alert("Cannot remove medicine from sale with only one item");
      return;
    }

    if (window.confirm(`Are you sure you want to remove ${medicineName} from this sale?`)) {
      try {
        const response = await fetch(`http://localhost:5001/api/sales/${invoiceId}/removeMedicine`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ medicineId }),
        });

        if (response.ok) {
          const updatedSale = await response.json();
          setSales(prevSales => 
            prevSales.map(sale => 
              sale.invoiceId === invoiceId ? updatedSale : sale
            )
          );
        } else {
          const errorData = await response.json();
          alert(`Failed to update sale: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error updating sale. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading sales data...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-[#f5fff2] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#0a3833]">Sales Records</h1>
        {userRole === 'cashier' && (
          <button
            onClick={() => navigate('/billing')}
            className="bg-[#0a3833] text-white px-6 py-3 rounded-lg hover:bg-[#0a3833]/80 transition-all duration-300 flex items-center gap-2 shadow-md"
          >
            <span>Create New Sale</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-200 text-sm text-gray-500">
              <th className="pb-4 font-medium">Invoice ID</th>
              <th className="pb-4 font-medium">Medicine Name</th>
              <th className="pb-4 font-medium">Qty Sold</th>
              <th className="pb-4 font-medium">Unit Price</th>
              <th className="pb-4 font-medium">Total Price</th>
              <th className="pb-4 font-medium">Payment Type</th>
              <th className="pb-4 font-medium">Cashier ID</th>
              <th className="pb-4 font-medium">Order Date</th>
              <th className="pb-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {sales.length > 0 ? (
              sales.map((sale) => (
                sale.medicines.map((medicine, index) => (
                  <tr key={`${sale.invoiceId}-${index}`} className="border-b border-gray-100 hover:bg-gray-50/50 transition-all duration-200">
                    {index === 0 && (
                      <td rowSpan={sale.medicines.length} className="py-4 px-2 text-[#0a3833] font-medium">{sale.invoiceId}</td>
                    )}
                    <td className="py-4 px-2">{medicine.name}</td>
                    <td className="py-4 px-2">{medicine.qty_sold}</td>
                    <td className="py-4 px-2">${medicine.unitprice.toFixed(2)}</td>
                    <td className="py-4 px-2">${medicine.totalprice.toFixed(2)}</td>
                    {index === 0 && (
                      <>
                        <td rowSpan={sale.medicines.length} className="py-4 px-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            sale.payment_type === 'Cash' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {sale.payment_type}
                          </span>
                        </td>
                        <td rowSpan={sale.medicines.length} className="py-4 px-2">{sale.cashier_id}</td>
                        <td rowSpan={sale.medicines.length} className="py-4 px-2">
                          {new Date(sale.orderdate_time).toLocaleString()}
                        </td>
                        <td rowSpan={sale.medicines.length} className="py-4 px-2">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleDelete(sale.invoiceId)} 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                              title="Delete Sale"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                    {/* Add edit button for each medicine if there's more than one medicine */}
                    {sale.medicines.length > 1 && (
                      <td className="py-4 px-2">
                        <button
                          onClick={() => handleRemoveMedicine(sale.invoiceId, medicine._id, medicine.name)}
                          className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 p-2 rounded-lg transition-all duration-200 flex items-center gap-1"
                          title="Remove Medicine"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ))
            ) : (
              <tr>
                <td colSpan="10" className="py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <p className="text-gray-500 text-lg">No sales records available</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesDashboard;
