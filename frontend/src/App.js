import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoleSelection from "./components/RoleSelection";
import Login from "./components/login";
import SupplierOrders from "./components/SupplierOrder";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/orders" element={<SupplierOrders />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
