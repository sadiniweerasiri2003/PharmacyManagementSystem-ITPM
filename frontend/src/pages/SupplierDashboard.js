import React from "react";
import { useNavigate } from "react-router-dom";

const SupplierDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Supplier Dashboard</h2>
        <nav>
          <ul>
            <li className="mb-4">
              <button
                onClick={() => navigate("/supplier-orders")}
                className="w-full text-left bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded transition duration-300"
              >
                Manage Orders
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/previous-supplier-orders")}
                className="w-full text-left bg-gray-500 hover:bg-gray-700 px-4 py-2 rounded transition duration-300"
              >
                Previous Orders
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the Supplier Dashboard</h1>
        <p className="text-gray-600">Manage your orders and view past orders efficiently.</p>

        {/* Navigation Buttons */}
        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => navigate("/orders")}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Go to Supplier Orders
          </button>
          <button
            onClick={() => navigate("/previous-orders")}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            View Previous Orders
          </button>
        </div>
      </main>
    </div>
  );
};

export default SupplierDashboard;
