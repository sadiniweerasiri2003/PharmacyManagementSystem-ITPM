import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InventoryDashboard from "./pages/InventoryDashboard";
import AddMedicines from "./pages/AddMedicines";
import UpdateMedicine from "./pages/UpdateMedicine";
import Login from "./pages/login";
import AdminDashboard from "./pages/AdminDashboard";
import CashierDashboard from "./pages/CashierDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<InventoryDashboard />} />
        <Route path="/add-item" element={<AddMedicines/>} />
        <Route path="/update-medicine/:id" element={<UpdateMedicine />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/cashier-dashboard" element={<CashierDashboard />} />
        <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
