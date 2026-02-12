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
    const types = [
        'OPERASIONAL', 'INDIVIDU',
        'ᵖʳᵒʸᵉᵏSoda Ash', 'ᵖʳᵒʸᵉᵏFak-Fak', 'ᵖʳᵒʸᵉᵏNPK-3',
        'ˢᵐPERPOL7 OBVITNAS', 'ˢᵐSIMPRO', 'ˢᵐISO27001 SMKI',
        'ˢᵐISO26000 CSR', 'ˢᵐISO37001 SMAP', 'ˢᵐISO22301 BCMS', 
        'ˢᵐISO 45001 & PP 50 SMK3', 'ˢᵐISO 37301 SMK', 'ˢᵐISO 14001 SML'
    ];
    // Register Risk Statuses
    const registerStatuses = [
        'Baru',
        'Draft', 
        'Revisi',
        'Menunggu Approval VP/PM Unit Kerja', 
        'Menunggu Approval SVP Unit Kerja', 
        'Menunggu Approval VP MRK', 
        'Menunggu Approval SVP TKMR'
    ];
    // Monitoring Risk Statuses
    const monitoringStatuses = [
        'Berjalan', 
        'Revisi Monitoring', 
        'Menunggu Approval Monitoring VP/PM Unit Kerja', 
        'Menunggu Approval Monitoring SVP Unit Kerja',
        'Menunggu Approval Monitoring Staff MRK', 
        'Menunggu Approval Monitoring VP MRK', 
        'Menunggu Approval Monitoring SVP TKMR',
        'Selesai Monitoring'
    ];

    const allStatuses = [...registerStatuses, ...monitoringStatuses];
    const periods = ['2025', '2026'];
    const sasaranGenerik = ['Hukum, Reputasi dan Kepatuhan', 'Keuangan', 'Operasional', 'Pasar dan Makroekonomi', 'Proyek', 'Strategis', 'Teknologi dan Keamanan Siber'];
    const aktivitasGenerik = ['Pengadaan', 'Produksi', 'Distribusi', 'Pemasaran', 'Keuangan', 'SDM', 'IT'];
    const taksonomiRisiko = ['Risiko Pasar', 'Risiko Kredit', 'Risiko Likuiditas', 'Risiko Operasional', 'Risiko Hukum', 'Risiko Strategis', 'Risiko Reputasi'];
    const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'TKNO'];
    
    // Palet warna untuk risiko
    const colors = [
        'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 
        'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 
        'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500'
    ];

    return Array.from({ length: 300 }, (_, i) => {
        const type = types[Math.floor(Math.random() * types.length)];
        const unit = units[Math.floor(Math.random() * units.length)];
        const status = allStatuses[Math.floor(Math.random() * allStatuses.length)];
        const period = periods[Math.floor(Math.random() * periods.length)];
        const category = sasaranGenerik[Math.floor(Math.random() * sasaranGenerik.length)];
        const grade = grades[Math.floor(Math.random() * grades.length)];
        
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
            kategoriRisiko: category, // Sasaran Generik
            aktivitasGenerik: aktivitasGenerik[Math.floor(Math.random() * aktivitasGenerik.length)],
            taksonomiRisiko: taksonomiRisiko[Math.floor(Math.random() * taksonomiRisiko.length)],
            grade: grade,
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
    const [activeTab, setActiveTab] = useState('Dashboard');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Reduced for demo pagination demonstration

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
    unit: '',
    sasaran: '',
    aktivitas: '',
    risiko: '',
    cause: '',
    impact: '',
    status: ''
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
      case 'Low to Moderate': return 'text-lime-700 bg-lime-100 border-lime-200'; // Hijau Muda
      case 'Low': return 'text-emerald-800 bg-emerald-100 border-emerald-200'; // Hijau Tua
      default: return 'text-slate-400 bg-slate-50 border-slate-200';
    }
  };

  // --- DATA & STATE ---
  const [currentUser, setCurrentUser] = useState({ 
      id: 'User 1', 
      roles: ['Superadmin'], // Multiple roles support
      name: 'Farhan Jezando', 
      unit: 'Departemen K3', 
      kompartemen: 'Kompartemen Operasi',
      assignedRiskTypes: ['ISO 27001 SMKI'] // For PIC SISMEN
  });
  
  const [filters, setFilters] = useState({ 
      jenis: 'OPERASIONAL', 
      periode: 'Semua Periode', 
      unit: 'Semua Unit Kerja',
      chartCategory: 'Sasaran Generik',
      chartGrades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'] // All selected by default
  });
  
  const [rawData] = useState(() => generateDummyData());

  // Helper to get period options based on Risk Type
  const getPeriodOptions = (type) => {
      if (type === 'INDIVIDU') {
          return ['Semua Periode', 'M1-2026', 'M2-2026', 'M3-2026', 'M4-2026', 'M5-2026', 'M6-2026', 'M7-2026', 'M8-2026', 'M9-2026', 'M10-2026', 'M11-2026', 'M12-2026'];
      } else if (type === 'OPERASIONAL') {
          return ['Semua Periode', 'Q1-2025', 'Q2-2025', 'Q3-2025', 'Q4-2025', 'Q1-2026', 'Q2-2026', 'Q3-2026', 'Q4-2026'];
      } else {
          return ['Semua Periode', 'Y1-2025', 'Y2-2026'];
      }
  };

  // Helper to get formatted superscripts
  const formatRiskType = (type) => {
      if (type.startsWith('PROYEK ')) {
          const suffix = type.replace('PROYEK ', '');
          return (<span><sup>PROYEK</sup> {suffix}</span>);
      }
      return type;
  };

  // --- FILTERING LOGIC ---
  const risksList = useMemo(() => {
      return rawData.filter(item => {
          // 1. Basic Filters
          // Removed 'Semua Jenis' logic as it is no longer an option
          const matchesJenis = item.jenisRisiko === filters.jenis;
          
          // Period logic matching (Simple inclusion for now, can be more complex if needed)
          const matchesPeriode = filters.periode === 'Semua Periode' || item.periode.includes(filters.periode) || filters.periode.includes('Y1') || filters.periode.includes('Y2'); // Simplified for dummy data
          
          const matchesUnit = filters.unit === 'Semua Unit Kerja' || item.unitKerja === filters.unit;
          
          // 2. RBAC & Hierarchy Logic
          let hasAccess = false;

          const userRoles = currentUser.roles || ['Superadmin'];
          if (userRoles.includes('Superadmin') || userRoles.includes('Admin MRK')) {
              hasAccess = true;
          } else if (userRoles.includes('Karyawan')) {
              hasAccess = item.owner === currentUser.id;
          } else if (userRoles.includes('Viewer')) {
              hasAccess = true; // Viewer can see all
          }

          return matchesJenis && matchesPeriode && matchesUnit && hasAccess;
      });
  }, [rawData, filters, currentUser]);

  // Data for Charts (Updated for dynamic Category)
  const chartData = useMemo(() => {
      // Group by Category (Sasaran Generik, etc)
      const grouped = {};
      
      risksList.forEach(r => {
          // Filter by Grade
          if (filters.chartGrades.length > 0 && !filters.chartGrades.includes(r.grade)) return;

          // Use the selected category field.
          let key = '';
          if (filters.chartCategory === 'Sasaran Generik') key = r.kategoriRisiko;
          else if (filters.chartCategory === 'Aktivitas Generik') key = r.aktivitasGenerik;
          else if (filters.chartCategory === 'Risiko Generik') key = r.jenisRisiko; 
          else if (filters.chartCategory === 'Taksonomi Risiko') key = r.taksonomiRisiko;
          else key = 'Other';
          
          if (!key) key = 'Uncategorized';

          if (!grouped[key]) grouped[key] = { 
              name: key, 
              'High': 0, 
              'Moderate to High': 0, 
              'Moderate': 0, 
              'Low to Moderate': 0, 
              'Low': 0 
          };
          
          const score = r.residual.l * r.residual.c;
          const level = getLevelLabel(score);
          if (grouped[key][level] !== undefined) {
              grouped[key][level]++;
          }
      });

      return Object.values(grouped);
  }, [risksList, filters.chartCategory, filters.chartGrades]);

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
  const activeRisksCount = useMemo(() => risksList.filter(r => r.status !== 'Draft').length, [risksList]);
  const inactiveRisksCount = useMemo(() => risksList.filter(r => r.status === 'Selesai Monitoring').length, [risksList]);
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
      // Helper for safe string check
      const check = (val, filter) => (val || '').toLowerCase().includes((filter || '').toLowerCase());
      
      return (
        check(item.code, columnFilters.code) &&
        check(item.unitKerja, columnFilters.unit) &&
        check(item.kategoriRisiko, columnFilters.sasaran) &&
        check(item.aktivitasGenerik, columnFilters.aktivitas) &&
        check(item.desc, columnFilters.risiko) &&
        check(item.cause, columnFilters.cause) &&
        check(item.impact, columnFilters.impact) &&
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
      risks: risksList.filter(r => r.status === statusLabel || (statusLabel === 'Aktif' && r.status !== 'Draft') || (statusLabel === 'Inaktif' && r.status === 'Selesai Monitoring')).map(r => ({ ...r }))
    });
    setShowModal(true);
  };

  const handleHighTotalClick = (type) => {
    setSelectedCellData({
      title: `Risiko High (${type.toUpperCase()})`,
      subtitle: `Daftar risiko dengan Skala >= 20 pada kategori ${type}`,
      risks: risksList.filter(r => (r[type].l * r[type].c) >= 20).map(r => ({ ...r }))
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

  const handleChartBarClick = (data, pLevel) => {
      const categoryName = data.name;
      const categoryType = filters.chartCategory;
      
      // Filter the risks
      const targetRisks = risksList.filter(r => {
          // Check Category
          let rCat = '';
          // Simple mapping based on current dummy data structure
          if (categoryType === 'Sasaran Generik') rCat = r.kategoriRisiko;
          else if (categoryType === 'Aktivitas Generik') rCat = r.aktivitasGenerik; 
          else if (categoryType === 'Taksonomi Risiko') rCat = r.taksonomiRisiko;
          else rCat = r.kategoriRisiko; // Fallback

          if (rCat !== categoryName) return false;
          
          // Check Risk Level
          const score = r.residual.l * r.residual.c;
          return getLevelLabel(score) === pLevel;
      });

      setSelectedCellData({
          title: `Risiko ${pLevel} - ${categoryName}`,
          subtitle: `Risiko kategori ${categoryType}: ${categoryName} dengan level ${pLevel}`,
          risks: targetRisks
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
      if (sum >= 4) return 'bg-lime-400/10';
      return 'bg-emerald-700/10';
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
          risks: risksInCell.map(r => ({...r}))
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
                    {risksInCell.slice(0, 5).map(risk => (
                      <div 
                        key={risk.id} 
                        className={`w-3 h-3 rounded-full ${risk.id === hoveredRiskId ? 'ring-2 ring-blue-500 scale-125 z-20' : ''} ${risk.color} shadow-sm border border-white relative group transition-all duration-300`}
                        title={risk.code}
                        onMouseEnter={() => setHoveredRiskId(risk.id)}
                        onMouseLeave={() => setHoveredRiskId(null)}
                      >
                      </div>
                    ))}
                    {risksInCell.length > 5 && <span className="text-[8px] font-black text-slate-500">+{risksInCell.length - 5}</span>}
                  </div>
                );
              }))}
            </div>
            <div className="text-center mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Consequence</div>
          </div>
        </div>
        
        {/* RINGKASAN JUMLAH RISIKO - Updated to Horizontal Low -> High */}
        <div className="mt-auto border-t pt-4">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Ringkasan Level (Klik untuk Detail):</p>
           <div className="flex flex-wrap gap-2 justify-between">
              {['Low', 'Low to Moderate', 'Moderate', 'Moderate to High', 'High'].map(lvl => (
                <button key={lvl} onClick={() => handleLevelClick(lvl, type)} className="flex items-center gap-1.5 hover:bg-slate-50 rounded p-1 transition-colors group">
                     {/* Dot */}
                     <div className={`w-2 h-2 rounded-full ${getLevelColorClass(lvl).split(' ')[0]}`}></div>
                     {/* Count */}
                     <span className={`text-[10px] font-black ${getLevelColorClass(lvl).split(' ')[0]}`}>{levelCounts[lvl] || 0}</span>
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
                <div className="flex flex-wrap gap-1 mt-2 w-full justify-center">
                    {/* Multiple Role Selection */}
                    {['Superadmin', 'Karyawan', 'Admin MRK', 'Admin Data', 'Viewer'].map(role => (
                        <button
                            key={role}
                            onClick={() => {
                                const roles = currentUser.roles || ['Superadmin'];
                                if (roles.includes(role)) {
                                    if (roles.length > 1) {
                                        setCurrentUser({...currentUser, roles: roles.filter(r => r !== role)});
                                    }
                                } else {
                                    setCurrentUser({...currentUser, roles: [...roles, role]});
                                }
                            }}
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                                (currentUser.roles || ['Superadmin']).includes(role)
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                            title={`Klik untuk ${(currentUser.roles || ['Superadmin']).includes(role) ? 'hapus' : 'tambah'} role`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
                
                {/* Department Selector */}
                <div className="w-full mt-4 relative">
                   <select className="w-full text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none appearance-none cursor-pointer hover:border-blue-300 transition-colors text-center truncate pr-8">
                       <option>PIC SISMEN - Departemen Lingkungan Hidup</option>
                       <option>Karyawan - Staff Operasional</option>
                       <option>AVP - Area 1</option>
                       <option>VP - Operasi</option>
                       <option>SVP - Teknik</option>
                       <option>PM - Proyek Soda Ash</option>
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
              active={['Dashboard', 'Informasi Dashboard'].includes(activeTab)} 
              onClick={() => setActiveTab('Dashboard')} 
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
               {/* Role Switcher Removed as per request */}

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
          {activeTab === 'Dashboard' && (
             <div className="bg-gradient-to-r from-[#0055AA] to-[#0077EE] rounded-2xl p-6 mb-6 text-white relative overflow-hidden shadow-xl shadow-blue-900/10 flex items-center justify-between min-h-[160px]">
                 {/* Text Content */}
                 <div className="relative z-10 pl-2">
                     <h1 className="text-2xl font-bold mb-2 tracking-tight">Selamat Datang, Farhan Jezando Wardana</h1>
                     <p className="text-blue-100 text-sm font-medium opacity-90 max-w-xl">Aplikasi Sistem Manajemen Risiko Terintegrasi</p>
                     
                     <div className="flex gap-6 mt-8">
                         <button onClick={() => setActiveTab('Dashboard')} className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Dashboard' ? 'border-white text-white' : 'border-transparent text-blue-200 hover:text-white'}`}>Dashboard</button>
                         <button onClick={() => setActiveTab('Informasi Dashboard')} className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Informasi Dashboard' ? 'border-white text-white' : 'border-transparent text-blue-200 hover:text-white'}`}>Informasi Dashboard</button>
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
  
          {activeTab === 'Dashboard' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* 1. ADVANCED FILTER SECTION */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                    <div className="relative">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                            <Layers size={12} /> Jenis Pengelolaan Risiko
                            <InfoTooltip text="Filter risiko berdasarkan jenis pengelolaannya. Wajib dipilih." />
                        </label>
                        <select 
                            value={filters.jenis} 
                            onChange={(e) => {
                                const newType = e.target.value;
                                const newPeriodOptions = getPeriodOptions(newType);
                                setFilters({
                                    ...filters, 
                                    jenis: newType, 
                                    periode: newPeriodOptions[0] // Reset period to first available option
                                });
                            }}
                            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 px-3 py-3 outline-none appearance-none cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
                        >
                            <option value="OPERASIONAL">OPERASIONAL</option>
                            <option value="STRATEGIS">STRATEGIS</option>
                            <option value="INDIVIDU">INDIVIDU</option>
                            
                            <optgroup label="Proyek">
                                <option value="PROYEK Soda Ash">ᵖʳᵒʸᵉᵏ Soda Ash</option>
                                <option value="PROYEK Fak-Fak">ᵖʳᵒʸᵉᵏ Fak-Fak</option>
                                <option value="PROYEK NPK-3">ᵖʳᵒʸᵉᵏ NPK-3</option>
                            </optgroup>

                            <optgroup label="Sistem Manajemen (ISO)">
                                <option value="SM PERPOL7 OBVITNAS">SM PERPOL7 OBVITNAS</option>
                                <option value="SM SIMPRO">SM SIMPRO</option>
                                <option value="SM ISO27001 SMKI">SM ISO27001 SMKI</option>
                                <option value="SM ISO26000 CSR">SM ISO26000 CSR</option>
                                <option value="SM ISO37001 SMAP">SM ISO37001 SMAP</option>
                                <option value="SM ISO22301 BCMS">SM ISO22301 BCMS</option>
                                <option value="SM ISO 45001 & PP 50 SMK3">SM ISO 45001 & PP 50 SMK3</option>
                                <option value="SM ISO 37301 SMK">SM ISO 37301 SMK</option>
                                <option value="SM ISO 14001 SML">SM ISO 14001 SML</option>
                            </optgroup>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 bottom-3.5 text-slate-400 pointer-events-none" />
                    </div>
                    
                    <div className="relative">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                            <Calendar size={12} /> Periode
                            <InfoTooltip text="Periode waktu laporan risiko." />
                        </label>
                        <select 
                            value={filters.periode}
                            onChange={(e) => setFilters({...filters, periode: e.target.value})}
                            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 px-3 py-3 outline-none appearance-none cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
                        >
                            {getPeriodOptions(filters.jenis).map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
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
                            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 px-3 py-3 outline-none appearance-none cursor-pointer focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
                        >
                            <option>Semua Unit Kerja</option>
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
                        <div onClick={() => handleStatusClick('Aktif')} className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-5 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-between relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform">
                           <div>
                               <p className="text-xs font-medium text-blue-100 mb-1 flex items-center">
                                   Total Risiko Aktif
                                   <InfoTooltip text="Jumlah risiko yang masih aktif (Selain Draft)." />
                               </p>
                               <h3 className="text-4xl font-black tracking-tight">{activeRisksCount}</h3>
                           </div>
                           <ActivityIcon size={48} className="text-blue-500 opacity-40 absolute right-4 bottom-[-10px] group-hover:scale-110 transition-transform" />
                        </div>
                        <div onClick={() => handleStatusClick('Inaktif')} className="bg-white border border-slate-200 text-slate-700 p-5 rounded-xl shadow-sm flex items-center justify-between relative overflow-hidden group cursor-pointer hover:border-blue-400 hover:shadow-md transition-all">
                           <div>
                               <p className="text-xs font-bold text-slate-400 mb-1 flex items-center">
                                   Total Risiko Inaktif
                                   <InfoTooltip text="Jumlah risiko yang telah selesai monitoring (Selesai Monitoring)." />
                               </p>
                               <h3 className="text-4xl font-black tracking-tight text-slate-800">{inactiveRisksCount}</h3>
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
                        <div className="grid grid-cols-2 lg:flex lg:flex-nowrap gap-3 min-w-max">
                            {[
                                { l: 'Baru', c: risksList.filter(r => r.status === 'Baru').length, color: 'bg-blue-50 text-blue-600' },
                                { l: 'Draft', c: risksList.filter(r => r.status === 'Draft').length, color: 'bg-slate-100 text-slate-600' },
                                { l: 'Revisi', c: risksList.filter(r => r.status === 'Revisi').length, color: 'bg-red-50 text-red-600' },
                                { l: 'Menunggu Approval VP/PM Unit Kerja', c: risksList.filter(r => r.status === 'Menunggu Approval VP/PM Unit Kerja').length, color: 'bg-orange-50 text-orange-600' },
                                { l: 'Menunggu Approval SVP Unit Kerja', c: risksList.filter(r => r.status === 'Menunggu Approval SVP Unit Kerja').length, color: 'bg-orange-50 text-orange-600' },
                                { l: 'Menunggu Approval VP MRK', c: risksList.filter(r => r.status === 'Menunggu Approval VP MRK').length, color: 'bg-orange-50 text-orange-600' },
                                { l: 'Menunggu Approval SVP TKMR', c: risksList.filter(r => r.status === 'Menunggu Approval SVP TKMR').length, color: 'bg-orange-50 text-orange-600' },
                            ].map((stat, i) => (
                                <div key={i} onClick={() => handleStatusClick(stat.l)} className={`${stat.color} px-4 py-3 rounded-lg border border-transparent hover:border-black/10 transition-all flex flex-col items-center min-w-[140px] cursor-pointer group hover:shadow-sm relative`}>
                                    <span className="text-2xl font-black mb-1">{stat.c}</span>
                                    <span className="text-[9px] font-bold text-center uppercase leading-tight opacity-80 line-clamp-2">{stat.l}</span>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                       <InfoTooltip text={stat.l} />
                                    </div>
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
                         <div className="grid grid-cols-2 lg:flex lg:flex-nowrap gap-3 min-w-max">
                            {[
                                { l: 'Berjalan', c: risksList.filter(r => r.status === 'Berjalan').length, color: 'bg-emerald-50 text-emerald-600' },
                                { l: 'Revisi Monitoring', c: risksList.filter(r => r.status === 'Revisi Monitoring').length, color: 'bg-red-50 text-red-600' },
                                { l: 'Menunggu Approval Monitoring VP/PM Unit Kerja', c: risksList.filter(r => r.status === 'Menunggu Approval Monitoring VP/PM Unit Kerja').length, color: 'bg-amber-50 text-amber-600' },
                                { l: 'Menunggu Approval Monitoring SVP Unit Kerja', c: risksList.filter(r => r.status === 'Menunggu Approval Monitoring SVP Unit Kerja').length, color: 'bg-amber-50 text-amber-600' },
                                { l: 'Menunggu Approval Monitoring Staff MRK', c: risksList.filter(r => r.status === 'Menunggu Approval Monitoring Staff MRK').length, color: 'bg-amber-50 text-amber-600' },
                                { l: 'Menunggu Approval Monitoring VP MRK', c: risksList.filter(r => r.status === 'Menunggu Approval Monitoring VP MRK').length, color: 'bg-amber-50 text-amber-600' },
                                { l: 'Menunggu Approval Monitoring SVP TKMR', c: risksList.filter(r => r.status === 'Menunggu Approval Monitoring SVP TKMR').length, color: 'bg-amber-50 text-amber-600' },
                                { l: 'Selesai Monitoring', c: risksList.filter(r => r.status === 'Selesai Monitoring').length, color: 'bg-blue-50 text-blue-600' },
                            ].map((stat, i) => (
                                <div key={i} onClick={() => handleStatusClick(stat.l)} className={`${stat.color} px-4 py-3 rounded-lg border border-transparent hover:border-black/10 transition-all flex flex-col items-center min-w-[140px] cursor-pointer group hover:shadow-sm relative`}>
                                    <span className="text-2xl font-black mb-1">{stat.c}</span>
                                    <span className="text-[9px] font-bold text-center uppercase leading-tight opacity-80 line-clamp-2">{stat.l}</span>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                       <InfoTooltip text={stat.l} />
                                    </div>
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
                        <div className="flex gap-3 items-center">
                             {/* Grade Filter Dropdown with Checkboxes */}
                             <div className="relative group">
                                <button className="flex items-center gap-2 text-[10px] font-bold bg-slate-50 border border-slate-200 rounded px-3 py-2 hover:bg-slate-100">
                                    <Filter size={12} />
                                    Filter Grade ({filters.chartGrades.length})
                                </button>
                                <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 shadow-xl rounded-lg p-2 z-50">
                                    {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'TKNO'].map(g => (
                                        <label key={g} className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer text-[10px] font-bold text-slate-600">
                                            <input 
                                                type="checkbox" 
                                                checked={filters.chartGrades.includes(g)}
                                                onChange={(e) => {
                                                    const newGrades = e.target.checked 
                                                        ? [...filters.chartGrades, g]
                                                        : filters.chartGrades.filter(item => item !== g);
                                                    setFilters({...filters, chartGrades: newGrades});
                                                }}
                                                className="rounded border-slate-300 text-blue-600 focus:ring-0 w-3 h-3"
                                            />
                                            {g}
                                        </label>
                                    ))}
                                </div>
                             </div>

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
                                    labelStyle={{fontSize: '11px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px'}}
                                    itemStyle={{fontSize: '10px', padding: '2px 0'}}
                                />
                                <Legend wrapperStyle={{paddingTop: '20px', fontSize: '10px'}} iconSize={8} />
                                <Bar dataKey="High" name="High" stackId="a" fill="#dc2626" barSize={40} onClick={(data) => handleChartBarClick(data, 'High')} className="cursor-pointer hover:opacity-80" />
                                <Bar dataKey="Moderate to High" name="Moderate to High" stackId="a" fill="#f97316" barSize={40} onClick={(data) => handleChartBarClick(data, 'Moderate to High')} className="cursor-pointer hover:opacity-80" />
                                <Bar dataKey="Moderate" name="Moderate" stackId="a" fill="#eab308" barSize={40} onClick={(data) => handleChartBarClick(data, 'Moderate')} className="cursor-pointer hover:opacity-80" />
                                <Bar dataKey="Low to Moderate" name="Low to Moderate" stackId="a" fill="#84cc16" barSize={40} onClick={(data) => handleChartBarClick(data, 'Low to Moderate')} className="cursor-pointer hover:opacity-80" />
                                <Bar dataKey="Low" name="Low" stackId="a" fill="#059669" barSize={40} radius={[4, 4, 0, 0]} onClick={(data) => handleChartBarClick(data, 'Low')} className="cursor-pointer hover:opacity-80" />
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
                    <div className="flex flex-col gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <PieChart size={18} className="text-blue-600" />
                                Kelengkapan Pengisian
                                <InfoTooltip text="Persentase kelengkapan pengisian data risiko per unit kerja." />
                            </h3>
                            
                            <div className="space-y-4">
                                {['Departemen K3', 'Departemen Lingkungan Hidup', 'Departemen Operasi', 'Departemen HR', 'Departemen IT'].map((dept, i) => {
                                    const pct = [100, 85, 92, 78, 88][i]; // Static mock
                                    const filled = [340, 255, 184, 156, 44][i];
                                    const total = [340, 300, 200, 200, 50][i];
                                    return (
                                        <div key={i}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-bold text-slate-600">{dept}</span>
                                                <span className={`font-black ${pct < 80 ? 'text-orange-500' : 'text-green-600'}`}>{pct}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${pct < 80 ? 'bg-orange-400' : 'bg-green-500'}`} style={{width: `${pct}%`}}></div>
                                            </div>
                                            <p className="text-[9px] text-slate-400 mt-1">{filled} dari {total} Risiko Teridentifikasi</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Activity size={18} className="text-blue-600" />
                                Kelengkapan Monitoring
                                <InfoTooltip text="Jumlah risiko dengan status 'Berjalan' per unit kerja." />
                            </h3>
                            <div className="space-y-3">
                                {['Departemen K3', 'Departemen Lingkungan Hidup', 'Departemen Operasi', 'Departemen HR'].map((dept, i) => {
                                    const count = risksList.filter(r => r.unitKerja === dept && r.status === 'Berjalan').length;
                                    return (
                                        <div key={i} className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100">
                                            <span className="text-[10px] font-bold text-slate-600">{dept}</span>
                                            <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">{count} Berjalan</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. MONITORING TABLE */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                   <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                       <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <Layers size={18} className="text-blue-600" />
                          Rekapitulasi Risiko
                          <InfoTooltip text="Daftar risiko yang sesuai dengan kriteria filter." />
                       </h3>
                       <button onClick={handleMonitoringExport} className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-blue-100 flex items-center gap-2">
                          <Download size={14} /> Export CSV
                       </button>
                   </div>
                   <div className="overflow-x-auto min-h-[400px]">
                       <table className="w-full text-left border-collapse min-w-[2000px]">
                          <thead className="bg-slate-800 text-[10px] font-black uppercase text-slate-400 sticky top-0 z-20">
                               <tr>
                                   <th className="p-3 border-r border-slate-700 w-[100px] sticky left-0 bg-slate-800 z-30">
                                       Kode
                                       <input className="mt-1 w-full bg-slate-700 border-none rounded text-white px-1 py-0.5 text-[9px]" placeholder="Filter..." value={columnFilters.code} onChange={e => setColumnFilters({...columnFilters, code: e.target.value})} />
                                   </th>
                                   <th className="p-3 border-r border-slate-700 w-[150px] sticky left-[100px] bg-slate-800 z-30">
                                       Unit Kerja
                                       <input className="mt-1 w-full bg-slate-700 border-none rounded text-white px-1 py-0.5 text-[9px]" placeholder="Filter..." value={columnFilters.unit} onChange={e => setColumnFilters({...columnFilters, unit: e.target.value})} />
                                   </th>
                                   <th className="p-3 border-r border-slate-700 w-[150px]">
                                       Sasaran
                                       {/* Sasaran Generik / Kategori */}
                                       <input className="mt-1 w-full bg-slate-700 border-none rounded text-white px-1 py-0.5 text-[9px]" placeholder="Filter..." value={columnFilters.sasaran} onChange={e => setColumnFilters({...columnFilters, sasaran: e.target.value})} />
                                   </th>
                                   <th className="p-3 border-r border-slate-700 w-[150px]">
                                       Aktivitas
                                       <input className="mt-1 w-full bg-slate-700 border-none rounded text-white px-1 py-0.5 text-[9px]" placeholder="Filter..." value={columnFilters.aktivitas} onChange={e => setColumnFilters({...columnFilters, aktivitas: e.target.value})} />
                                   </th>
                                   <th className="p-3 border-r border-slate-700 w-[200px]">
                                       Risiko
                                       <input className="mt-1 w-full bg-slate-700 border-none rounded text-white px-1 py-0.5 text-[9px]" placeholder="Filter..." value={columnFilters.risiko} onChange={e => setColumnFilters({...columnFilters, risiko: e.target.value})} />
                                   </th>
                                   <th className="p-3 border-r border-slate-700 w-[200px]">
                                       Dampak
                                       <input className="mt-1 w-full bg-slate-700 border-none rounded text-white px-1 py-0.5 text-[9px]" placeholder="Filter..." value={columnFilters.impact} onChange={e => setColumnFilters({...columnFilters, impact: e.target.value})} />
                                   </th>
                                   <th className="p-3 border-r border-slate-700 w-[150px]">
                                       Rencana Mitigasi
                                   </th>
                                   
                                   {/* BASELINE INHERENT */}
                                   <th colSpan="3" className="p-1 text-center bg-blue-900 border-r border-slate-700">Inherent</th>
                                   
                                   {/* MONITORING PERIODS */}
                                   {filters.jenis === 'OPERASIONAL' ? (
                                       <>
                                         <th colSpan="3" className="p-1 text-center bg-slate-700 border-r border-slate-600">Q1</th>
                                         <th colSpan="3" className="p-1 text-center bg-slate-700 border-r border-slate-600">Q2</th>
                                         <th colSpan="3" className="p-1 text-center bg-slate-700 border-r border-slate-600">Q3</th>
                                         <th colSpan="3" className="p-1 text-center bg-slate-700 border-r border-slate-600">Q4</th>
                                       </>
                                   ) : (
                                       monthKeys.map(m => (
                                           <th key={m} colSpan="3" className="p-1 text-center bg-slate-700 border-r border-slate-600">{m.toUpperCase()}</th>
                                       ))
                                   )}
                                   
                                   {/* TARGET */}
                                   <th colSpan="3" className="p-1 text-center bg-emerald-900 border-r border-slate-700">Target</th>
                               </tr>
                               {/* SUB HEADER L, C, S */}
                               <tr className="bg-slate-800 text-white text-[9px]">
                                   <th className="sticky left-0 bg-slate-800 z-30"></th>
                                   <th className="sticky left-[100px] bg-slate-800 z-30"></th>
                                   <th colSpan="5"></th>
                                   
                                   <th className="text-center w-8 bg-blue-900/50">L</th>
                                   <th className="text-center w-8 bg-blue-900/50">C</th>
                                   <th className="text-center w-8 bg-blue-900/50">S</th>

                                   {filters.jenis === 'OPERASIONAL' ? (
                                        [1,2,3,4].map(q => (
                                            <React.Fragment key={q}>
                                                <th className="text-center w-8 bg-slate-700/50 border-l border-slate-600">L</th>
                                                <th className="text-center w-8 bg-slate-700/50">C</th>
                                                <th className="text-center w-8 bg-slate-700/50 border-r border-slate-600">S</th>
                                            </React.Fragment>
                                        ))
                                   ) : (
                                        monthKeys.map(m => (
                                            <React.Fragment key={m}>
                                                <th className="text-center w-8 bg-slate-700/50 border-l border-slate-600">L</th>
                                                <th className="text-center w-8 bg-slate-700/50">C</th>
                                                <th className="text-center w-8 bg-slate-700/50 border-r border-slate-600">S</th>
                                            </React.Fragment>
                                        ))
                                   )}

                                   <th className="text-center w-8 bg-emerald-900/50 border-l border-slate-700">L</th>
                                   <th className="text-center w-8 bg-emerald-900/50">C</th>
                                   <th className="text-center w-8 bg-emerald-900/50">S</th>
                               </tr>
                          </thead>
                          <tbody className="text-xs divide-y divide-slate-100 bg-white">
                               {filteredTable.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((row, idx) => (
                                   <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                                       <td className="p-3 font-mono font-bold text-blue-600 border-r border-slate-100 sticky left-0 bg-white group-hover:bg-slate-50 z-20">
                                            <a href="#" className="hover:underline">{row.code}</a>
                                       </td>
                                       <td className="p-3 border-r border-slate-100 sticky left-[100px] bg-white group-hover:bg-slate-50 z-20 text-[10px]">{row.unitKerja}</td>
                                       <td className="p-3 border-r border-slate-100 text-[10px]">{row.kategoriRisiko}</td>
                                       <td className="p-3 border-r border-slate-100 text-[10px]">{row.aktivitasGenerik}</td>
                                       <td className="p-3 border-r border-slate-100 font-bold text-slate-700 text-[10px]">{row.desc}</td>
                                       <td className="p-3 border-r border-slate-100 text-[10px]">{row.impact}</td>
                                       <td className="p-3 border-r border-slate-100 text-[10px] italic text-slate-500">Mitigasi perbaikan SOP dan pengawasan berkala...</td>
                                       
                                       {/* Inherent */}
                                       <td className="p-2 text-center bg-blue-50/30 text-[10px] font-bold">{row.inherent.l}</td>
                                       <td className="p-2 text-center bg-blue-50/30 text-[10px] font-bold">{row.inherent.c}</td>
                                       <td className="p-2 text-center bg-blue-50/30 text-[10px] font-black">{row.inherent.l * row.inherent.c}</td>

                                       {/* Monitoring */}
                                       {filters.jenis === 'OPERASIONAL' ? (
                                           // Map quarters (Mar, Jun, Sep, Des)
                                           ['mar', 'jun', 'sep', 'des'].map(m => {
                                               const d = row.monitoring[m] || { l: '-', c: '-' };
                                               const s = d.l !== '-' ? d.l * d.c : '-';
                                               return (
                                                <React.Fragment key={m}>
                                                    <td className="p-2 text-center border-l border-slate-100 text-[10px]">{d.l}</td>
                                                    <td className="p-2 text-center text-[10px]">{d.c}</td>
                                                    <td className="p-2 text-center border-r border-slate-100 text-[10px] font-bold">{s}</td>
                                                </React.Fragment>
                                               )
                                           })
                                       ) : (
                                           monthKeys.map(m => {
                                               const d = row.monitoring[m] || { l: '-', c: '-' };
                                               const s = d.l !== '-' ? d.l * d.c : '-';
                                               return (
                                                <React.Fragment key={m}>
                                                    <td className="p-2 text-center border-l border-slate-100 text-[10px]">{d.l}</td>
                                                    <td className="p-2 text-center text-[10px]">{d.c}</td>
                                                    <td className="p-2 text-center border-r border-slate-100 text-[10px] font-bold">{s}</td>
                                                </React.Fragment>
                                               )
                                           })
                                       )}

                                       {/* Target */}
                                       <td className="p-2 text-center bg-emerald-50/30 border-l border-slate-100 text-[10px] font-bold">{row.target.l}</td>
                                       <td className="p-2 text-center bg-emerald-50/30 text-[10px] font-bold">{row.target.c}</td>
                                       <td className="p-2 text-center bg-emerald-50/30 text-[10px] font-black">{row.target.l * row.target.c}</td>
                                   </tr>
                               ))}
                          </tbody>
                       </table>
                   </div>
                   
                   {/* Pagination Controls */}
                   <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white">
                        <span className="text-[10px] font-bold text-slate-400">
                            Show {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTable.length)} of {filteredTable.length} entries
                        </span>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setCurrentPage(curr => Math.max(curr - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-50 text-slate-500 border border-transparent hover:border-slate-200 transition-all"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-xs font-bold text-slate-600 py-1.5 px-3 bg-slate-50 rounded border border-slate-100">{currentPage}</span>
                            <button 
                                onClick={() => setCurrentPage(curr => Math.min(curr + 1, Math.ceil(filteredTable.length / itemsPerPage)))}
                                disabled={currentPage >= Math.ceil(filteredTable.length / itemsPerPage)}
                                className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-50 text-slate-500 border border-transparent hover:border-slate-200 transition-all"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                   </div>
                </div>

                {/* 6. COST SECTION (Biaya Mitigasi) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                     <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Database size={18} className="text-blue-600" />
                        Biaya Mitigasi
                        <InfoTooltip text="Analisis anggaran biaya mitigasi risiko." />
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b flex items-center justify-between bg-white shrink-0">
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase leading-none">{selectedCellData.title}</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">{selectedCellData.subtitle}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-auto bg-slate-50 p-0">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 sticky top-0 z-10 shadow-sm text-[10px] font-black uppercase text-slate-500">
                  <tr>
                    <th className="p-4 border-b">Kode</th>
                    <th className="p-4 border-b">Sasaran Strategis</th>
                    <th className="p-4 border-b">Aktivitas</th>
                    <th className="p-4 border-b">Risiko</th>
                    <th className="p-4 border-b">Sebab</th>
                    <th className="p-4 border-b">Dampak</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100 text-xs text-slate-600">
                  {selectedCellData.risks.map((risk, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 align-top font-mono font-bold text-blue-600">
                        <a href="#" className="bg-blue-50 px-2 py-1 rounded hover:underline">{risk.code}</a>
                      </td>
                      <td className="p-4 align-top">{risk.kategoriRisiko || '-'}</td>
                      <td className="p-4 align-top">{risk.aktivitasGenerik || '-'}</td>
                      <td className="p-4 align-top font-bold text-slate-800">{risk.desc}</td>
                      <td className="p-4 align-top">{risk.cause}</td>
                      <td className="p-4 align-top">{risk.impact}</td>
                    </tr>
                  ))}
                  {selectedCellData.risks.length === 0 && (
                     <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-400 italic">Tidak ada data risiko.</td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
             <div className="p-4 bg-white border-t border-slate-100 text-center shrink-0">
                <button onClick={() => setShowModal(false)} className="px-6 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-600 transition-colors uppercase tracking-wide">Tutup</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
