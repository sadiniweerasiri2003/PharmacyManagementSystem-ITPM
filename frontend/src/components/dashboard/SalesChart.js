import React from 'react'
import { TrendingUpIcon } from 'lucide-react'
const SalesChart = () => {
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  const data = [15, 22, 14, 18, 20, 25, 30, 28, 24, 19, 25, 22]
  const maxValue = Math.max(...data)
  return (
    <div className="relative h-[250px]">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
        <div>25k</div>
        <div>20k</div>
        <div>15k</div>
        <div>10k</div>
        <div>5k</div>
        <div></div>
      </div>
      {/* Chart */}
      <div className="ml-10 h-full flex items-end">
        <div className="flex-1 flex items-end justify-between h-[200px]">
          {data.map((value, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-12 rounded-md ${
                  index === 6
                    ? 'bg-[#0a3833]/20 bg-gradient-to-br from-[#CCFF33]/30 to-[#0a3833]/30 border-2 border-[#CCFF33]'
                    : 'bg-[#0a3833]'
                }`}
                style={{ height: `${(value / maxValue) * 180}px` }}
              ></div>
              <div className="mt-2 text-xs text-gray-500">{months[index]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default SalesChart;