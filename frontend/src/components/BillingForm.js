import { useState, useEffect } from "react";
import { createSale, getSales, updateSale, deleteSale } from "../services/salesService";
import toast from "react-hot-toast";

// Generate a unique Order ID based on timestamp and random value
const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
};

const BillingForm = () => {
    const [sales, setSales] = useState([]);
    const [formData, setFormData] = useState({
        orderid: generateOrderId(), // Generate a new Order ID when form is initialized
        medicineid: "", // Manually input field
        qty_sold: "",
        unitprice: "",
        totalprice: 0, // default 0
        orderdate_time: new Date().toISOString().slice(0, 16), // Default to current date and time
        payment_type: "Cash", // Default payment type
        cashier_id: "", // Manually input field
    });

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

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Calculate total price if qty_sold or unitprice changes
        if (name === "qty_sold" || name === "unitprice") {
            const qty = parseFloat(value) || 0;
            const unit = parseFloat(formData.unitprice) || 0;
            const total = (name === "qty_sold" ? qty : parseFloat(formData.qty_sold)) * (name === "unitprice" ? unit : parseFloat(formData.unitprice));

            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
                totalprice: total,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createSale(formData);
            toast.success("Sale added successfully!");
            fetchSales();
            setFormData({
                orderid: generateOrderId(), // Generate a new Order ID for the next sale
                medicineid: "",
                qty_sold: "",
                unitprice: "",
                totalprice: 0,
                orderdate_time: new Date().toISOString().slice(0, 16),
                payment_type: "Cash",
                cashier_id: "",
            });
        } catch (error) {
            toast.error("Error adding sale.");
        }
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

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4">Billing Form</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="orderid"
                    placeholder="Order ID"
                    value={formData.orderid}
                    disabled
                    className="w-full p-2 border rounded bg-gray-200"
                />
                <input
                    type="text"
                    name="medicineid"
                    placeholder="Medicine ID"
                    value={formData.medicineid}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="text"
                    name="qty_sold"
                    placeholder="Quantity Sold"
                    value={formData.qty_sold}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="text"
                    name="unitprice"
                    placeholder="Unit Price"
                    value={formData.unitprice}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="text"
                    name="totalprice"
                    placeholder="Total Price"
                    value={formData.totalprice}
                    disabled
                    className="w-full p-2 border rounded bg-gray-200"
                />
                <input
                    type="datetime-local"
                    name="orderdate_time"
                    value={formData.orderdate_time}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <select
                    name="payment_type"
                    value={formData.payment_type}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                >
                    <option value="Cash">Cash</option>
                    <option value="Credit">Credit</option>
                </select>
                <input
                    type="text"
                    name="cashier_id"
                    placeholder="Cashier ID"
                    value={formData.cashier_id}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Add Sale
                </button>
            </form>

            <h2 className="text-xl font-bold mt-6">Sales Records</h2>
            <ul className="mt-4">
                {sales.map((sale) => (
                    <li key={sale.orderid} className="flex justify-between items-center p-2 border-b">
                        <span>{sale.orderid} - ${sale.totalprice}</span>
                        <button onClick={() => handleDelete(sale.orderid)} className="text-red-500">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BillingForm;
