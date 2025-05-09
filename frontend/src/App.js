import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import InventoryDashboard from "./pages/InventoryDashboard";
import AddMedicines from "./pages/AddMedicines";
import UpdateMedicine from "./pages/UpdateMedicine";
import Login from "./pages/login";
import AdminDashboard from "./pages/AdminDashboard";
import CashierDashboard from "./pages/CashierDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import DashboardLayout from "./components/layout/DashboardLayout";
import SalesDashboard from "./pages/SalesDashboard";
import BillingForm from "./pages/BillingForm";
import { Toaster } from "react-hot-toast";
import AdminRoute from "./components/AdminRoute";
import CashierRoute from "./components/CashierRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import SupplierOrder from "./components/SupplierOrder";
import SupplierOrderList from "./components/SupplierOrderList";
import PreviousSupplierOrders from "./components/PreviousSupplierOrders";
import EditSupplierOrder from "./components/EditSupplierOrder";
import PredictionsTable from "./components/PredictionsTable";
import RestockAlert from "./components/RestockAlert";
import AllRestockAlerts from "./pages/AllRestockAlerts";

function App() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Router>
        <Toaster />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Root path handler - redirects based on auth status */}
          <Route path="/" element={
            <ProtectedRoute allowedRoles={['admin', 'cashier']}>
              <Navigate to="/admin-dashboard" replace />
            </ProtectedRoute>
          } />

          {/* Overview/Dashboard route */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Navigate to="/admin-dashboard" replace />
            </ProtectedRoute>
          } />

          {/* Admin Dashboard - make this the main landing page for admin */}
          <Route path="/admin-dashboard" element={
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

          {/* Supplier Routes */}
          <Route path="/supplier-dashboard" element={
            <AdminRoute>
              <DashboardLayout>
                <SupplierDashboard />
              </DashboardLayout>
            </AdminRoute>
          } />

          <Route path="/orders" element={
            <AdminRoute>
              <DashboardLayout>
                <SupplierOrderList />
              </DashboardLayout>
            </AdminRoute>
          } />

          <Route path="/orders/add" element={
            <AdminRoute>
              <DashboardLayout>
                <SupplierOrder fetchOrders={() => {}} />
              </DashboardLayout>
            </AdminRoute>
          } />

          <Route path="/orders/edit/:id" element={
            <AdminRoute>
              <DashboardLayout>
                <EditSupplierOrder />
              </DashboardLayout>
            </AdminRoute>
          } />

          <Route path="/previous-supplier-orders" element={
            <AdminRoute>
              <DashboardLayout>
                <PreviousSupplierOrders />
              </DashboardLayout>
            </AdminRoute>
          } />

          {/* Cashier Routes */}
          <Route path="/cashier-dashboard" element={
            <CashierRoute>
              <DashboardLayout>
                <CashierDashboard />
              </DashboardLayout>
            </CashierRoute>
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
              <DashboardLayout>
                <BillingForm />
              </DashboardLayout>
            </CashierRoute>
          } />

          {/* Add Predictions Routes */}
          <Route path="/predictions" element={
            <AdminRoute>
              <DashboardLayout>
                <PredictionsTable />
              </DashboardLayout>
            </AdminRoute>
          } />

          <Route path="/all-alerts" element={
            <AdminRoute>
              <DashboardLayout>
                <AllRestockAlerts />
              </DashboardLayout>
            </AdminRoute>
          } />

          {/* Catch all unauthorized routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

