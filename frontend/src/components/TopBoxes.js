import React from "react";
import { AlertTriangle, Package, PlusCircle, ShoppingCart } from "lucide-react";

const Card = ({ icon, title, value, color }) => (
  <div className="bg-white p-4 shadow-lg rounded-2xl flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color}`}>{icon}</div>
    <div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const TopBoxes = ({ medicines }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card
        icon={<Package className="text-blue-500 w-8 h-8" />}
        title="Total Items"
        value={medicines.length}
        color="bg-blue-100"
      />
      <Card
        icon={<AlertTriangle className="text-red-500 w-8 h-8" />}
        title="Low Stock Alerts"
        value={medicines.filter((med) => med.quantity < 10).length}
        color="bg-red-100"
      />
      <Card
        icon={<ShoppingCart className="text-green-500 w-8 h-8" />}
        title="Recent Orders"
        value="12"
        color="bg-green-100"
      />
      <Card
        icon={<PlusCircle className="text-purple-500 w-8 h-8" />}
        title="New Items Added"
        value="8"
        color="bg-purple-100"
      />
    </div>
  );
};

export default TopBoxes;
