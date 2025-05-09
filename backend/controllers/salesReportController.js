const Sales = require('../models/Sales');

exports.getAnnualSales = async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59);

        // Get monthly sales data
        const monthlySales = await Sales.aggregate([
            {
                $match: {
                    orderdate_time: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$orderdate_time" },
                    totalSales: { $sum: "$total" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Calculate total annual sales
        const totalAnnualSales = monthlySales.reduce((acc, month) => acc + month.totalSales, 0);

        // Format the response with percentages
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
        
        const formattedData = monthNames.map((month, index) => {
            const monthData = monthlySales.find(m => m._id === index + 1);
            const sales = monthData ? monthData.totalSales : 0;
            const percentage = totalAnnualSales > 0 
                ? ((sales / totalAnnualSales) * 100).toFixed(2) 
                : 0;

            return {
                month,
                sales,
                percentage: parseFloat(percentage)
            };
        });

        res.json({
            year,
            totalAnnualSales,
            monthlySales: formattedData,
            hasSales: totalAnnualSales > 0
        });
    } catch (error) {
        console.error('Error fetching annual sales:', error);
        res.status(500).json({ error: 'Failed to fetch annual sales data' });
    }
};

exports.getMedicineSalesDistribution = async (req, res) => {
    try {
        const medicineSales = await Sales.aggregate([
            { $unwind: "$medicines" },
            {
                $group: {
                    _id: "$medicines.name",
                    totalQuantity: { $sum: "$medicines.qty_sold" },
                    totalRevenue: { $sum: "$medicines.totalprice" }
                }
            },
            { $sort: { totalQuantity: -1 } }
        ]);

        const totalSales = medicineSales.reduce((acc, med) => acc + med.totalQuantity, 0);
        
        const formattedData = medicineSales.map(medicine => ({
            name: medicine._id,
            quantity: medicine.totalQuantity,
            revenue: medicine.totalRevenue,
            percentage: ((medicine.totalQuantity / totalSales) * 100).toFixed(2)
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching medicine distribution:', error);
        res.status(500).json({ error: 'Failed to fetch medicine sales distribution' });
    }
};
