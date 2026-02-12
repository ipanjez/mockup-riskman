// src/components/RiskMap.jsx
import React, { useMemo, useState } from 'react';
import { HelpCircle, ChevronRight, X } from 'lucide-react';
import { MATRIX_COLOR } from '../data/dummyData';

const RiskMap = ({ data, title }) => {
  const [selectedCell, setSelectedCell] = useState(null);

  // Group risks by coordinate
  const coordinateData = useMemo(() => {
    const map = {};
    for (let l = 1; l <= 5; l++) {
      for (let c = 1; c <= 5; c++) {
        map[`${l}-${c}`] = [];
      }
    }

    data.forEach(risk => {
      // Use inherent or residual based on title/prop (default inherent)
      let l, c;
      if (title.includes("Residual")) {
        l = risk.residual_likelihood;
        c = risk.residual_consequence;
      } else {
        l = risk.inherent_likelihood;
        c = risk.inherent_consequence;
      }
      if (map[`${l}-${c}`]) {
        map[`${l}-${c}`].push(risk);
      }
    });
    return map;
  }, [data, title]);

  const getColorClass = (key) => {
    const color = MATRIX_COLOR[key]; 
    if (color === 'green') return 'bg-emerald-100 hover:bg-emerald-200 border-emerald-300 text-emerald-800';
    if (color === 'yellow') return 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300 text-yellow-800';
    if (color === 'red') return 'bg-red-100 hover:bg-red-200 border-red-300 text-red-800';
    return 'bg-gray-50';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          {title}
          <div className="group relative">
             <HelpCircle size={16} className="text-slate-400 cursor-help" />
             <div className="absolute hidden group-hover:block w-64 bg-slate-800 text-white text-xs p-2 rounded z-50 left-0 top-6">
                Matriks ini memetakan risiko berdasarkan probabilitas (Likelihood) dan dampak (Consequence).
             </div>
          </div>
        </h3>
      </div>

      <div className="relative">
        {/* Y Axis Label */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-bold text-slate-400 tracking-widest">
            LIKELIHOOD
        </div>

        {/* Matrix Grid 5x5 */}
        <div className="grid grid-cols-5 gap-1 ml-6 mb-6">
           {/* Rows 5 down to 1 */}
           {[5, 4, 3, 2, 1].map(l => (
             <React.Fragment key={l}>
                {[1, 2, 3, 4, 5].map(c => {
                  const key = `${l}-${c}`;
                  const risks = coordinateData[key];
                  const count = risks.length;
                  return (
                    <div 
                      key={key}
                      onClick={() => count > 0 && setSelectedCell({key, risks})}
                      className={`
                        aspect-square flex items-center justify-center rounded-md border 
                        font-bold text-lg cursor-pointer transition-colors relative
                        ${getColorClass(key)}
                        ${count === 0 ? 'opacity-40 cursor-default' : ''}
                      `}
                    >
                      {count > 0 ? count : ''}
                    </div>
                  );
                })}
             </React.Fragment>
           ))}
        </div>
        
        {/* X Axis Label */}
        <div className="text-center text-[10px] font-bold text-slate-400 tracking-widest mt-2 ml-6">
            CONSEQUENCE
        </div>
      </div>

       {/* Simple Modal for Cell Details */}
      {selectedCell && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                 <h4 className="font-bold">Detail Risiko (Sel {selectedCell.key})</h4>
                 <button onClick={() => setSelectedCell(null)}><X size={20}/></button>
              </div>
              <div className="p-4 overflow-y-auto">
                 <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600">
                        <th className="p-2">Kode</th>
                        <th className="p-2">Risiko</th>
                        <th className="p-2">Unit Kerja</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCell.risks.map(r => (
                        <tr key={r.id} className="border-t">
                          <td className="p-2 font-mono text-xs">{r.kode_risiko}</td>
                          <td className="p-2">{r.risiko}</td>
                          <td className="p-2 text-slate-500">{r.unit_kerja}</td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default RiskMap;
