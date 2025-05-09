import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const BarChartComponent = ({ data }) => {
  return (
    <div className="bg-white p-8 shadow-xl rounded-2xl mb-8 w-full hover:shadow-2xl transition-shadow">
      <h2 className="text-2xl font-bold mb-6 text-[#1B5E20]">Stock Overview</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            stroke="#1B5E20" 
            tick={{ fill: '#1B5E20' }}
            axisLine={{ stroke: '#1B5E20' }}
          />
          <YAxis 
            stroke="#1B5E20"
            tick={{ fill: '#1B5E20' }}
            axisLine={{ stroke: '#1B5E20' }}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(27, 94, 32, 0.1)' }}
            contentStyle={{ 
              backgroundColor: '#fff',
              border: '2px solid #1B5E20',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
            labelStyle={{ color: '#1B5E20', fontWeight: 600 }}
            itemStyle={{ color: '#1B5E20' }}
          />
          <Bar 
            dataKey="quantity" 
            fill="#1B5E20"
            radius={[8, 8, 0, 0]}
            maxBarSize={80}
            animationDuration={1000}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
