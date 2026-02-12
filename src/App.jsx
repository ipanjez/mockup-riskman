import React, { useState, useMemo, useEffect } from 'react';
import { 
  Menu, 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Settings, 
  FileText, 
  PieChart,
  Search, 
  ExternalLink, 
  LayoutDashboard, 
  AlertTriangle, 
  Clock, 
  X,
  Info,
  BarChart3,
  HelpCircle,
  Calendar,
  ArrowUpDown,
  Filter,
  Download,
  Bell,
  FileSpreadsheet,
  User,
  Users,
  Shield,
  BookOpen,
  Database,
  ChevronDown,
  Layers,
  Activity,
  CheckCircle,
  Activity as ActivityIcon
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

// --- COMPONENTS ---
const InfoTooltip = ({ text }) => (
  <div className="group relative inline-flex items-center ml-1.5 align-middle">
    <HelpCircle size={14} className="text-slate-400 cursor-help hover:text-blue-500 transition-colors" />
    <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-[10px] leading-relaxed rounded-lg shadow-xl z-50 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none text-left font-normal normal-case tracking-normal">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

// --- DATA GENERATOR ---
const generateDummyData = () => {
    const units = ['Departemen Lingkungan Hidup', 'Departemen K3', 'Departemen Operasi', 'Departemen HR', 'Departemen Keuangan', 'Departemen IT'];
    const types = ['OPERASIONAL', 'STRATEGIS', 'PROYEK', 'ISO 27001 SMKI'];
    const statuses = [
        'Draft', 'Revisi', 'Revisi Monitoring', 
        'Menunggu Approval VP Unit Kerja', 'Menunggu Approval SVP Unit Kerja', 
        'Menunggu Approval Staff MRK', 'Menunggu Approval VP MRK', 'Menunggu Approval SVP TKMR',
        'Menunggu Approval Monitoring VP Unit Kerja', 'Menunggu Approval Monitoring SVP Unit Kerja',
        'Menunggu Approval Monitoring Staff MRK', 'Menunggu Approval Monitoring VP MRK',
        'Baru', 'Berjalan', 'Selesai'
    ];
    const periods = ['2025', '2026'];
    const sasaranGenerik = ['Hukum, Reputasi dan Kepatuhan', 'Keuangan', 'Operasional', 'Pasar dan Makroekonomi', 'Proyek', 'Strategis', 'Teknologi dan Keamanan Siber'];
    
    // Palet warna untuk risiko
    const colors = [
        'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 
        'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 
        'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500'
    ];

    return Array.from({ length: 200 }, (_, i) => {
        const type = types[Math.floor(Math.random() * types.length)];
        const unit = units[Math.floor(Math.random() * units.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const period = periods[Math.floor(Math.random() * periods.length)];
        const category = sasaranGenerik[Math.floor(Math.random() * sasaranGenerik.length)];
        
        // Generate Scores
        const inL = Math.ceil(Math.random() * 5);
        const inC = Math.ceil(Math.random() * 5);
        const resL = Math.max(1, inL - Math.floor(Math.random() * 3));
        const resC = Math.max(1, inC - Math.floor(Math.random() * 2));
        const tarL = Math.max(1, resL - 1);
        const tarC = Math.max(1, resC - 1);

        // Monitoring Data (Randomized for 12 months)
        const monitoring = {};
        ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agt', 'sep', 'okt', 'nov', 'des'].forEach(m => {
            if (Math.random() > 0.3) { // 70% chance to have data
                monitoring[m] = { 
                    l: Math.max(1, resL - (Math.random() > 0.8 ? 1 : 0)), 
                    c: Math.max(1, resC - (Math.random() > 0.8 ? 1 : 0)) // Random improvement
                };
            }
        });

        return {
            id: i + 1,
            code: `R-${period.substring(2)}.${(i + 1).toString().padStart(3, '0')}`,
            color: colors[i % colors.length],
            desc: `Risiko terkait ${type.toLowerCase()} - ${category} pada ${unit} - Isu #${i + 1}`,
            cause: `Penyebab teknis atau non-teknis yang teridentifikasi pada audit ${period}`,
            impact: `Dampak potensial terhadap operasional dan finansial sebesar Rp ${(Math.random() * 10).toFixed(1)} M`,
            status,
            jenisRisiko: type,
            kategoriRisiko: category,
            unitKerja: unit,
            kompartemen: unit.includes('Operasi') ? 'Kompartemen Operasi' : 'Kompartemen Pendukung',
            periode: period,
            owner: `User ${Math.floor(Math.random() * 50) + 1}`, // Simulated Owner ID
            inherent: { l: inL, c: inC },
            residual: { l: resL, c: resC },
            target: { l: tarL, c: tarC },
            monitoring,
            biaya: Math.floor(Math.random() * 5000000000) // 0 - 5 M
        };
    });
};

const App = () => {
    const [activeTab, setActiveTab] = useState('Dashboard Admin');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    React.useEffect(() => { const t = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(t); }, []);
    const formatDate = (d) => d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const formatTime = (d) => d.toLocaleTimeString('id-ID', { hour12: false }).replace(/\./g, ':');

  const [selectedCellData, setSelectedCellData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [hoveredRiskId, setHoveredRiskId] = useState(null); // Synced highlight state for all matrices

  // State untuk Sorting & Filtering
  const [sortConfig, setSortConfig] = useState({ key: 'code', direction: 'asc' });
  const [columnFilters, setColumnFilters] = useState({
    code: '',
    description: '',
    status: '',
    cause: '',
    impact: ''
  });

  // Helper level risiko
  const getLevelLabel = (score) => {
    if (!score) return '-';
    if (score >= 20) return 'High';
    if (score >= 15) return 'Moderate to High';
    if (score >= 8) return 'Moderate';
    if (score >= 4) return 'Low to Moderate';
    return 'Low';
  };

  // Helper warna level
  const getLevelColorClass = (label) => {
    switch (label) {
      case 'High': return 'text-red-700 bg-red-100 border-red-200';
      case 'Moderate to High': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'Moderate': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'Low to Moderate': return 'text-lime-700 bg-lime-100 border-lime-200';
      case 'Low': return 'text-green-700 bg-green-100 border-green-200';
      default: return 'text-slate-400 bg-slate-50 border-slate-200';
    }
  };

  // --- DATA & STATE ---
  const [currentUser, setCurrentUser] = useState({ 
      id: 'User 1', 
      role: 'Superadmin', // Options: Superadmin, Karyawan, AVP, VP, SVP, PIC SISMEN
      name: 'Farhan Jezando', 
      unit: 'Departemen K3', 
      kompartemen: 'Kompartemen Operasi',
      assignedRiskTypes: ['ISO 27001 SMKI'] // For PIC SISMEN
  });
  
  const [filters, setFilters] = useState({ 
      jenis: 'Semua Jenis', 
      periode: 'Semua Periode', 
      unit: 'Semua Departemen',
      chartCategory: 'Sasaran Generik' // For the chart x-axis
  });
  
  const [rawData] = useState(() => generateDummyData());
    
  // --- FILTERING LOGIC ---
  const risksList = useMemo(() => {
      return rawData.filter(item => {
          // 1. Basic Filters
          const matchesJenis = filters.jenis === 'Semua Jenis' || item.jenisRisiko === filters.jenis;
          const matchesPeriode = filters.periode === 'Semua Periode' || item.periode === filters.periode;
          const matchesUnit = filters.unit === 'Semua Departemen' || item.unitKerja === filters.unit;
          
          // 2. RBAC & Hierarchy Logic
          let hasAccess = false;

          if (['Superadmin', 'Admin MRK'].includes(currentUser.role)) {
              hasAccess = true;
          } else if (currentUser.role === 'Karyawan') {
              hasAccess = item.owner === currentUser.id;
          } else if (currentUser.role === 'AVP') {
              hasAccess = item.unitKerja === currentUser.unit;
          } else if (currentUser.role === 'VP') {
              // VP sees their unit + everything below (Assuming Unit represents the VP's area)
              hasAccess = item.unitKerja === currentUser.unit; 
          } else if (currentUser.role === 'SVP') {
              // SVP sees their Kompartemen
              hasAccess = item.kompartemen === currentUser.kompartemen;
          } else if (currentUser.role === 'PIC SISMEN') {
              hasAccess = currentUser.assignedRiskTypes.includes(item.jenisRisiko);
          }

          return matchesJenis && matchesPeriode && matchesUnit && hasAccess;
      });
  }, [rawData, filters, currentUser]);

  // Data for Charts (Updated for dynamic Category)
  const chartData = useMemo(() => {
      // Group by Category (Sasaran Generik, etc)
      const grouped = {};
      
      risksList.forEach(r => {
          // Use the selected category field. For now simply mapping 'Sasaran Generik' -> 'kategoriRisiko'
          // In a real app, you might have different fields for 'Aktivitas Generik', etc.
          const key = r.kategoriRisiko || 'Other'; 
          
          if (!grouped[key]) grouped[key] = { name: key, High: 0, Moderate: 0, Low: 0 };
          
          const score = r.residual.l * r.residual.c;
          if (score >= 15) grouped[key].High++;
          else if (score >= 8) grouped[key].Moderate++; // Changed logic to match standard risk matrix somewhat
          else grouped[key].Low++;
      });

      return Object.values(grouped);
  }, [risksList, filters.chartCategory]);

  // --- LOGIC TAMBAHAN DEPENDENT ON RISKS LIST ---

  // 1. Notifikasi Risiko Belum Target (Moved after risksList definition)
  const pendingRisks = useMemo(() => {
    return risksList.filter(r => {
        const residualScore = r.residual.l * r.residual.c;
        const targetScore = r.target.l * r.target.c;
        return residualScore > targetScore;
    });
  }, [risksList]);
  
  // Real Counts for Stats
  const activeRisksCount = useMemo(() => risksList.filter(r => r.status !== 'Selesai').length, [risksList]);
  const inactiveRisksCount = useMemo(() => risksList.filter(r => r.status === 'Selesai').length, [risksList]);
  const highRisksCount = useMemo(() => ({
     inherent: risksList.filter(r => (r.inherent.l * r.inherent.c) >= 20).length,
     residual: risksList.filter(r => (r.residual.l * r.residual.c) >= 20).length,
     target: risksList.filter(r => (r.target.l * r.target.c) >= 20).length
  }), [risksList]);

  // 3. Export Excel (Moved after risksList definition)
  const handleExportExcel = () => {
    const headers = ['Kode', 'Risiko', 'Sebab', 'Dampak', 'Status', 'Inherent Level', 'Residual Level', 'Target Level'];
    const rows = risksList.map(r => {
        return [
            r.code, 
            `"${r.desc.replace(/"/g, '""')}"`,
            `"${r.cause.replace(/"/g, '""')}"`,
            `"${r.impact.replace(/"/g, '""')}"`,
            r.status,
            r.inherent.l * r.inherent.c,
            r.residual.l * r.residual.c,
            r.target.l * r.target.c
        ].join(";");
    });

    const csvContent = "sep=;\n" + headers.join(";") + "\n" + rows.join("\n");
    const encodedUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Risk_Data_Admin.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMonitoringExport = () => {
    const monthKeys = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agt', 'sep', 'okt', 'nov', 'des'];
    
    // Header setup
    let headers = [
      'Kode', 'Pernyataan Risiko', 'Sebab', 'Dampak', 'Status',
      'Inherent L', 'Inherent C', 'Inherent Score', 'Inherent Level',
      'Residual L', 'Residual C', 'Residual Score', 'Residual Level',
      'Target L', 'Target C', 'Target Score', 'Target Level'
    ];
    
    // Add month headers
    monthKeys.forEach(m => {
      const label = m.toUpperCase();
      headers.push(`${label} L`, `${label} C`, `${label} Score`, `${label} Level`);
    });

    const rows = risksList.map(r => {
            const monitoring = r.monitoring || {};
            let row = [
                r.code, 
                `"${r.desc.replace(/"/g, '""')}"`,
                `"${r.cause.replace(/"/g, '""')}"`,
                `"${r.impact.replace(/"/g, '""')}"`,
                r.status,
            ];
            
            // Baselines
            ['inherent', 'residual', 'target'].forEach(type => {
               const d = r[type];
               const score = d.l * d.c;
               row.push(d.l, d.c, score, getLevelLabel(score));
            });
            
            // Months
            monthKeys.forEach(m => {
               const d = monitoring[m];
               if (d) {
                  const score = d.l * d.c;
                  row.push(d.l, d.c, score, getLevelLabel(score));
               } else {
                  row.push('-', '-', '-', '-');
               }
            });
            
            return row.join(";");
    });
        
    const csvContent = "sep=;\n" + headers.join(";") + "\n" + rows.join("\n");
    const encodedUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Monitoring_Risiko_2026_Full.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const monthKeys = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agt', 'sep', 'okt', 'nov', 'des'];

  // Fill in monitoring data for 2026
  const tableData = risksList; 

  const filteredTable = useMemo(() => {
    let result = [...tableData].filter(item => {
      return (
        item.code.toLowerCase().includes(columnFilters.code.toLowerCase()) &&
        item.desc.toLowerCase().includes(columnFilters.description.toLowerCase()) &&
        item.cause.toLowerCase().includes(columnFilters.cause.toLowerCase()) &&
        item.impact.toLowerCase().includes(columnFilters.impact.toLowerCase()) &&
        (columnFilters.status === '' || item.status === columnFilters.status)
      );
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [columnFilters, sortConfig, tableData]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleStatusClick = (statusLabel) => {
    setSelectedCellData({
      title: `Risiko Berstatus: ${statusLabel}`,
      subtitle: `Menampilkan daftar risiko dalam tahap ${statusLabel}`,
      risks: risksList.filter(r => r.status === statusLabel).map(r => ({ id: r.id, code: r.code, desc: r.desc }))
    });
    setShowModal(true);
  };

  const handleHighTotalClick = (type) => {
    setSelectedCellData({
      title: `Risiko High (${type.toUpperCase()})`,
      subtitle: `Daftar risiko dengan Skala >= 20 pada kategori ${type}`,
      risks: risksList.filter(r => (r[type].l * r[type].c) >= 20).map(r => ({ id: r.id, code: r.code, desc: r.desc }))
    });
    setShowModal(true);
  };


  const handleLevelClick = (label, type) => {
     // Filter risks by level for the specific matrix type
     const risksInLevel = risksList.filter(risk => {
        const coord = risk[type];
        const score = coord.l * coord.c;
        return getLevelLabel(score) === label;
     });

     setSelectedCellData({
       title: `Risiko Level ${label} (${type.toUpperCase()})`,
       subtitle: `Daftar risiko kategori ${label} pada peta ${type}`,
       risks: risksInLevel
     });
     setShowModal(true);
  };

  // Matrix Component
  const RiskMatrix = ({ title, type, data }) => {
    const list = data || risksList;
    const rows = [5, 4, 3, 2, 1];
    const cols = [1, 2, 3, 4, 5];

    const getCellColor = (r, c) => {
      const sum = r + c;
      if (sum >= 9) return 'bg-red-600/10';
      if (sum >= 7) return 'bg-orange-500/10';
      if (sum >= 6) return 'bg-yellow-400/10';
      if (sum >= 4) return 'bg-green-400/10';
      return 'bg-green-700/10';
    };

    const levelCounts = list.reduce((acc, risk) => {
      const coord = risk[type];
      const label = getLevelLabel(coord.l * coord.c);
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {});

    const handleCellClick = (r, c) => {
      const risksInCell = list.filter(risk => risk[type].l === r && risk[type].c === c);
      if (risksInCell.length > 0) {
        setSelectedCellData({
          title: `Risiko ${title} (Level ${r}x${c})`,
          subtitle: `Detail risiko pada matriks ${title} - Likelihood ${r}, Consequence ${c}`,
          risks: risksInCell
        });
        setShowModal(true);
      }
    };

    return (
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide text-sm">
            <AlertTriangle size={18} className="text-blue-600" />
            Peta Risiko {title}
            <InfoTooltip text={`Matriks distribusi risiko ${title}. Sumbu vertikal = Kemungkinan (Likelihood), Sumbu horizontal = Dampak (Consequence). Klik sel untuk detail.`} />
          </h3>
          <HelpCircle size={16} className="text-slate-300" />
        </div>
        
        <div className="flex-grow flex flex-col justify-center mb-6">
          <div className="relative">
            <div className="absolute -left-8 top-1/2 -rotate-90 origin-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Likelihood</div>
            <div className="grid grid-cols-5 gap-1 ml-4 border border-slate-200 p-0.5 bg-slate-50">
              {rows.map(r => cols.map(c => {
                const risksInCell = list.filter(risk => risk[type].l === r && risk[type].c === c);
                const hasRisks = risksInCell.length > 0;
                return (
                  <div 
                    key={`${r}-${c}`} 
                    onClick={() => hasRisks && handleCellClick(r, c)}
                    className={`h-14 w-full flex flex-wrap gap-1 p-1 items-center justify-center rounded-sm border border-white relative transition-all ${getCellColor(r, c)} ${hasRisks ? 'cursor-pointer hover:brightness-95 hover:scale-105 z-10' : ''}`}
                  >
                    {risksInCell.slice(0, 4).map(risk => (
                      <div 
                        key={risk.id} 
                        className={`w-3.5 h-3.5 rounded-full ${risk.color} shadow-sm border border-white relative group transition-all duration-300`}
                        title={risk.code}
                      >
                      </div>
                    ))}
                    {risksInCell.length > 4 && <span className="text-[8px] font-black text-slate-500">+{risksInCell.length - 4}</span>}
                  </div>
                );
              }))}
            </div>
            <div className="text-center mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Consequence</div>
          </div>
        </div>
        
        {/* RINGKASAN JUMLAH RISIKO */}
        <div className="mt-auto border-t pt-4">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Ringkasan Level (Klik untuk Detail):</p>
           <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {['High', 'Moderate to High', 'Moderate', 'Low to Moderate', 'Low'].map(lvl => (
                <button key={lvl} onClick={() => handleLevelClick(lvl, type)} className="flex items-center justify-between text-[10px] w-full hover:bg-slate-50 p-1 rounded transition-colors group">
                  <div className="flex items-center gap-1.5">
                     <div className={`w-2 h-2 rounded-full ${getLevelColorClass(lvl).split(' ')[0]}`}></div>
                     <span className="text-slate-500 font-bold uppercase group-hover:text-blue-600 transition-colors">{lvl}:</span>
                  </div>
                  <span className={`font-black ${getLevelColorClass(lvl).split(' ')[0]}`}>{levelCounts[lvl] || 0}</span>
                </button>
              ))}
           </div>
        </div>
      </div>
    );
  };

  const SidebarItem = ({ icon, label, active = false }) => (
    <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
      <div className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}`}>{icon}</div>
      {sidebarOpen && <span className="text-xs font-bold font-sans tracking-wide whitespace-nowrap">{label}</span>}
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-20 shadow-xl fixed h-full left-0 top-0 overflow-hidden`}>
         {/* Sidebar Header */}
         <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 shrink-0">
            {sidebarOpen && (
               <div className="flex items-center gap-2">
                  <Shield size={24} className="text-blue-600 fill-blue-600" />
                  <span className="text-xl font-black text-slate-800 tracking-tighter">RISK<span className="text-blue-600">MAN</span></span>
               </div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 hover:text-blue-600 shrink-0">
              {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
         </div>

         {/* Sidebar User Profile Section (Only visible when open) */}
         {sidebarOpen && (
            <div className="p-6 border-b border-slate-100 flex flex-col items-center text-center shrink-0">
                <div className="w-16 h-16 rounded-full bg-blue-100 border-4 border-white shadow-lg mb-3 flex items-center justify-center overflow-hidden">
                    {/* Placeholder for Profile Image */}
                    <User size={32} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm leading-tight px-2">Farhan Jezando Wardana</h3>
                <p className="text-[10px] text-slate-400 mt-1">94230665</p>
                <div className="flex items-center gap-1 mt-2">
                    <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Superadmin</span>
                    <span className="bg-slate-200 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-full">+4</span>
                </div>
                
                {/* Department Selector */}
                <div className="w-full mt-4 relative">
                   <select className="w-full text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none appearance-none cursor-pointer hover:border-blue-300 transition-colors text-center truncate pr-8">
                       <option>PIC SISMEN - Departemen Lingkungan Hidup</option>
                   </select>
                   <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {/* Clock */}
                <div className="mt-6 font-mono text-center">
                    <div className="text-3xl font-black text-slate-800 tracking-tight">{formatTime(currentTime)}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{formatDate(currentTime)}</div>
                </div>
            </div>
         )}
         
         {/* Navigation */}
         <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
            {!sidebarOpen && <div className="p-2 flex justify-center"><User size={20} className="text-slate-400" /></div>}
            
            <SidebarItem 
              icon={<div className="p-1"><Home size={18} /></div>} 
              label="Dashboard" 
              active={['Dashboard Admin', 'Informasi Dashboard', 'Individu'].includes(activeTab)} 
              onClick={() => setActiveTab('Dashboard Admin')} 
            />
            
            <div className={`mt-4 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ${!sidebarOpen && 'hidden'}`}>MASTER DATA</div>
            <SidebarItem icon={<div className="p-1"><Database size={18} /></div>} label="Master Data" />
            
            <div className={`mt-4 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ${!sidebarOpen && 'hidden'}`}>USER MANAGEMENT</div>
            <SidebarItem icon={<div className="p-1"><Users size={18} /></div>} label="User Management" />

            <div className={`mt-4 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ${!sidebarOpen && 'hidden'}`}>PENGELOLAAN RISIKO</div>
            <SidebarItem icon={<div className="p-1"><FileText size={18} /></div>} label="Pengelolaan Risiko" />
            <SidebarItem icon={<div className="p-1"><Shield size={18} /></div>} label="Persetujuan Risiko" />
            <SidebarItem icon={<div className="p-1"><BarChart3 size={18} /></div>} label="Monitoring Risiko" />

            <div className={`mt-4 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ${!sidebarOpen && 'hidden'}`}>LAPORAN RISIKO</div>
            <SidebarItem icon={<div className="p-1"><PieChart size={18} /></div>} label="Rekapitulasi MR" />

            <div className={`mt-4 px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 ${!sidebarOpen && 'hidden'}`}>INFORMATION</div>
            <SidebarItem icon={<div className="p-1"><BookOpen size={18} /></div>} label="Knowledge MR" />
         </nav>
      </aside>

      {/* Main Content Wrapper */}
      <div className={`flex-1 flex flex-col h-screen overflow-hidden relative bg-slate-50 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 sticky top-0 shadow-sm shrink-0">
           <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 lg:hidden">
                 <Menu size={20} />
              </button>
              {/* <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-600">Enterprise Risk Management</h1> */}
           </div>
           
           <div className="flex items-center gap-4">
               {/* Role Switcher (Simulasi) */}
               <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1 pr-2">
                   <div className="bg-white shadow-sm border border-slate-100 rounded p-1">
                       <Shield size={14} className="text-blue-600" />
                   </div>
                   <select 
                       value={currentUser.role}
                       onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
                       className="bg-transparent text-xs font-bold text-slate-600 outline-none border-none cursor-pointer"
                   >
                       <option value="admin">Admin</option>
                       <option value="risk_officer">Risk Officer</option>
                       <option value="departemen_head">Dept. Head</option>
                   </select>
               </div>

               <button onClick={() => setShowNotification(true)} className="p-2.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-colors relative">
                 <Bell size={20} />
                 {pendingRisks.length > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>}
               </button>
               <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="text-right hidden md:block">
                       <p className="text-sm font-bold text-slate-800">Farhan Jezando Wardana</p>
                       <p className="text-[10px] text-slate-400 font-medium">94230665</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm overflow-hidden">
                        <User size={20} />
                    </div>
               </div>
           </div>
        </header>
  
        {/* Main Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          
          {/* Top Banner (Only on General Dashboard) */}
          {activeTab === 'Dashboard Admin' && (
             <div className="bg-gradient-to-r from-[#0055AA] to-[#0077EE] rounded-2xl p-6 mb-6 text-white relative overflow-hidden shadow-xl shadow-blue-900/10 flex items-center justify-between min-h-[160px]">
                 {/* Text Content */}
                 <div className="relative z-10 pl-2">
                     <h1 className="text-2xl font-bold mb-2 tracking-tight">Selamat Datang, Farhan Jezando Wardana</h1>
                     <p className="text-blue-100 text-sm font-medium opacity-90 max-w-xl">Aplikasi Sistem Manajemen Risiko Terintegrasi</p>
                     
                     <div className="flex gap-6 mt-8">
                         <button className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Dashboard Admin' ? 'border-white text-white' : 'border-transparent text-blue-200 hover:text-white'}`}>Dashboard Admin</button>
                         <button onClick={() => setActiveTab('Informasi Dashboard')} className="pb-2 text-sm font-bold border-b-2 border-transparent text-blue-200 hover:text-white transition-colors">Informasi Dashboard</button>
                         <button onClick={() => setActiveTab('Individu')} className="pb-2 text-sm font-bold border-b-2 border-transparent text-blue-200 hover:text-white transition-colors">Individu</button>
                     </div>
                 </div>

                 {/* Mascot Placeholder */}
                 <div className="relative z-10 hidden lg:block pr-8">
                      <div className=" p-2 rounded-full">
                           <Shield size={80} className="text-white drop-shadow-xl fill-white/20" />
                      </div>
                 </div>
                 
                 {/* Background Pattern */}
                 <div className="absolute right-0 top-0 h-full w-2/3 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                 <div className="absolute -left-20 -bottom-40 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
             </div>
          )}

          {/* Tabs */}
          {/* Removed sticky tabs to ensure consistency with banner layout */}
  
          {activeTab === 'Dashboard Admin' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* 1. ADVANCED FILTER SECTION */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                    <div className="relative">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                            <Layers size={12} /> Jenis Pengelolaan Risiko
                            <InfoTooltip text="Filter risiko berdasarkan jenis pengelolaannya (ISO, Operasional, Strategis). Opsi yang muncul disesuaikan dengan hak akses user." />
                        </label>
                        <select 
                            value={filters.jenis} 
                            onChange={(e) => setFilters({...filters, jenis: e.target.value, periode: 'Semua Periode'})}
                            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 px-3 py-3 outline-none appearance-none cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        >
                            <option>Semua Jenis</option>
                            <option>OPERASIONAL</option>
                            <option>STRATEGIS</option>
                            <option>PROYEK</option>
                            <option>ISO 27001 SMKI</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 bottom-3.5 text-slate-400 pointer-events-none" />
                    </div>
                    
                    <div className="relative">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                            <Calendar size={12} /> Periode
                            <InfoTooltip text="Filter periode waktu (Tahunan atau Kuartalan). Bergantung pada Jenis Pengelolaan Risiko yang dipilih." />
                        </label>
                        <select 
                            value={filters.periode}
                            onChange={(e) => setFilters({...filters, periode: e.target.value})}
                            disabled={filters.jenis === 'Semua Jenis'}
                            className="w-full bg-slate-50 hover:bg-slate-100 disabled:opacity-60 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 px-3 py-3 outline-none appearance-none cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        >
                            <option>Semua Periode</option>
                            {filters.jenis === 'OPERASIONAL' ? (
                                <>
                                    <option>Q1-2025</option><option>Q2-2025</option><option>Q3-2025</option><option>Q4-2025</option>
                                    <option>Q1-2026</option><option>Q2-2026</option><option>Q3-2026</option><option>Q4-2026</option>
                                </>
                            ) : (
                                <><option>2025</option><option>2026</option></>
                            )}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 bottom-3.5 text-slate-400 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                            <Users size={12} /> Unit Kerja
                            <InfoTooltip text="Filter unit kerja atau departemen pemilik risiko." />
                        </label>
                        <select 
                            value={filters.unit}
                            onChange={(e) => setFilters({...filters, unit: e.target.value})}
                            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 px-3 py-3 outline-none appearance-none cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        >
                            <option>Semua Departemen</option>
                            <option>Departemen Lingkungan Hidup</option>
                            <option>Departemen K3</option>
                            <option>Departemen Operasi</option>
                            <option>Departemen HR</option>
                            <option>Departemen Keuangan</option>
                            <option>Departemen IT</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 bottom-3.5 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* 2. SUMMARY STATISTICS */}
                <div className="space-y-4">
                    {/* Row 1: Totals */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-5 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-between relative overflow-hidden group">
                           <div>
                               <p className="text-xs font-medium text-blue-100 mb-1 flex items-center">
                                   Total Risiko Aktif
                                   <InfoTooltip text="Jumlah risiko yang masih aktif dan memerlukan mitigasi/pemantauan terus-menerus. Risiko dianggap aktif jika belum berstatus 'Selesai'." />
                               </p>
                               <h3 className="text-4xl font-black tracking-tight">{risksList.filter(r => r.status !== 'Selesai').length}</h3>
                           </div>
                           <ActivityIcon size={48} className="text-blue-500 opacity-40 absolute right-4 bottom-[-10px] group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="bg-white border border-slate-200 text-slate-700 p-5 rounded-xl shadow-sm flex items-center justify-between relative overflow-hidden group">
                           <div>
                               <p className="text-xs font-bold text-slate-400 mb-1 flex items-center">
                                   Total Risiko Selesai (Inaktif)
                                   <InfoTooltip text="Jumlah risiko yang telah ditutup atau selesai dimitigasi (Level Residual sudah mencapai Target)." />
                               </p>
                               <h3 className="text-4xl font-black tracking-tight text-slate-800">{risksList.filter(r => r.status === 'Selesai').length}</h3>
                           </div>
                           <CheckCircle size={48} className="text-slate-200 absolute right-4 bottom-[-10px] group-hover:scale-110 transition-transform" />
                        </div>
                    </div>

                    {/* Row 2: Register Statuses */}
                    <div className="overflow-x-auto pb-2">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center">
                            Register Risk Status
                            <InfoTooltip text="Status dokumen pendaftaran risiko baru. Mulai dari Draft hingga berbagai tahapan approval." />
                        </h4>
                        <div className="flex gap-3 min-w-max">
                            {[
                                { l: 'Draft', c: risksList.filter(r => r.status === 'Draft').length, color: 'bg-slate-100 text-slate-600' },
                                { l: 'Revisi', c: risksList.filter(r => r.status === 'Revisi').length, color: 'bg-red-50 text-red-600' },
                                { l: 'Menunggu Approval VP Unit', c: risksList.filter(r => r.status.includes('Approval VP Unit')).length, color: 'bg-orange-50 text-orange-600' },
                                { l: 'Menunggu Approval SVP Unit', c: risksList.filter(r => r.status.includes('Approval SVP Unit')).length, color: 'bg-orange-50 text-orange-600' },
                                { l: 'Menunggu Approval Staff MRK', c: risksList.filter(r => r.status.includes('Approval Staff MRK')).length, color: 'bg-orange-50 text-orange-600' },
                                { l: 'Menunggu Approval VP MRK', c: risksList.filter(r => r.status.includes('Approval VP MRK')).length, color: 'bg-orange-50 text-orange-600' },
                            ].map((stat, i) => (
                                <div key={i} className={`${stat.color} px-4 py-3 rounded-lg border border-transparent hover:border-black/5 transition-all flex flex-col items-center min-w-[120px]`}>
                                    <span className="text-2xl font-black mb-1">{stat.c}</span>
                                    <span className="text-[9px] font-bold text-center uppercase leading-tight opacity-80">{stat.l}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Row 3: Monitoring Statuses */}
                    <div className="overflow-x-auto pb-2">
                         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center">
                             Monitoring Risk Status
                             <InfoTooltip text="Status dokumen pemantauan (monitoring) risiko berkala." />
                         </h4>
                         <div className="flex gap-3 min-w-max">
                            {[
                                { l: 'Baru', c: risksList.filter(r => r.status === 'Baru').length, color: 'bg-blue-50 text-blue-600' },
                                { l: 'Berjalan', c: risksList.filter(r => r.status === 'Berjalan').length, color: 'bg-emerald-50 text-emerald-600' },
                                { l: 'Revisi Monitoring', c: risksList.filter(r => r.status === 'Revisi Monitoring').length, color: 'bg-red-50 text-red-600' },
                                { l: 'Menunggu Appr. Mon. VP', c: risksList.filter(r => r.status.includes('Monitoring VP')).length, color: 'bg-amber-50 text-amber-600' },
                                { l: 'Menunggu Appr. Mon. SVP', c: risksList.filter(r => r.status.includes('Monitoring SVP')).length, color: 'bg-amber-50 text-amber-600' },
                                { l: 'Menunggu Appr. Mon. Staff MRK', c: risksList.filter(r => r.status.includes('Monitoring Staff MRK')).length, color: 'bg-amber-50 text-amber-600' },
                            ].map((stat, i) => (
                                <div key={i} className={`${stat.color} px-4 py-3 rounded-lg border border-transparent hover:border-black/5 transition-all flex flex-col items-center min-w-[120px]`}>
                                    <span className="text-2xl font-black mb-1">{stat.c}</span>
                                    <span className="text-[9px] font-bold text-center uppercase leading-tight opacity-80">{stat.l}</span>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>

                {/* 3. CHART ANALISIS RISIKO (Based on Image 2) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div>
                             <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                <BarChart3 className="text-blue-600" />
                                Level Risiko Berdasarkan Kategori
                                <InfoTooltip text="Grafik distribusi level risiko (High, Moderate, Low) yang dikelompokkan berdasarkan parameter terpilih (Sasaran Generik, Aktivitas Generik, dll)." />
                             </h3>
                             <p className="text-xs text-slate-400 mt-1">Distribusi level risiko residual per kategori yang dipilih.</p>
                        </div>
                        <div className="flex gap-3">
                             <select className="text-[10px] font-bold bg-slate-50 border border-slate-200 rounded px-3 py-2 outline-none">
                                <option>Grade 1-7</option>
                                <option>Checklist TKO</option>
                             </select>
                             <select 
                                value={filters.chartCategory}
                                onChange={(e) => setFilters({...filters, chartCategory: e.target.value})}
                                className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 rounded px-3 py-2 outline-none"
                             >
                                <option value="Sasaran Generik">Sasaran Generik</option>
                                <option value="Aktivitas Generik">Aktivitas Generik</option>
                                <option value="Risiko Generik">Risiko Generik</option>
                                <option value="Taksonomi Risiko">Taksonomi Risiko</option>
                             </select>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} interval={0} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                                <Tooltip 
                                    cursor={{fill: '#f8fafc'}} 
                                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                                />
                                <Legend wrapperStyle={{paddingTop: '20px', fontSize: '12px'}} />
                                <Bar dataKey="High" name="High Risk" stackId="a" fill="#ef4444" barSize={40} radius={[0, 0, 4, 4]} />
                                <Bar dataKey="Moderate" name="Moderate Risk" stackId="a" fill="#eab308" barSize={40} />
                                <Bar dataKey="Low" name="Low Risk" stackId="a" fill="#22c55e" barSize={40} radius={[4, 4, 0, 0]} />
                            </BarChart>
                         </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. RISK MAP (Peta Risiko) & PERCENTAGE COMPLETION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Heatmap (2/3 width) */}
                    <div className="lg:col-span-2">
                        <RiskMatrix title="Peta Risiko Residual (Global)" type="residual" data={risksList} />
                    </div>

                    {/* Completion Stats (1/3 width) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <PieChart size={18} className="text-blue-600" />
                            Kelengkapan Pengisian
                            <InfoTooltip text="Persentase kelengkapan pengisian data risiko per unit kerja/departemen untuk periode aktif." />
                        </h3>
                        
                        <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
                            {['Departemen K3', 'Departemen Lingkungan Hidup', 'Departemen Operasi', 'Departemen HR', 'Departemen IT'].map((dept, i) => {
                                const pct = Math.floor(Math.random() * 40) + 60; // Mock percentage
                                return (
                                    <div key={i}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="font-bold text-slate-600">{dept}</span>
                                            <span className={`font-black ${pct < 80 ? 'text-orange-500' : 'text-green-600'}`}>{pct}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${pct < 80 ? 'bg-orange-400' : 'bg-green-500'}`} style={{width: `${pct}%`}}></div>
                                        </div>
                                        <p className="text-[9px] text-slate-400 mt-1">290 dari 340 Karyawan sudah mengisi</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* 5. MONITORING TABLE */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                   <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                       <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <Layers size={18} className="text-blue-600" />
                          Rekapitulasi (50 Data Teratas)
                          <InfoTooltip text="Daftar 50 risiko teratas yang sesuai dengan kriteria filter. Gunakan Export CSV untuk mengunduh data lengkap." />
                       </h3>
                       <button onClick={handleMonitoringExport} className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-blue-100 flex items-center gap-2">
                          <Download size={14} /> Export CSV
                       </button>
                   </div>
                   <div className="overflow-x-auto max-h-[400px]">
                       <table className="w-full text-left border-collapse">
                          <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 sticky top-0 z-10">
                               <tr>
                                   <th className="p-3 border-b px-4">Kode</th>
                                   <th className="p-3 border-b w-1/3 min-w-[250px]">Pernyataan Risiko</th>
                                   <th className="p-3 border-b text-center">Owner</th>
                                   <th className="p-3 border-b text-center">Inherent</th>
                                   <th className="p-3 border-b text-center">Residual</th>
                                   <th className="p-3 border-b text-center">Action</th>
                               </tr>
                          </thead>
                          <tbody className="text-xs divide-y divide-slate-100 bg-white">
                               {filteredTable.slice(0, 50).map((row, idx) => (
                                   <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                                       <td className="p-3 px-4 font-mono font-bold text-blue-600">{row.code}</td>
                                       <td className="p-3">
                                           <div className="font-bold text-slate-700 mb-1 line-clamp-2">{row.desc}</div>
                                           <div className="flex gap-2">
                                               <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                                    row.status.includes('Draft') ? 'bg-slate-100 text-slate-500' :
                                                    row.status.includes('Appro') ? 'bg-orange-50 text-orange-600' :
                                                    'bg-green-50 text-green-600'
                                                }`}>{row.status}</span>
                                                <span className="text-[9px] text-slate-400 border border-slate-100 px-1 rounded">{row.unitKerja}</span>
                                           </div>
                                       </td>
                                       <td className="p-3 text-center text-[10px] text-slate-500">
                                            {row.owner}
                                       </td>
                                       <td className="p-3 text-center">
                                           <div className={`w-6 h-6 rounded flex items-center justify-center mx-auto text-[10px] font-black text-white ${getLevelColorClass(getLevelLabel(row.inherent.l * row.inherent.c)).replace('text-', 'bg-').split(' ')[1]}`}>
                                               {row.inherent.l * row.inherent.c}
                                           </div>
                                       </td>
                                       <td className="p-3 text-center">
                                           <div className={`w-6 h-6 rounded flex items-center justify-center mx-auto text-[10px] font-black text-white ${getLevelColorClass(getLevelLabel(row.residual.l * row.residual.c)).replace('text-', 'bg-').split(' ')[1]}`}>
                                               {row.residual.l * row.residual.c}
                                           </div>
                                       </td>
                                       <td className="p-3 text-center">
                                           <button className="text-slate-400 hover:text-blue-600 transition-colors"><Settings size={14} /></button>
                                       </td>
                                   </tr>
                               ))}
                          </tbody>
                       </table>
                   </div>
                </div>

                {/* 6. COST SECTION (Biaya Mitigasi) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                     <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Database size={18} className="text-blue-600" />
                        Biaya Mitigasi (2025-2026)
                        <InfoTooltip text="Analisis anggaran biaya mitigasi risiko. Membandingkan Rencana Biaya (OPEX + CAPEX) dengan Realisasi penggunaan anggaran yang berjalan." />
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                         <div>
                             <p className="text-sm font-bold text-slate-500 mb-1">Rencana Biaya Total</p>
                             <p className="text-4xl font-black text-slate-800">Rp 24.5 M</p>
                             <div className="flex gap-4 mt-2 text-xs text-slate-500">
                                 <span>OPEX: <span className="font-bold text-slate-700">Rp 14.2 M</span></span>
                                 <span>CAPEX: <span className="font-bold text-slate-700">Rp 10.3 M</span></span>
                             </div>
                         </div>
                         <div>
                             <div className="flex justify-between text-xs mb-2">
                                 <span className="font-bold text-slate-600">Realisasi (YTD)</span>
                                 <span className="font-bold text-blue-600">32%</span>
                             </div>
                             <div className="h-4 bg-slate-100 rounded-full w-full overflow-hidden">
                                 <div className="h-full bg-blue-600 w-[32%] rounded-full shadow-lg shadow-blue-200"></div>
                             </div>
                             <p className="text-[10px] text-slate-400 mt-2 text-right">Rp 7.8 M terealisasi dari total anggaran.</p>
                         </div>
                     </div>
                </div>

             </div>
          )}

          {activeTab === 'Informasi Dashboard' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Banner Section - Consistent Structure */}
                <div className="bg-gradient-to-r from-[#0055AA] to-[#0077EE] rounded-2xl p-6 mb-6 text-white relative overflow-hidden shadow-xl shadow-blue-900/10 flex items-center justify-between min-h-[160px]">
                     {/* Text Content */}
                     <div className="relative z-10 pl-2">
                         <h1 className="text-2xl font-bold mb-2 tracking-tight">Informasi Dashboard</h1>
                         <p className="text-blue-100 text-sm font-medium opacity-90 max-w-xl">Menampilkan statistik mendalam mengenai profil risiko perusahaan.</p>
                         
                         <div className="flex gap-6 mt-8">
                             <button onClick={() => setActiveTab('Dashboard Admin')} className="pb-2 text-sm font-bold border-b-2 border-transparent text-blue-200 hover:text-white transition-colors">Dashboard Admin</button>
                             <button className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Informasi Dashboard' ? 'border-white text-white' : 'border-transparent text-blue-200 hover:text-white'}`}>Informasi Dashboard</button>
                             <button onClick={() => setActiveTab('Individu')} className="pb-2 text-sm font-bold border-b-2 border-transparent text-blue-200 hover:text-white transition-colors">Individu</button>
                         </div>
                     </div>
    
                     {/* Mascot Placeholder */}
                     <div className="relative z-10 hidden lg:block pr-8">
                          <div className=" p-2 rounded-full">
                               <BarChart3 size={80} className="text-white drop-shadow-xl fill-white/20" />
                          </div>
                     </div>
                     
                     {/* Background Pattern */}
                     <div className="absolute right-0 top-0 h-full w-2/3 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                 </div>

                 <div className="flex flex-col items-center justify-center p-20 text-center">
                    <BarChart3 size={64} className="text-slate-200 mb-4" />
                    <h3 className="text-xl font-bold text-slate-400">Content Informasi Dashboard</h3>
                    <p className="text-slate-400 mt-2">Konten belum tersedia.</p>
                 </div>
             </div>
          )}

          {activeTab === 'Individu' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                 {/* Banner Section - Consistent Structure */}
                 <div className="bg-gradient-to-r from-[#0055AA] to-[#0077EE] rounded-2xl p-6 mb-6 text-white relative overflow-hidden shadow-xl shadow-blue-900/10 flex items-center justify-between min-h-[160px]">
                     {/* Text Content */}
                     <div className="relative z-10 pl-2">
                         <h1 className="text-2xl font-bold mb-2 tracking-tight">Selamat Datang, Administrator!</h1>
                         <p className="text-blue-100 text-sm font-medium opacity-90 max-w-xl">Berikut adalah ringkasan status risiko individu Anda secara real-time. Anda memiliki beberapa risiko dengan status <span className="font-bold text-white bg-white/20 px-1 rounded">High</span> yang memerlukan mitigasi segera.</p>
                         
                         <div className="flex gap-6 mt-8">
                             <button onClick={() => setActiveTab('Dashboard Admin')} className="pb-2 text-sm font-bold border-b-2 border-transparent text-blue-200 hover:text-white transition-colors">Dashboard Admin</button>
                             <button onClick={() => setActiveTab('Informasi Dashboard')} className="pb-2 text-sm font-bold border-b-2 border-transparent text-blue-200 hover:text-white transition-colors">Informasi Dashboard</button>
                             <button className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Individu' ? 'border-white text-white' : 'border-transparent text-blue-200 hover:text-white'}`}>Individu</button>
                         </div>
                     </div>
    
                     {/* Mascot/Stats Placeholder */}
                     <div className="relative z-10 hidden lg:block pr-8">
                           <div className="text-right">
                              <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Total Risiko</p>
                              <p className="text-5xl font-black drop-shadow-lg">{risksList.length}</p>
                           </div>
                     </div>
                     
                     {/* Background Pattern */}
                     <div className="absolute right-0 top-0 h-full w-2/3 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                     <div className="absolute -left-20 -bottom-40 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
                 </div>
  
                 {/* Existing Status Section */}
                 <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                      <Clock size={22} className="text-blue-600" />
                      STATUS RISIKO
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-8 gap-4">
                    
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-white shadow-xl shadow-red-900/10 col-span-2 flex flex-col justify-between relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <AlertTriangle size={80} />
                      </div>
                      <div className="flex items-center justify-between mb-4 relative z-10">
                         <span className="text-[10px] font-black uppercase text-red-100 tracking-widest bg-red-800/30 px-2 py-1 rounded">Total Risiko High</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center relative z-10">
                         <button onClick={() => handleHighTotalClick('inherent')} className="bg-red-800/20 hover:bg-white/20 p-2 rounded-lg transition-all border border-red-500/30">
                            <p className="text-[9px] font-bold text-red-100 uppercase mb-1">Inherent</p>
                            <p className="text-2xl font-black">{highRisksCount.inherent}</p>
                         </button>
                         <button onClick={() => handleHighTotalClick('residual')} className="bg-red-800/20 hover:bg-white/20 p-2 rounded-lg transition-all border border-red-500/30">
                            <p className="text-[9px] font-bold text-red-100 uppercase mb-1">Residual</p>
                            <p className="text-2xl font-black">{highRisksCount.residual}</p>
                         </button>
                         <button onClick={() => handleHighTotalClick('target')} className="bg-red-800/20 hover:bg-white/20 p-2 rounded-lg transition-all border border-red-500/30">
                            <p className="text-[9px] font-bold text-red-100 uppercase mb-1">Target</p>
                            <p className="text-2xl font-black">{highRisksCount.target}</p>
                         </button>
                      </div>
                    </div>
        
                    {['Draft', 'Revisi', 'Berjalan', 'Selesai'].map((lbl, i) => (
                      <button key={i} onClick={() => handleStatusClick(lbl)} className="p-5 rounded-2xl bg-white border border-slate-100 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 transition-all text-left flex flex-col gap-2 group">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">{lbl}</span>
                          <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-500" />
                        </div>
                        <div className="mt-auto">
                          <span className="text-3xl font-black text-slate-800 tracking-tight">{risksList.filter(r => r.status === lbl).length}</span>
                          <p className="text-[9px] text-slate-400 font-medium">Dokumen</p>
                        </div>
                      </button>
                    ))}
        
                    <button onClick={() => handleStatusClick('Aktif')} className="p-5 rounded-2xl bg-white border border-blue-200 shadow-lg shadow-blue-100 hover:shadow-xl hover:-translate-y-1 transition-all text-left flex flex-col gap-2 group col-span-1">
                      <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit">Total Aktif</span>
                      <div className="mt-auto">
                        <span className="text-3xl font-black text-slate-800">{activeRisksCount}</span>
                        <p className="text-[9px] text-slate-400 font-medium">Risiko Aktif</p>
                      </div>
                    </button>

                    <button className="p-5 rounded-2xl bg-slate-100 border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all text-left flex flex-col gap-2 group col-span-1">
                      <span className="text-[10px] font-black uppercase text-slate-500 bg-slate-200 px-2 py-1 rounded w-fit">Total Inaktif</span>
                      <div className="mt-auto">
                        <span className="text-3xl font-black text-slate-600">{inactiveRisksCount}</span>
                        <p className="text-[9px] text-slate-400 font-medium">Risiko Inaktif</p>
                      </div>
                    </button>
                  </div>
                 </section>
  
                 {/* Matrix Section */}
                 <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                   <RiskMatrix title="Inherent" type="inherent" />
                   <RiskMatrix title="Residual" type="residual" />
                   <RiskMatrix title="Target" type="target" />
                 </section>
  
                 {/* Monitoring Table 2026 */}
                 <section className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col relative">
                   <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-20 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Calendar size={20} /></div>
                       <div>
                         <h2 className="text-lg font-black text-slate-800 uppercase leading-none">REKAP RISIKO</h2>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Periode Tahun 2026</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <button onClick={handleMonitoringExport} className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg border border-green-200 hover:bg-green-100 hover:shadow-sm transition-all text-[10px] font-black uppercase">
                          <Download size={14} /> Export CSV
                        </button>
                     </div>
                   </div>
                   
                   <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
                     <table className="w-full text-left border-collapse min-w-[3000px]">
                       <thead className="sticky top-0 z-40 shadow-md">
                         <tr className="bg-slate-800 text-white">
                           {/* Fixed Columns */}
                           <th className="p-4 border-r border-slate-700 sticky left-0 bg-slate-800 z-50 min-w-[140px]">
                             <div className="flex flex-col gap-2">
                                <span className="text-xs font-black uppercase text-slate-400">Kode</span>
                                <button onClick={() => requestSort('code')} className="flex items-center justify-between text-xs font-bold bg-slate-700 hover:bg-slate-600 p-2 rounded transition-colors">
                                 <span>Kode</span> <ArrowUpDown size={12} className="text-slate-400" />
                               </button>
                             </div>
                           </th>
                           <th className="p-4 border-r border-slate-700 sticky left-[140px] bg-slate-800 z-50 min-w-[300px]">
                             <div className="flex flex-col gap-2">
                               <span className="text-xs font-black uppercase text-slate-400">Pernyataan Risiko</span>
                               <div className="relative">
                                 <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                                 <input value={columnFilters.description} onChange={(e) => setColumnFilters({...columnFilters, description: e.target.value})} className="w-full pl-7 pr-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-[10px] font-bold text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors" placeholder="Cari..." />
                               </div>
                             </div>
                           </th>
                           <th className="p-4 border-r border-slate-700 min-w-[300px]">
                             <div className="flex flex-col gap-2">
                               <span className="text-xs font-black uppercase text-slate-400">Sebab</span>
                               <span className="text-[10px] text-slate-500">Akar masalah utama</span>
                             </div>
                           </th>
                           <th className="p-4 border-r border-slate-700 min-w-[300px]">
                             <div className="flex flex-col gap-2">
                               <span className="text-xs font-black uppercase text-slate-400">Dampak</span>
                               <span className="text-[10px] text-slate-500">Konsekuensi jika terjadi</span>
                             </div>
                           </th>
                           <th className="p-4 border-r border-slate-700 min-w-[120px]">
                              <div className="flex flex-col gap-2">
                                 <span className="text-xs font-black uppercase text-slate-400">Status</span>
                                 <select value={columnFilters.status} onChange={(e) => setColumnFilters({...columnFilters, status: e.target.value})} className="w-full p-1.5 bg-slate-700 border border-slate-600 rounded text-[10px] font-bold text-white outline-none cursor-pointer">
                                   <option value="">Semua</option>
                                   {['Berjalan', 'Selesai', 'Draft', 'Revisi'].map(s => <option key={s} value={s}>{s}</option>)}
                                 </select>
                              </div>
                           </th>
         
                           {/* BASELINE COLUMNS */}
                           {/* Inherent */}
                           <th colSpan="5" className="p-1 px-2 text-center text-[10px] font-black border-r border-slate-800 uppercase bg-gradient-to-b from-red-900 to-slate-900 border-l border-l-slate-600">
                             Baseline Inherent
                           </th>
                           {/* Residual */}
                           <th colSpan="5" className="p-1 px-2 text-center text-[10px] font-black border-r border-slate-800 uppercase bg-gradient-to-b from-orange-900 to-slate-900 border-l border-l-slate-600">
                             Baseline Residual
                           </th>
                           {/* Target */}
                           <th colSpan="5" className="p-1 px-2 text-center text-[10px] font-black border-r border-slate-800 uppercase bg-gradient-to-b from-blue-900 to-slate-900 border-l border-l-slate-600">
                             Baseline Target
                           </th>
         
                           {/* MONTHLY MONITORING 2026 */}
                           {months.map(m => (
                             <th key={m} colSpan="5" className="p-1 px-2 text-center text-[10px] font-black border-r border-slate-800 uppercase bg-slate-900 border-l border-l-slate-600">
                               {m}
                             </th>
                           ))}
                         </tr>
                         
                         {/* Secondary Header Row for L, C, Score */}
                         <tr className="bg-slate-800 text-slate-400 text-[9px] font-bold uppercase">
                           <th className="p-2 sticky left-0 bg-slate-800 z-30 border-r border-slate-700"></th>
                           <th className="p-2 sticky left-[140px] bg-slate-800 z-30 border-r border-slate-700"></th>
                           <th className="p-2 border-r border-slate-700"></th>
                           <th className="p-2 border-r border-slate-700"></th>
                           <th className="p-2 border-r border-slate-700"></th>
                           
                           {/* Subheaders Loop */}
                           {[...Array(3 + 12)].map((_, i) => (
                             <React.Fragment key={i}>
                               <th className="p-2 text-center border-r border-slate-700 w-10 bg-slate-800/50">L</th>
                               <th className="p-2 text-center border-r border-slate-700 w-10 bg-slate-800/50">C</th>
                               <th className="p-2 text-center border-r border-slate-700 w-12 bg-slate-800/50">S</th>
                               <th className="p-2 text-center border-r border-slate-700 w-12 bg-slate-800/50 text-white">Lvl</th>
                               <th className="p-2 text-center border-r border-slate-700 min-w-[80px] bg-slate-800/50">Ket</th>
                             </React.Fragment>
                           ))}
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                         {filteredTable.map((row, idx) => (
                           <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                             <td className="p-4 border-r border-slate-100 sticky left-0 bg-white group-hover:bg-[#f8fafc] z-30 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                                <a href="#" className="font-mono text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md hover:underline">{row.code}</a>
                             </td>
                             <td className="p-4 text-xs font-bold text-slate-700 border-r border-slate-100 sticky left-[140px] bg-white group-hover:bg-[#f8fafc] z-30 shadow-[2px_0_5px_rgba(0,0,0,0.05)] leading-tight max-w-[300px]">
                                {row.desc}
                             </td>
                             <td className="p-4 text-[10px] text-slate-600 border-r border-slate-100 leading-relaxed min-w-[300px]">
                                {row.cause}
                             </td>
                              <td className="p-4 text-[10px] text-slate-600 border-r border-slate-100 leading-relaxed min-w-[300px]">
                                {row.impact}
                             </td>
                             <td className="p-4 border-r border-slate-100 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                                  row.status === 'Berjalan' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                  row.status === 'Selesai' ? 'bg-green-50 text-green-600 border-green-200' :
                                  row.status === 'Revisi' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                  'bg-slate-100 text-slate-500 border-slate-200'
                                }`}>{row.status}</span>
                             </td>
         
                             {/* BASELINE VALUES */}
                             {['inherent', 'residual', 'target'].map(type => {
                               const d = row[type];
                               const score = d.l * d.c; // LxC
                               const lv = getLevelLabel(score);
                               const lvClass = getLevelColorClass(lv);
                               return (
                                 <React.Fragment key={type}>
                                   <td className="p-2 text-center text-xs font-bold text-slate-500 border-r border-slate-100">{d.l}</td>
                                   <td className="p-2 text-center text-xs font-bold text-slate-500 border-r border-slate-100">{d.c}</td>
                                   <td className="p-2 text-center text-xs font-black text-slate-800 border-r border-slate-100 bg-slate-50/50">{score}</td>
                                   <td className="p-2 text-center text-xs font-black text-slate-800 border-r border-slate-100 bg-slate-50/50">{lv.substring(0, 3)}</td>
                                   <td className="p-2 text-center border-r border-slate-100">
                                      <div className={`w-3 h-3 rounded-full mx-auto ${lvClass.split(' ')[1]}`}></div>
                                   </td>
                                 </React.Fragment>
                               );
                             })}
         
                             {/* MONTHLY VALUES */}
                             {monthKeys.map((mKey) => {
                               const mData = row.monitoring[mKey];
                               if (!mData) return (
                                 <React.Fragment key={mKey}>
                                   <td colSpan="5" className="p-2 text-center bg-slate-50/30 text-[9px] font-bold text-slate-300 italic border-r border-slate-100">
                                     -
                                   </td>
                                 </React.Fragment>
                               );
                               const score = mData.l * mData.c;
                               const mLevel = getLevelLabel(score);
                               const lvClass = getLevelColorClass(mLevel);
                               return (
                                 <React.Fragment key={mKey}>
                                   <td className="p-2 text-center text-xs font-bold text-slate-500 border-r border-slate-100">{mData.l}</td>
                                   <td className="p-2 text-center text-xs font-bold text-slate-500 border-r border-slate-100">{mData.c}</td>
                                   <td className="p-2 text-center text-xs font-black text-slate-800 border-r border-slate-100 bg-slate-50/50">{score}</td>
                                   <td className="p-2 text-center text-xs font-black text-slate-800 border-r border-slate-100 bg-slate-50/50">{mLevel.substring(0,3)}</td>
                                   <td className="p-2 text-center border-r border-slate-100">
                                      <div className={`w-3 h-3 rounded-full mx-auto ${lvClass.split(' ')[1]}`}></div>
                                   </td>
                                 </React.Fragment>
                               );
                             })}
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 </section>
             </div>
          )}
          
          {activeTab === 'Informasi Dashboard' && (
             <div className="flex flex-col items-center justify-center p-20 text-center">
                <BarChart3 size={64} className="text-slate-200 mb-4" />
                <h3 className="text-xl font-bold text-slate-400">Informasi Dashboard</h3>
                <p className="text-slate-400 mt-2">Menampilkan statistik mendalam mengenai profil risiko perusahaan.</p>
             </div>
          )}

          {activeTab === 'Individu' && (
             <div className="flex flex-col items-center justify-center p-20 text-center">
                <User size={64} className="text-slate-200 mb-4" />
                <h3 className="text-xl font-bold text-slate-400">Dashboard Individu</h3>
                <p className="text-slate-400 mt-2">Halaman khusus untuk melihat risiko yang di-assign kepada Anda.</p>
             </div>
          )}

        </main>
      </div>
  
      {/* MODAL NOTIFIKASI MONITORING */}
      {showNotification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in duration-200 overflow-hidden relative">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-32 flex items-center justify-center">
                 <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm shadow-inner">
                    <Clock size={48} className="text-white drop-shadow-md" />
                 </div>
              </div>
              <div className="px-8 pt-8 pb-6 text-center">
                 <h3 className="text-lg font-black text-slate-800 mb-1">Anda Memiliki {pendingRisks.length} Task List!</h3>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-6">Monitoring Risiko</p>
                 
                 <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                          <AlertTriangle size={20} />
                       </div>
                       <div className="text-left">
                          <p className="text-xs font-bold text-slate-700">Risiko Belum Mencapai Target</p>
                          <p className="text-[10px] text-slate-400">Terdapat {pendingRisks.length} risiko perlu mitigasi tambahan</p>
                       </div>
                       <div className="ml-auto">
                          <ExternalLink size={16} className="text-slate-300" />
                       </div>
                    </div>
                 </div>
  
                 <button onClick={() => setShowNotification(false)} className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-all uppercase text-xs tracking-wider">
                    Tutup Notifikasi
                 </button>
              </div>
           </div>
        </div>
      )}
  
      {/* MODAL POP-UP */}
      {showModal && selectedCellData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b flex items-center justify-between bg-white">
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase leading-none">{selectedCellData.title}</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">{selectedCellData.subtitle}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all"><X size={20} /></button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3 bg-slate-50">
              {selectedCellData.risks.map((risk, idx) => (
                <div key={idx} className="p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">{risk.code}</span>
                    <ExternalLink size={16} className="text-slate-300 group-hover:text-blue-600" />
                  </div>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed">{risk.desc}</p>
                </div>
              ))}
            </div>
             <div className="p-4 bg-white border-t border-slate-100 text-center">
                <button onClick={() => setShowModal(false)} className="text-xs font-bold text-slate-500 hover:text-slate-800">Tutup</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
