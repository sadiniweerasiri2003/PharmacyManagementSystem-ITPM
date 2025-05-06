import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import InventoryDashboard from "./pages/InventoryDashboard";
import AddMedicines from "./pages/AddMedicines";
import UpdateMedicine from "./pages/UpdateMedicine";
import Login from "./pages/login";
import SupplierOrder from "./components/SupplierOrder";
import SupplierOrderList from "./components/SupplierOrderList";
import PreviousSupplierOrders from "./components/PreviousSupplierOrders";
import EditSupplierOrder from "./components/EditSupplierOrder";
import AdminDashboard from "./pages/Dashboard";
import CashierDashboard from "./pages/CashierDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import DashboardLayout from "./components/layout/DashboardLayout";
import SalesDashboard from "./pages/SalesDashboard";
import BillingForm from "./pages/BillingForm";
import { Toaster } from "react-hot-toast";
import AdminRoute from "./components/AdminRoute";
import CashierRoute from "./components/CashierRoute";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Router>
        <Toaster />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin Routes */}
          <Route path="/dashboard" element={
            <AdminRoute>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </AdminRoute>
          } />
          
          <Route path="/inventory-dashboard" element={
            <AdminRoute>
              <DashboardLayout>
                <InventoryDashboard />
              </DashboardLayout>
            </AdminRoute>
          } />

          <Route path="/add-item" element={
            <AdminRoute>
              <DashboardLayout>
                <AddMedicines />
              </DashboardLayout>
            </AdminRoute>
          } />

          <Route path="/update-medicine/:id" element={
            <AdminRoute>
              <DashboardLayout>
                <UpdateMedicine />
              </DashboardLayout>
            </AdminRoute>
          } />

          <Route path="/supplier-dashboard" element={
            <AdminRoute>
              <DashboardLayout>
                <SupplierDashboard />
              </DashboardLayout>
            </AdminRoute>
          } />

          <Route path="/orders/*" element={
            <AdminRoute>
              <DashboardLayout>
                <SupplierOrderList />
              </DashboardLayout>
            </AdminRoute>
          } />

          {/* Sales Dashboard - Accessible by both admin and cashier */}
          <Route path="/sales" element={
            <ProtectedRoute allowedRoles={['admin', 'cashier']}>
              <DashboardLayout>
                <SalesDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Billing Form - Cashier Only */}
          <Route path="/billing" element={
            <CashierRoute>
              <BillingForm />
            </CashierRoute>
          } />

          {/* Catch all unauthorized routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

