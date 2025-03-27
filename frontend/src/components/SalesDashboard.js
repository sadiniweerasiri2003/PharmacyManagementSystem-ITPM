import { useState, useEffect } from "react";
import { getSales, updateSale, deleteSale } from "../services/salesService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SalesDashboard = () => {
    const [sales, setSales] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    // Fetch sales records
    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const response = await getSales();
            setSales(response.data);
        } catch (error) {
            toast.error("Error fetching sales records.");
        }
    };

    // Handle update sale
    const handleUpdate = (orderid) => {
        // Here, you can implement the update logic, such as opening a modal or redirecting to a different page with the sale's details
        toast.info(`Update functionality for Order ID: ${orderid} is under construction.`);
    };

    // Handle delete sale
    const handleDelete = async (orderid) => {
        try {
            await deleteSale(orderid);
            toast.success("Sale deleted successfully!");
            fetchSales();
        } catch (error) {
            toast.error("Error deleting sale.");
        }
    };

    // Navigate to the BillingForm when the "Create a Bill" button is clicked
    const handleCreateBill = () => {
        navigate("/billing"); // Navigate to the billing form page
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4">Sales Dashboard</h2>

            {/* Button to navigate to Billing Form */}
            <button
                onClick={handleCreateBill}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4"
            >
                Create a Bill
            </button>

            <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Order ID</th>
                        <th className="border px-4 py-2">Medicine ID</th>
                        <th className="border px-4 py-2">Quantity Sold</th>
                        <th className="border px-4 py-2">Unit Price</th>
                        <th className="border px-4 py-2">Total Price</th>
                        <th className="border px-4 py-2">Payment Type</th>
                        <th className="border px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map((sale) => (
                        <tr key={sale.orderid}>
                            <td className="border px-4 py-2">{sale.orderid}</td>
                            <td className="border px-4 py-2">{sale.medicineid}</td>
                            <td className="border px-4 py-2">{sale.qty_sold}</td>
                            <td className="border px-4 py-2">${sale.unitprice}</td>
                            <td className="border px-4 py-2">${sale.totalprice}</td>
                            <td className="border px-4 py-2">{sale.payment_type}</td>
                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => handleUpdate(sale.orderid)}
                                    className="bg-yellow-500 text-white px-4 py-1 rounded mr-2"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => handleDelete(sale.orderid)}
                                    className="bg-red-500 text-white px-4 py-1 rounded"
                                >
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

export default SalesDashboard;
