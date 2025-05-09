import React from 'react';
import PredictionsTable from '../components/PredictionsTable';

const AdminDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
                <PredictionsTable />
            </div>
        </div>
    );
};

export default AdminDashboard;
