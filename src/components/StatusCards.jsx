// src/components/StatusCards.jsx
import React from 'react';
import { 
  FileText, CheckCircle, Clock, AlertTriangle, XCircle, 
  HelpCircle, Archive, Shield 
} from 'lucide-react';
import { Tooltip,TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'; // Assuming Radix or simple custom tooltip

const StatusCard = ({ title, count, color, icon: Icon, subtext }) => (
  <div className={`p-4 rounded-xl shadow-sm border border-slate-100 bg-white flex flex-col justify-between hover:shadow-md transition-shadow relative group ${subtext ? 'h-32' : 'h-24'}`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1">
          {title}
          <HelpCircle size={12} className="text-slate-300 cursor-help" />
        </p>
        <span className={`text-2xl font-bold text-${color}-600`}>{count}</span>
      </div>
      <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-500`}>
        <Icon size={20} />
      </div>
    </div>
    {subtext && <p className="text-[10px] text-slate-400 mt-2">{subtext}</p>}
  </div>
);

const StatusCards = ({ data }) => {
  // Calculate Totals based on filtered data
  const totalRisks = data.length;
  const activeRisks = data.filter(r => r.status_monitoring === 'Berjalan' || r.status_monitoring === 'Baru').length;
  const inactiveRisks = totalRisks - activeRisks;

  // Document Status
  const draft = data.filter(r => r.status_dokumen === 'Draft').length;
  const waitingApproval = data.filter(r => r.status_dokumen.includes('Menunggu')).length;
  const revised = data.filter(r => r.status_dokumen.includes('Revisi')).length;

  // Monitoring Status
  const monitoringBaru = data.filter(r => r.status_monitoring === 'Baru').length;
  const monitoringBerjalan = data.filter(r => r.status_monitoring === 'Berjalan').length;
  const monitoringSelesai = data.filter(r => r.status_monitoring === 'Selesai').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
      
      {/* Group 1: Overall */}
      <StatusCard title="Total Risiko" count={totalRisks} color="blue" icon={Shield} subtext={`${activeRisks} Aktif | ${inactiveRisks} Inaktif`} />
      
      {/* Group 2: Document */}
      <StatusCard title="Draft Register" count={draft} color="slate" icon={FileText} />
      <StatusCard title="Menunggu Approval" count={waitingApproval} color="orange" icon={Clock} subtext="Butuh tindakan segera" />
      <StatusCard title="Revisi Dokumen" count={revised} color="red" icon={XCircle} />

      {/* Group 3: Monitoring */}
      <StatusCard title="Monitoring Berjalan" count={monitoringBerjalan} color="emerald" icon={CheckCircle} />
      <StatusCard title="Monitoring Selesai" count={monitoringSelesai} color="teal" icon={Archive} />

    </div>
  );
};

export default StatusCards;
