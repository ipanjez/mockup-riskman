import React, { useState, useMemo } from 'react';
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
  ChevronDown
} from 'lucide-react';

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

  // 2. Data Keaktifan Karyawan (Mock per Role) - DELETED (User Request)
  
  // Palet warna unik untuk setiap risiko (1 kode = 1 warna)
  const uniqueRiskColors = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 
    'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 
    'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500', 
    'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500'
  ];

  // --- MOCK DATA RISIKO ---
  const risksList = useMemo(() => [
    { 
      id: 1, 
      code: 'R-25.001', 
      color: uniqueRiskColors[0], 
      inherent: { l: 5, c: 4 }, 
      residual: { l: 3, c: 3 }, 
      target: { l: 2, c: 2 }, 
      desc: 'Gangguan suplai gas alam utama',
      cause: 'Kerusakan pada pipa penyalur utama akibat korosi atau aktivitas pihak ketiga',
      impact: 'Terhentinya operasional pabrik secara total selama > 24 jam',
      status: 'Berjalan'
    },
    { 
      id: 2, 
      code: 'R-25.002', 
      color: uniqueRiskColors[1], 
      inherent: { l: 4, c: 5 }, 
      residual: { l: 4, c: 4 }, 
      target: { l: 3, c: 2 }, 
      desc: 'Kerusakan kompresor turbin unit 1',
      cause: 'Kelelahan material (fatigue) pada blade turbin',
      impact: 'Penurunan kapasitas produksi hingga 40%',
      status: 'Berjalan'
    },
    { 
      id: 3, 
      code: 'R-25.003', 
      color: uniqueRiskColors[2], 
      inherent: { l: 5, c: 5 }, 
      residual: { l: 2, c: 4 }, 
      target: { l: 2, c: 1 }, 
      desc: 'Kecelakaan kerja di area scrubber',
      cause: 'Kebocoran gas beracun yang tidak terdeteksi sensor',
      impact: 'Cedera serius atau fatalitas pada pekerja (LTI)',
      status: 'Revisi'
    },
    { 
      id: 4, 
      code: 'R-25.004', 
      color: uniqueRiskColors[3], 
      inherent: { l: 3, c: 3 }, 
      residual: { l: 3, c: 2 }, 
      target: { l: 1, c: 1 }, 
      desc: 'Keterlambatan sparepart vendor Eropa',
      cause: 'Gangguan rantai pasok global atau isu geopolitik',
      impact: 'Perpanjangan durasi downtime maintenance',
      status: 'Berjalan'
    },
    { 
      id: 5, 
      code: 'R-25.005', 
      color: uniqueRiskColors[4], 
      inherent: { l: 2, c: 4 }, 
      residual: { l: 2, c: 2 }, 
      target: { l: 1, c: 2 }, 
      desc: 'Perubahan regulasi emisi karbon',
      cause: 'Penerapan pajak karbon baru oleh pemerintah',
      impact: 'Peningkatan biaya operasional signifikan',
      status: 'Selesai'
    },
    { 
      id: 6, 
      code: 'R-25.006', 
      color: uniqueRiskColors[5], 
      inherent: { l: 5, c: 4 }, 
      residual: { l: 3, c: 3 }, 
      target: { l: 2, c: 2 }, 
      desc: 'Kebocoran pipa amonia jalur 4',
      cause: 'Korosi internal pipa yang tidak terpantau',
      impact: 'Pencemaran lingkungan dan denda regulasi',
      status: 'Berjalan'
    },
    { 
      id: 7, 
      code: 'R-25.007', 
      color: uniqueRiskColors[6], 
      inherent: { l: 4, c: 2 }, 
      residual: { l: 2, c: 2 }, 
      target: { l: 1, c: 1 }, 
      desc: 'Fluktuasi nilai tukar USD/IDR',
      cause: 'Ketidakstabilan ekonomi makro global',
      impact: 'Selisih kurs yang memberatkan budget pengadaan',
      status: 'Draft'
    },
    { 
      id: 8, 
      code: 'R-25.008', 
      color: uniqueRiskColors[7], 
      inherent: { l: 1, c: 5 }, 
      residual: { l: 1, c: 3 }, 
      target: { l: 1, c: 1 }, 
      desc: 'Serangan siber pada sistem DCS',
      cause: 'Vulnerability pada sistem jaringan kontrol pabrik',
      impact: 'Kehilangan kendali operasional pabrik',
      status: 'Berjalan'
    },
    { 
      id: 9, 
      code: 'R-25.009', 
      color: uniqueRiskColors[8], 
      inherent: { l: 3, c: 5 }, 
      residual: { l: 2, c: 4 }, 
      target: { l: 2, c: 2 }, 
      desc: 'Penurunan kualitas katalis',
      cause: 'Kontaminasi feed gas yang masuk ke reaktor',
      impact: 'Penurunan efisiensi konversi reaksi kimia',
      status: 'Berjalan'
    },
    { 
      id: 10, 
      code: 'R-25.010', 
      color: uniqueRiskColors[9], 
      inherent: { l: 4, c: 4 }, 
      residual: { l: 3, c: 3 }, 
      target: { l: 1, c: 2 }, 
      desc: 'Isu sosial dengan masyarakat sekitar',
      cause: 'Kurangnya komunikasi program CSR perusahaan',
      impact: 'Gangguan akses logistik menuju pabrik',
      status: 'Berjalan'
    },
  ], []);

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
            // Replicating logic for monitoring
            const monitoring = {
               jan: r.inherent,
               feb: r.residual,
               mar: r.residual,
               apr: { l: 3, c: 3 },
               mei: { l: 2, c: 3 },
               jun: { l: 2, c: 2 },
               jul: { l: 2, c: 2 },
               agt: { l: 1, c: 2 },
               sep: { l: 1, c: 2 },
               okt: { l: 1, c: 1 },
               nov: { l: 1, c: 1 },
               des: { l: 1, c: 1 }
            };

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
               const score = d.l * d.c;
               row.push(d.l, d.c, score, getLevelLabel(score));
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
  const tableData = useMemo(() => risksList.map(r => ({
    ...r,
    monitoring: {
      jan: { l: r.inherent.l, c: r.inherent.c },
      feb: { l: r.residual.l, c: r.residual.c },
      mar: { l: r.residual.l, c: r.residual.c },
      apr: { l: 3, c: 3 },
      mei: { l: 2, c: 3 },
      jun: { l: 2, c: 2 },
      jul: { l: 2, c: 2 },
      agt: { l: 1, c: 2 },
      sep: { l: 1, c: 2 },
      okt: { l: 1, c: 1 },
      nov: { l: 1, c: 1 },
      des: { l: 1, c: 1 }
    }
  })), [risksList]);

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
  const RiskMatrix = ({ title, type }) => {
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

    const levelCounts = risksList.reduce((acc, risk) => {
      const coord = risk[type];
      const label = getLevelLabel(coord.l * coord.c);
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {});

    const handleCellClick = (r, c) => {
      const risksInCell = risksList.filter(risk => risk[type].l === r && risk[type].c === c);
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
          </h3>
          <HelpCircle size={16} className="text-slate-300" />
        </div>
        
        <div className="flex-grow flex flex-col justify-center mb-6">
          <div className="relative">
            <div className="absolute -left-8 top-1/2 -rotate-90 origin-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Likelihood</div>
            <div className="grid grid-cols-5 gap-1 ml-4 border border-slate-200 p-0.5 bg-slate-50">
              {rows.map(r => cols.map(c => {
                const risksInCell = risksList.filter(risk => risk[type].l === r && risk[type].c === c);
                const hasRisks = risksInCell.length > 0;
                return (
                  <div 
                    key={`${r}-${c}`} 
                    onClick={() => hasRisks && handleCellClick(r, c)}
                    className={`h-14 w-full flex flex-wrap gap-1 p-1 items-center justify-center rounded-sm border border-white relative transition-all ${getCellColor(r, c)} ${hasRisks ? 'cursor-pointer hover:brightness-95 hover:scale-105 z-10' : ''}`}
                  >
                    {risksInCell.map(risk => (
                      <div 
                        key={risk.id} 
                        onMouseEnter={() => setHoveredRiskId(risk.id)}
                        onMouseLeave={() => setHoveredRiskId(null)}
                        className={`w-3.5 h-3.5 rounded-full ${risk.color} shadow-sm border border-white relative group transition-all duration-300 ${hoveredRiskId === risk.id ? 'ring-2 ring-blue-500 ring-offset-2 scale-150 z-50' : ''}`}
                      >
                         <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[9px] font-black rounded transition-opacity z-50 whitespace-nowrap pointer-events-none ${hoveredRiskId === risk.id ? 'opacity-100' : 'opacity-0'}`}>
                            {risk.code}
                         </div>
                      </div>
                    ))}
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
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Dashboard Card Container */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800">Dashboard</h2>
                    </div>
                    
                    <div className="p-6 space-y-8">
                        {/* Filters Section */}
                        <div className="bg-[#0055AA] p-4 rounded-lg flex flex-wrap gap-4 items-end">
                             <div className="flex-1 min-w-[200px]">
                                <label className="text-xs text-white mb-1 block font-medium">Jenis Pengelolaan Risiko</label>
                                <div className="relative">
                                    <select className="w-full bg-white text-slate-700 text-sm font-bold rounded px-3 py-2 outline-none appearance-none cursor-pointer">
                                        <option>OPERASIONAL</option>
                                        <option>STRATEGIS</option>
                                        <option>PROYEK</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                </div>
                             </div>
                             <div className="flex-1 min-w-[200px]">
                                <label className="text-xs text-white mb-1 block font-medium">Periode</label>
                                <div className="relative">
                                    <select className="w-full bg-white text-slate-700 text-sm font-bold rounded px-3 py-2 outline-none appearance-none cursor-pointer">
                                        <option>Semua Periode</option>
                                        <option>2026</option>
                                        <option>2025</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                </div>
                             </div>
                             <div className="flex-1 min-w-[200px]">
                                <label className="text-xs text-white mb-1 block font-medium">Departemen</label>
                                <div className="relative">
                                    <select className="w-full bg-white text-slate-700 text-sm font-bold rounded px-3 py-2 outline-none appearance-none cursor-pointer">
                                        <option>Semua Departemen</option>
                                        <option>Departemen Lingkungan Hidup</option>
                                        <option>Departemen K3</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                </div>
                             </div>
                        </div>

                        {/* Status Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                             {[
                                { label: 'Risiko Baru', count: 5, color: 'bg-[#FF8800]' },
                                { label: 'Menunggu Persetujuan', count: 243, color: 'bg-[#FF8800]' },
                                { label: 'Berjalan', count: 97, color: 'bg-[#FF8800]' },
                                { label: 'Draft', count: 121, color: 'bg-[#FF8800]' },
                                { label: 'Revisi', count: 9, color: 'bg-[#FF8800]' },
                                { label: 'Risiko Terintegrasi', count: 0, color: 'bg-[#FF8800]' },
                             ].map((stat, i) => (
                                <div key={i} className={`${stat.color} text-white p-4 rounded-lg flex items-center justify-between shadow-md hover:-translate-y-1 transition-transform cursor-pointer`}>
                                     <span className="text-xs font-bold leading-tight max-w-[80px]">{stat.label}</span>
                                     <span className="text-3xl font-black">{stat.count}</span>
                                </div>
                             ))}
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                             {/* Donut Chart - Status Risiko */}
                             <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col">
                                 <h3 className="font-bold text-slate-800 mb-1">Status Risiko (Semua Periode)</h3>
                                 <p className="text-xs text-slate-400 mb-8">Risiko inaktif adalah risiko dimana level residual sudah sama dengan target.</p>
                                 
                                 <div className="flex-grow flex items-center justify-center relative">
                                      {/* CSS Donut Chart */}
                                      <div className="w-48 h-48 rounded-full border-[24px] border-[#90C2F6] relative"></div>
                                      <div className="absolute inset-0 flex items-center justify-center">
                                          <div className="w-24 h-24 bg-white rounded-full"></div>
                                      </div>
                                 </div>
                                 <div className="flex justify-center gap-4 mt-6">
                                     <div className="flex items-center gap-2">
                                          <div className="w-3 h-3 bg-[#90C2F6]"></div>
                                          <span className="text-xs font-bold text-slate-600">Tidak Aktif <span className="text-slate-400 ml-1">100.0%</span></span>
                                     </div>
                                 </div>
                             </div>

                             {/* Cost Section */}
                             <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col">
                                 <h3 className="font-bold text-slate-800 mb-4">Biaya Mitigasi (Semua Periode)</h3>
                                 
                                 <div className="space-y-8">
                                     <div>
                                         <p className="text-sm font-bold text-slate-500 mb-1">Rencana Biaya</p>
                                         <p className="text-3xl font-black text-slate-800">Rp. 3.5 T</p>
                                         <p className="text-xs text-slate-400 mt-1">(OPEX: Rp 1.9 T | CAPEX: Rp 1.6 T)</p>
                                     </div>

                                     <div>
                                         <p className="text-sm font-bold text-slate-500 mb-1">Realisasi Biaya</p>
                                         <p className="text-3xl font-black text-slate-800">Rp. 478.4 M</p>
                                         
                                         {/* Progress Bar */}
                                         <div className="mt-4 relative pt-6">
                                             <div className="flex justify-end mb-1">
                                                 <span className="text-xs font-bold text-[#4ADE80]">(14%)</span>
                                             </div>
                                             <div className="h-4 bg-slate-100 rounded-full overflow-hidden w-full">
                                                 <div className="h-full bg-[#3B82F6] w-[14%] rounded-full"></div>
                                             </div>
                                             <p className="text-xs text-slate-400 mt-2">Persentase realisasi terhadap rencana biaya total.</p>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Matrix Placeholder */}
                <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-500 mb-4">Peta Risiko</h3>
                    <div className="h-40 bg-slate-50 flex items-center justify-center text-slate-400 text-sm italic border border-dashed border-slate-300 rounded-lg">
                        Content Peta Risiko Here
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
