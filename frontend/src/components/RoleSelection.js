import React, { useState } from "react";
import Login from "./login.js";
import CashierLogin from "./CashierLogin";

const RoleSelection = () => {
  const [role, setRole] = useState(""); // No role selected initially

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h1 className="text-2xl font-semibold text-center mb-4">
        Pharmacy Management System
      </h1>

      {/* Role Selection Dropdown */}
      <label className="block text-gray-700 font-medium">Select Role:</label>
      <select
        className="w-full p-2 border border-gray-300 rounded mt-2 mb-4"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="">-- Select Role --</option>
        <option value="admin">Admin</option>
        <option value="supplier">Supplier</option>
        <option value="cashier">Cashier</option>
      </select>

      {/* Show Login Form Based on Role Selection */}
      {role === "admin" || role === "supplier" ? <Login role={role} /> : null}
      {role === "cashier" ? <CashierLogin /> : null}
    </div>
  );
};

export default RoleSelection;
