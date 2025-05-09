import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PredictionsTable = () => {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                setError(null);
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5001/api/predictions', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPredictions(response.data);
            } catch (error) {
                console.error('Error fetching predictions:', error);
                setError('Failed to load predictions. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPredictions();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#1B5E20]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Medicine Stock Predictions</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                <table className="min-w-full">
                    <thead className="bg-[#0a3833]">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Medicine ID</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Current Stock</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Daily Sales Avg</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Days Until Depletion</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Stock Depletion Date</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Reorder Quantity</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-white">Confidence</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {predictions.map((pred, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-800">{pred.medicine_id}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{pred.current_stock}</td>
                                <td className="px-6 py-4 text-sm text-gray-800">{pred.daily_sales_avg}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className={`h-2.5 rounded-full w-full max-w-[100px] ${
                                            pred.days_until_restock <= 7 ? 'bg-red-600' :
                                            pred.days_until_restock <= 14 ? 'bg-[#CCFF33]' : 'bg-[#1B5E20]'
                                        }`}>
                                        </div>
                                        <span className="ml-2 text-sm text-gray-800">{pred.days_until_restock} days until depletion</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800">
                                    {new Date(pred.predicted_restock_date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800">{pred.order_quantity}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="bg-[#0a3833] h-2.5 rounded-full"
                                                style={{ width: `${pred.forecast_confidence}%` }}
                                            ></div>
                                        </div>
                                        <span className="ml-2 text-sm text-gray-800">{pred.forecast_confidence}%</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PredictionsTable;
