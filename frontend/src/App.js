import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import SupplierOrder from "./components/SupplierOrder";
import SupplierOrderList from "./components/SupplierOrderList";
import PreviousSupplierOrders from "./components/PreviousSupplierOrders";
import EditSupplierOrder from "./components/EditSupplierOrder";
import AdminDashboard from "./pages/AdminDashboard";
import CashierDashboard from "./pages/CashierDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import AddSupplier from "./components/AddSupplier";
import SupplierList from "./components/SupplierList";
import EditSupplier from "./components/EditSupplier";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/cashier-dashboard" element={<CashierDashboard />} />
          <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
          
          {/* Supplier Management Routes */}
          <Route path="/suppliers" element={<SupplierList />} />
          <Route path="/suppliers/add" element={<AddSupplier />} />
          <Route path="/suppliers/edit/:id" element={<EditSupplier />} />
          
          {/* Order Management Routes */}
          <Route path="/orders" element={<SupplierOrderList />} />
          <Route path="/orders/add" element={<SupplierOrder />} />
          <Route path="/orders/edit/:id" element={<EditSupplierOrder />} />
          
          
          {/* Default route */}
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;