import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import AdminDashboard from "./pages/AdminDashboard";
import CashierDashboard from "./pages/CashierDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/cashier-dashboard" element={<CashierDashboard />} />
        <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

