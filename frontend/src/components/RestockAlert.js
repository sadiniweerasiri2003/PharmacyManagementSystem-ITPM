import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RestockAlert = ({ limit = 5 }) => {
    const [urgentRestocks, setUrgentRestocks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPredictionsAndMedicines = async () => {
            try {
                // Fetch predictions
                const predResponse = await axios.get('http://localhost:5001/api/predictions');
                // Fetch medicines for names
                const medResponse = await axios.get('http://localhost:5001/api/medicines');
                
                // Create a map of medicine details
                const medicineMap = medResponse.data.reduce((acc, med) => {
                    acc[med.medicineId] = med.name;
                    return acc;
                }, {});

                // Combine predictions with medicine names
                const urgentItems = predResponse.data
                    .filter(pred => pred.days_until_restock <= 7)
                    .map(pred => ({
                        ...pred,
                        medicine_name: medicineMap[pred.medicine_id] || 'Unknown Medicine'
                    }))
                    .sort((a, b) => a.days_until_restock - b.days_until_restock);

                setUrgentRestocks(urgentItems);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchPredictionsAndMedicines();
        const interval = setInterval(fetchPredictionsAndMedicines, 300000);
        return () => clearInterval(interval);
    }, []);

    if (urgentRestocks.length === 0) return null;

    const displayedItems = limit ? urgentRestocks.slice(0, limit) : urgentRestocks;

    return (
        <div className="max-w-2xl mx-auto px-2 py-4"> {/* Reduced from max-w-4xl and padding */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-red-600 to-red-700 p-3"> {/* Reduced padding */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2"> {/* Reduced gap */}
                            <span className="p-1.5 bg-red-100 rounded-full text-sm">⚠️</span> {/* Smaller emoji container */}
                            <h3 className="text-base font-bold text-white">Critical Stock Alert</h3> {/* Smaller text */}
                        </div>
                        <div className="flex gap-2">
                            {limit && urgentRestocks.length > limit && (
                                <button
                                    onClick={() => navigate('/all-alerts')}
                                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs transition-colors" /* Smaller button */
                                >
                                    View All ({urgentRestocks.length})
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="divide-y divide-gray-200">
                    {displayedItems.map((item, index) => (
                        <div key={index} className="p-3 hover:bg-gray-50 transition-colors"> {/* Reduced padding */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                                        {item.medicine_name}
                                    </h4>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Medicine ID: {item.medicine_id}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Current Stock: {item.current_stock}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                        {item.days_until_restock}d left
                                    </span>
                                    <button
                                        onClick={() => navigate(`/reorder/${item.medicine_id}`)}
                                        className="mt-1 block px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors"
                                    >
                                        Reorder
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                                <div
                                    className="bg-red-600 h-1 rounded-full"
                                    style={{ width: `${(item.days_until_restock / 7) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RestockAlert;
