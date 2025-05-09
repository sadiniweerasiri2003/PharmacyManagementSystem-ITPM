import React from 'react';
import RestockAlert from '../components/RestockAlert';

const AllRestockAlerts = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 px-4">
                    All Critical Stock Alerts
                </h1>
                <RestockAlert limit={0} />
            </div>
        </div>
    );
};

export default AllRestockAlerts;
