import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleCreateBill = () => {
    navigate('/billing');
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button 
        onClick={handleCreateBill}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
      >
        Create a Bill
      </button>
    </div>
  );
};

export default Dashboard;
