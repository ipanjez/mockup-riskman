// src/components/ChartsSection.jsx
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  Cell
} from 'recharts';
import { HelpCircle } from 'lucide-react';

const COLORS = {
  Low: '#10B981', // emerald-500
  Moderate: '#F59E0B', // amber-500
  High: '#EF4444', // red-500
};

const ChartsSection = ({ data }) => {
  const [dimension, setDimension] = useState('sasaran'); // sasaran, aktivitas, taksonomi
  
  // Prepare Data for Risk Level Chart
  const processRiskLevelData = () => {
    const raw = {};

    data.forEach(risk => {
      // Determine the bucket level (Simplified logic)
      let level = 'Low';
      const score = risk.inherent_likelihood * risk.inherent_consequence;
      if (score >= 10 && score < 16) level = 'Moderate';
      if (score >= 16) level = 'High';

      const key = risk[dimension] || 'Uncategorized';
      
      if (!raw[key]) {
        raw[key] = { name: key, Low: 0, Moderate: 0, High: 0 };
      }
      raw[key][level] += 1;
    });

    return Object.values(raw);
  };

  const riskLevelData = processRiskLevelData();

  // Prepare Data for Mitigation Cost
  const processCostData = () => {
      const raw = {
        CAPEX: { name: 'CAPEX', value: 0 },
        OPEX: { name: 'OPEX', value: 0 }
      };

      data.forEach(risk => {
          if (risk.biaya_mitigasi) {
              const type = risk.tipe_biaya || 'OPEX';
              raw[type].value += risk.biaya_mitigasi;
          }
      });

      return [raw.CAPEX, raw.OPEX];
  };
  
  const costData = processCostData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
      {/* Risk Level Analysis */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">Analisis Level Risiko</h3>
            <HelpCircle size={16} className="text-slate-400" />
          </div>
          
          <select 
            className="text-xs border p-1 rounded bg-slate-50"
            value={dimension}
            onChange={(e) => setDimension(e.target.value)}
          >
            <option value="sasaran">Sasaran</option>
            <option value="aktivitas">Aktivitas</option>
            <option value="unit_kerja">Unit Kerja</option>
          </select>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={riskLevelData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={10} tick={{fill: '#64748b'}} />
              <YAxis fontSize={10} tick={{fill: '#64748b'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Bar dataKey="Low" stackId="a" fill={COLORS.Low} radius={[0, 0, 4, 4]} />
              <Bar dataKey="Moderate" stackId="a" fill={COLORS.Moderate} />
              <Bar dataKey="High" stackId="a" fill={COLORS.High} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mitigation Cost Analysis */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">Analisis Biaya Mitigasi</h3>
            <HelpCircle size={16} className="text-slate-400" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 h-64">
             {/* Total Cost Display */}
             <div className="text-center md:text-left">
                <p className="text-sm text-slate-500">Total Rencana Biaya</p>
                <p className="text-3xl font-black text-slate-800">
                    Rp {((costData[0].value + costData[1].value) / 1000000000).toFixed(1)} M
                </p>
                <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        CAPEX: Rp {(costData[0].value / 1000000).toFixed(0)} Jt
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                        OPEX: Rp {(costData[1].value / 1000000).toFixed(0)} Jt
                    </div>
                </div>
             </div>

             {/* Simple Bar for Visual */}
             <div className="h-full w-full md:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" fontSize={10} width={50} />
                        <Tooltip formatter={(value) => `Rp ${value.toLocaleString()}`} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {costData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#22d3ee'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
             </div>
        </div>
      </div>

    </div>
  );
};

export default ChartsSection;
