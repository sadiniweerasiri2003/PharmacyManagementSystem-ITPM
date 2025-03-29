import React from 'react'
import { MoreVerticalIcon } from 'lucide-react'
const MetricCard = ({
  title,
  value,
  change,
  period,
  icon,
  iconBgColor,
  iconColor,
  changeColor,
}) => {
  return (
    <div className="bg-[#0a3833] text-white rounded-lg p-6 relative">
      <div className="flex justify-between items-start mb-8">
        <div className={`w-10 h-10 ${iconBgColor} ${iconColor} rounded-md flex items-center justify-center`}>
          {icon}
        </div>
        <button className="text-white/70 hover:text-white">
          <MoreVerticalIcon size={20} />
        </button>
      </div>
      <div>
        <h3 className="text-white/80 font-medium mb-1">{title}</h3>
        <div className="text-3xl font-semibold mb-2">{value}</div>
        <div className="flex items-center text-sm">
          <span className={`${changeColor} mr-1 font-medium`}>{change}</span>
          <span className="text-white/70">{period}</span>
        </div>
      </div>
    </div>
  )
}
export default MetricCard;