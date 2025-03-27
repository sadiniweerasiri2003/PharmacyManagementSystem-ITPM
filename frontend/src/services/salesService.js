import axios from "axios";

const API_URL = "http://localhost:5000/api/sales"; // Change the port if needed

// Create a new sale
export const createSale = async (saleData) => {
    return await axios.post(API_URL, saleData);
};

// Get all sales
export const getSales = async () => {
    return await axios.get(API_URL);
};

// Get a single sale by order ID
export const getSaleById = async (orderid) => {
    return await axios.get(`${API_URL}/${orderid}`);
};

// Update a sale
export const updateSale = async (orderid, updatedData) => {
    return await axios.put(`${API_URL}/${orderid}`, updatedData);
};

// Delete a sale
export const deleteSale = async (orderid) => {
    return await axios.delete(`${API_URL}/${orderid}`);
};
