import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AuditScoreGaugeProps {
  score: number;
}

const AuditScoreGauge: React.FC<AuditScoreGaugeProps> = ({ score }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  let color = '#22c55e'; // Green
  if (score < 50) color = '#ef4444'; // Red
  else if (score < 80) color = '#eab308'; // Yellow

  return (
    <div className="relative w-48 h-48 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
            cornerRadius={10}
            paddingAngle={5}
          >
            <Cell key="cell-score" fill={color} />
            <Cell key="cell-remaining" fill="#e2e8f0" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-4xl font-bold text-slate-800">{score}%</span>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">Overall</span>
      </div>
    </div>
  );
};

export default AuditScoreGauge;
