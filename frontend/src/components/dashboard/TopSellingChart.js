import React from 'react'

const TopSellingChart = () => {
  const medicines = [
    {
      name: 'Xyloric (Hypertension)',
      value: 90,
      color: 'bg-orange-500',
      icon: '💊',
    },
    {
      name: 'Cetzine (Antihistamine)',
      value: 75,
      color: 'bg-black',
      icon: '💊',
    },
    {
      name: 'Diamicron (Diabetes)',
      value: 50,
      color: 'bg-green-400',
      icon: '💊',
    },
  ]

  return (
    <div className="relative h-[300px] flex flex-col justify-end">
      {/* Y-axis labels */}
      <div className="absolute left-0 h-[250px] flex flex-col justify-between text-xs text-gray-500">
        <div>100k</div>
        <div>80k</div>
        <div>60k</div>
        <div>40k</div>
        <div>20k</div>
        <div>10k</div>
      </div>

      {/* Chart Container */}
      <div className="flex justify-around items-end w-full mt-6 ml-6">
        {medicines.map((medicine, index) => (
          <div key={index} className="flex flex-col items-center w-20">
            {/* Bar */}
            <div
              className={`w-16 ${medicine.color} rounded-t-lg flex items-end justify-center`}
              style={{ height: `${medicine.value * 2}px` }} // Adjust height scaling
            >
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm -mb-5">
                <span className="text-lg">{medicine.icon}</span>
              </div>
            </div>
            {/* Labels */}
            <div className="mt-2 text-center">
              <div className="text-xs font-medium text-gray-700">{medicine.name.split(' ')[0]}</div>
              <div className="text-xs text-gray-500">
                {medicine.name.includes('(') ? medicine.name.split('(')[1].replace(')', '') : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopSellingChart
