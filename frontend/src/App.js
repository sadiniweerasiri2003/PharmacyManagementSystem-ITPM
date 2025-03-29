import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InventoryDashboard from "./pages/InventoryDashboard";
import AddMedicines from "./pages/AddMedicines";
import UpdateMedicine from "./pages/UpdateMedicine";
import Login from "./pages/login";
import SupplierOrder from "./components/SupplierOrder";
import AdminDashboard from "./pages/AdminDashboard";
import CashierDashboard from "./pages/CashierDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/cashier-dashboard" element={<CashierDashboard />} />
          <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
          <Route path="/orders" element={<SupplierOrder />} />
          <Route path="/inventory-dashboard" element={<InventoryDashboard />} />
          <Route path="/add-item" element={<AddMedicines />} />
          <Route path="/update-medicine/:id" element={<UpdateMedicine />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
