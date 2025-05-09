import React, { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register only required Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AnnualSalesReport = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [salesData, setSalesData] = useState(null);
    const [loading, setLoading] = useState(false);
    const reportRef = useRef(null);

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

    useEffect(() => {
        fetchSalesData();
    }, [selectedYear]);

    const fetchSalesData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5001/api/sales-report/annual/${selectedYear}`);
            const data = await response.json();
            setSalesData(data);
        } catch (error) {
            console.error('Error fetching sales data:', error);
        }
        setLoading(false);
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Monthly Sales Distribution for ${selectedYear}`,
                font: {
                    size: 16
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => `$${value.toLocaleString()}`
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    const barChartData = {
        labels: salesData?.monthlySales.map(item => item.month) || [],
        datasets: [{
            label: 'Monthly Sales',
            data: salesData?.monthlySales.map(item => item.sales) || [],
            backgroundColor: 'rgba(53, 162, 235, 0.7)',
            borderColor: 'rgb(53, 162, 235)',
            borderWidth: 1,
            borderRadius: 4,
            maxBarThickness: 50
        }]
    };



    const downloadPDF = async () => {
        const canvas = await html2canvas(reportRef.current);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`sales-report-${selectedYear}.pdf`);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Annual Sales Report</h1>
                <div className="flex gap-4">
                    <select 
                        value={selectedYear} 
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <button
                        onClick={downloadPDF}
                        className="px-4 py-2 bg-[#0a3833] text-white rounded-lg hover:bg-[#0a3833]/80 transition-colors"
                        disabled={loading || !salesData}
                    >
                        Download PDF
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B5E20]"></div>
                </div>
            ) : (
                <div ref={reportRef} className="space-y-6">
                    {salesData?.hasSales ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Annual Sales</h3>
                                    <p className="text-3xl font-bold text-[#0a3833]">
                                        ${salesData.totalAnnualSales.toLocaleString()}
                                    </p>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Monthly Sales</h3>
                                    <p className="text-3xl font-bold text-[#1B5E20]">
                                        ${(salesData.totalAnnualSales / 12).toLocaleString()}
                                    </p>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Highest Monthly Sales</h3>
                                    <p className="text-3xl font-bold text-[#1B5E20]">
                                        ${Math.max(...salesData.monthlySales.map(m => m.sales)).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div style={{ height: '500px' }}>
                                    <Bar key={`bar-${selectedYear}`} options={barChartOptions} data={barChartData} />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Breakdown</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">% of Annual</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {salesData.monthlySales.map((month, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap">{month.month}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">${month.sales.toLocaleString()}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{month.percentage}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md">
                            <p className="text-xl text-gray-500">No sales data available for {selectedYear}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AnnualSalesReport;
