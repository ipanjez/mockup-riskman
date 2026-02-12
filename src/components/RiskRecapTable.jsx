// src/components/RiskRecapTable.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, HelpCircle, Eye, Edit } from 'lucide-react';

const StatusBadge = ({ status }) => {
  let color = 'bg-slate-100 text-slate-600';
  if (status === 'Final' || status === 'Selesai') color = 'bg-emerald-100 text-emerald-700';
  if (status.includes('Menunggu')) color = 'bg-amber-100 text-amber-700';
  if (status.includes('Revisi')) color = 'bg-red-100 text-red-700';
  if (status === 'Berjalan') color = 'bg-blue-100 text-blue-700';

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide ${color}`}>
      {status}
    </span>
  );
};

const RiskRecapTable = ({ data }) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-8">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          Rekapitulasi Risiko
          <HelpCircle size={16} className="text-slate-400 cursor-help" />
        </h3>
        <div className="text-xs text-slate-500">
          Showing {((page - 1) * itemsPerPage) + 1} - {Math.min(page * itemsPerPage, data.length)} of {data.length}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-3">Kode & Sasaran</th>
              <th className="px-6 py-3">Risiko & Penyebab</th>
              <th className="px-6 py-3 text-center">Inherent</th>
              <th className="px-6 py-3 text-center">Residual</th>
              <th className="px-6 py-3">Biaya Mitigasi</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((risk) => (
                <tr key={risk.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 max-w-xs">
                    <div className="font-mono text-xs text-blue-600 font-bold mb-1">{risk.kode_risiko}</div>
                    <div className="text-slate-800 font-medium truncate" title={risk.sasaran}>{risk.sasaran}</div>
                    <div className="text-xs text-slate-500 truncate">{risk.unit_kerja}</div>
                  </td>
                  <td className="px-6 py-4 max-w-sm">
                    <div className="font-medium text-slate-800 mb-1">{risk.risiko}</div>
                    <div className="text-xs text-slate-500 line-clamp-2" title={risk.sebab}>{risk.sebab}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className={`
                      inline-flex items-center justify-center w-8 h-8 rounded font-bold text-xs
                      ${(risk.inherent_likelihood * risk.inherent_consequence) >= 16 ? 'bg-red-100 text-red-700' : 
                        (risk.inherent_likelihood * risk.inherent_consequence) >= 10 ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-emerald-100 text-emerald-700'}
                    `}>
                      {risk.inherent_likelihood * risk.inherent_consequence}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className={`
                      inline-flex items-center justify-center w-8 h-8 rounded font-bold text-xs
                      ${(risk.residual_likelihood * risk.residual_consequence) >= 16 ? 'bg-red-100 text-red-700' : 
                        (risk.residual_likelihood * risk.residual_consequence) >= 10 ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-emerald-100 text-emerald-700'}
                    `}>
                      {risk.residual_likelihood * risk.residual_consequence}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-700">
                        {risk.biaya_mitigasi > 0 ? `Rp ${(risk.biaya_mitigasi / 1000000).toLocaleString()} Jt` : '-'}
                      </span>
                      {risk.biaya_mitigasi > 0 && <span className="text-[10px] text-slate-400 uppercase">{risk.tipe_biaya}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col gap-1">
                        <StatusBadge status={risk.status_dokumen} />
                        <StatusBadge status={risk.status_monitoring} />
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-slate-200 rounded text-slate-500"><Eye size={16}/></button>
                      <button className="p-1.5 hover:bg-blue-100 rounded text-blue-600"><Edit size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-slate-400 italic">No risks found for current filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
         <button 
           disabled={page === 1}
           onClick={() => setPage(p => Math.max(1, p - 1))}
           className="p-1 rounded hover:bg-white border border-transparent hover:border-slate-200 disabled:opacity-30"
         >
            <ChevronLeft size={16} />
         </button>
         <button 
           disabled={page === totalPages}
           onClick={() => setPage(p => Math.min(totalPages, p + 1))}
           className="p-1 rounded hover:bg-white border border-transparent hover:border-slate-200 disabled:opacity-30"
         >
            <ChevronRight size={16} />
         </button>
      </div>
    </div>
  );
};

export default RiskRecapTable;
