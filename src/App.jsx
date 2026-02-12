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
  Activity as ActivityIcon,
  Map
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

// --- HIERARCHY CONSTANTS ---
const ORG_HIERARCHY = {
  'Direktorat Utama': {
    'Kompartemen Internal Audit': ['Departemen Audit Operasional', 'Departemen Audit Keuangan'],
    'Kompartemen Sekretaris Perusahaan': ['Departemen Hukum', 'Departemen Komunikasi', 'Departemen CSR']
  },
  'Direktorat Operasi': {
    'Kompartemen Pabrik 1': ['Departemen Produksi 1A', 'Departemen Produksi 1B', 'Departemen K3'],
    'Kompartemen Pabrik 2': ['Departemen Produksi 2A', 'Departemen Produksi 2B', 'Departemen Lingkungan Hidup'],
    'Kompartemen Pemeliharaan': ['Departemen Listrik', 'Departemen Instrumen', 'Departemen Mekanikal']
  },
  'Direktorat Teknik & Pengembangan': {
    'Kompartemen Riset': ['Departemen Inovasi Produk', 'Departemen Pengembangan Bisnis'],
    'Kompartemen Proyek': ['Departemen Proyek Strategis', 'Departemen Konstruksi']
  },
  'Direktorat Keuangan': {
    'Kompartemen Akuntansi': ['Departemen Akuntansi Manajemen', 'Departemen Akuntansi Keuangan'],
    'Kompartemen Perbendaharaan': ['Departemen Pajak', 'Departemen Anggaran']
  },
  'Direktorat SDM & Umum': {
    'Kompartemen SDM': ['Departemen Rekrutmen', 'Departemen Pengembangan Karir', 'Departemen Payroll'],
    'Kompartemen Umum': ['Departemen Pengadaan', 'Departemen Keamanan', 'Departemen IT']
  }
};

const ALL_GRADES = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'TKNO'];

// --- DATA GENERATOR ---
const generateDummyData = () => {
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
    
    // Flatten hierarchy for random selection
    const flatUnits = [];
    Object.keys(ORG_HIERARCHY).forEach(dir => {
        Object.keys(ORG_HIERARCHY[dir]).forEach(komp => {
            ORG_HIERARCHY[dir][komp].forEach(dept => {
                flatUnits.push({ dir, komp, dept });
            });
        });
    });
    
    // Palet warna untuk risiko
    const colors = [
        'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 
        'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 
        'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500'
    ];

    // KRI Items
    const kriItems = [
      { name: 'Kecelakaan Kerja', unit: 'Kasus' },
      { name: 'Downtime Mesin', unit: 'Jam' },
      { name: 'Customer Complaint', unit: 'Keluhan' },
      { name: 'Inventory Turnover', unit: 'Kali' },
      { name: 'Cash Flow Ratio', unit: '%' }
    ];

    return Array.from({ length: 300 }, (_, i) => {
        const type = types[Math.floor(Math.random() * types.length)];
        const unitObj = flatUnits[Math.floor(Math.random() * flatUnits.length)];
        const status = allStatuses[Math.floor(Math.random() * allStatuses.length)];
        const period = periods[Math.floor(Math.random() * periods.length)];
        const category = sasaranGenerik[Math.floor(Math.random() * sasaranGenerik.length)];
        const grade = ALL_GRADES[Math.floor(Math.random() * ALL_GRADES.length)];
        const kri = kriItems[Math.floor(Math.random() * kriItems.length)];
        
        // Generate Scores
        const inL = Math.ceil(Math.random() * 5);
        const inC = Math.ceil(Math.random() * 5);
        const resL = Math.max(1, inL - Math.floor(Math.random() * 3));
        const resC = Math.max(1, inC - Math.floor(Math.random() * 2));
        const tarL = Math.max(1, resL - 1);
        const tarC = Math.max(1, resC - 1);

        // KRI Data
        const kriReal = Math.floor(Math.random() * 100);

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
            desc: `Risiko terkait ${type.toLowerCase()} - ${category} pada ${unitObj.dept} - Isu #${i + 1}`,
            cause: `Penyebab teknis atau non-teknis yang teridentifikasi pada audit ${period}`,
            impact: `Dampak potensial terhadap operasional dan finansial sebesar Rp ${(Math.random() * 10).toFixed(1)} M`,
            status,
            jenisRisiko: type,
            kategoriRisiko: category, // Sasaran Generik
            aktivitasGenerik: aktivitasGenerik[Math.floor(Math.random() * aktivitasGenerik.length)],
            taksonomiRisiko: taksonomiRisiko[Math.floor(Math.random() * taksonomiRisiko.length)],
            grade: grade,
            direktorat: unitObj.dir,
            kompartemen: unitObj.komp,
            unitKerja: unitObj.dept, // Using dept as unitKerja
            periode: period,
            owner: `User ${Math.floor(Math.random() * 50) + 1}`, // Simulated Owner ID
            inherent: { l: inL, c: inC },
            residual: { l: resL, c: resC },
            target: { l: tarL, c: tarC },
            monitoring,
            biaya: Math.floor(Math.random() * 5000000000), // 0 - 5 M
            kri: {
              name: kri.name,
              satuan: kri.unit,
              safe: '< 10',
              warning: '10 - 20',
              danger: '> 20',
              realisasi: kriReal
            }
        };
    });
};

const App = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => { const t = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(t); }, []);
  const formatDate = (d) => d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const formatTime = (d) => d.toLocaleTimeString('id-ID', { hour12: false }).replace(/\./g, ':');

  const [selectedCellData, setSelectedCellData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [hoveredRiskId, setHoveredRiskId] = useState(null); 

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
      case 'Low to Moderate': return 'text-lime-700 bg-lime-100 border-lime-200'; 
      case 'Low': return 'text-emerald-800 bg-emerald-100 border-emerald-200'; 
      default: return 'text-slate-400 bg-slate-50 border-slate-200';
    }
  };

  // --- DATA & STATE ---
  const [currentUser, setCurrentUser] = useState({ 
      id: 'User 1', 
      roles: ['Superadmin'], 
      name: 'Farhan Jezando', 
      unit: 'Departemen K3', 
      kompartemen: 'Kompartemen Pabrik 1',
      direktorat: 'Direktorat Operasi'
  });
  
  const [filters, setFilters] = useState({ 
      jenis: 'OPERASIONAL', 
      periode: 'Semua Periode', 
      direktorat: 'Semua Direktorat',
      kompartemen: 'Semua Kompartemen',
      departemen: 'Semua Departemen',
      chartCategory: 'Sasaran Generik',
      grades: [...ALL_GRADES] // Default all checked
  });
  
  const [rawData] = useState(() => generateDummyData());

  // Helper to get period options
  const getPeriodOptions = (type) => {
      if (type === 'INDIVIDU') {
          return ['Semua Periode', 'M1-2026', 'M2-2026', 'M3-2026', 'M4-2026', 'M5-2026', 'M6-2026', 'M7-2026', 'M8-2026', 'M9-2026', 'M10-2026', 'M11-2026', 'M12-2026'];
      } else if (type === 'OPERASIONAL') {
          return ['Semua Periode', 'Q1-2025', 'Q2-2025', 'Q3-2025', 'Q4-2025', 'Q1-2026', 'Q2-2026', 'Q3-2026', 'Q4-2026'];
      } else {
          return ['Semua Periode', 'Y1-2025', 'Y2-2026'];
      }
  };

  // --- FILTERING LOGIC ---
  const risksList = useMemo(() => {
      return rawData.filter(item => {
          // 1. Basic Filters
          const matchesJenis = item.jenisRisiko === filters.jenis;
          const matchesPeriode = filters.periode === 'Semua Periode' || item.periode.includes(filters.periode) || filters.periode.includes('Y1') || filters.periode.includes('Y2'); 
          const matchesGrade = filters.grades.includes(item.grade);

          // 2. Hierarchy Logic & RBAC
          let matchesHierarchy = true;
          const userRoles = currentUser.roles || [];
          const isSuperOrAdmin = userRoles.some(r => ['Superadmin', 'Admin MRK', 'Viewer'].includes(r));

          if (isSuperOrAdmin) {
              // Apply dropdown filters
              if (filters.direktorat !== 'Semua Direktorat' && item.direktorat !== filters.direktorat) matchesHierarchy = false;
              if (filters.kompartemen !== 'Semua Kompartemen' && item.kompartemen !== filters.kompartemen) matchesHierarchy = false;
              if (filters.departemen !== 'Semua Departemen' && item.unitKerja !== filters.departemen) matchesHierarchy = false;
          } else {
              // Restrict to user's unit
              if (item.unitKerja !== currentUser.unit) matchesHierarchy = false;
          }

          return matchesJenis && matchesPeriode && matchesGrade && matchesHierarchy;
      });
  }, [rawData, filters, currentUser]);

  // Data for Charts
  const chartData = useMemo(() => {
      // Group by Category
      const grouped = {};
      const order = ['High', 'Moderate to High', 'Moderate', 'Low to Moderate', 'Low']; // Explicit order

      risksList.forEach(r => {
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
  }, [risksList, filters.chartCategory]);

  // --- LOGIC TAMBAHAN ---
  const pendingRisks = useMemo(() => {
    return risksList.filter(r => {
        const residualScore = r.residual.l * r.residual.c;
        const targetScore = r.target.l * r.target.c;
        return residualScore > targetScore;
    });
  }, [risksList]);
  
  const activeRisksCount = useMemo(() => risksList.filter(r => r.status !== 'Draft').length, [risksList]);
  const inactiveRisksCount = useMemo(() => risksList.filter(r => r.status === 'Selesai Monitoring').length, [risksList]);
  
  // STATS HELPERS
  const registerStatusOrder = [
      'Draft', 'Revisi', 'Baru', 
      'Menunggu Approval VP/PM Unit Kerja', 
      'Menunggu Approval SVP Unit Kerja', 
      'Menunggu Approval VP MRK', 
      'Menunggu Approval SVP TKMR'
  ];

  // Export Excel Handlers (existing implementation kept)
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

  const filteredTable = useMemo(() => {
    let result = [...risksList].filter(item => {
      const check = (val, filter) => (val || '').toLowerCase().includes((filter || '').toLowerCase());
      return (
        check(item.code, columnFilters.code) &&
        check(item.unitKerja, columnFilters.unit) &&
        check(item.desc, columnFilters.risiko) &&
        (columnFilters.status === '' || item.status === columnFilters.status)
      );
    });
    // ... sorting ...
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [risksList, columnFilters, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleStatusClick = (statusLabel) => {
    setSelectedCellData({
      title: `Risiko Berstatus: ${statusLabel}`,
      subtitle: `Menampilkan daftar risiko dalam tahap ${statusLabel}`,
      risks: risksList.filter(r => r.status === statusLabel).map(r => ({ ...r }))
    });
    setShowModal(true);
  };

  const handleLevelClick = (label, type) => {
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
          subtitle: `Likelihood ${r}, Consequence ${c}`,
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
            Peta {title}
          </h3>
        </div>
        
        <div className="flex-grow flex flex-col justify-center mb-6">
          <div className="relative">
            <div className="absolute -left-6 top-1/2 -rotate-90 origin-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Likelihood</div>
            <div className="grid grid-cols-5 gap-1 ml-4 border border-slate-200 p-0.5 bg-slate-50">
              {rows.map(r => cols.map(c => {
                const risksInCell = list.filter(risk => risk[type].l === r && risk[type].c === c);
                const hasRisks = risksInCell.length > 0;
                return (
                  <div 
                    key={`${r}-${c}`} 
                    onClick={() => hasRisks && handleCellClick(r, c)}
                    className={`h-12 w-full flex flex-wrap gap-0.5 p-0.5 items-center justify-center rounded-sm border border-white relative transition-all ${getCellColor(r, c)} ${hasRisks ? 'cursor-pointer hover:brightness-95 hover:scale-105 z-10' : ''}`}
                  >
                    {risksInCell.slice(0, 4).map(risk => (
                      <div key={risk.id} className={`w-2.5 h-2.5 rounded-full ${risk.color} shadow-sm border border-white`}></div>
                    ))}
                    {risksInCell.length > 4 && <span className="text-[8px] font-black text-slate-500">+{risksInCell.length - 4}</span>}
                  </div>
                );
              }))}
            </div>
            <div className="text-center mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Consequence</div>
          </div>
        </div>
        
        {/* LEGEND SUMMARY */}
        <div className="mt-auto border-t pt-3">
           <div className="flex flex-wrap gap-2 justify-center">
              {['Low', 'Low to Moderate', 'Moderate', 'Moderate to High', 'High'].map(lvl => (
                <button key={lvl} onClick={() => handleLevelClick(lvl, type)} className="flex flex-col items-center p-1 rounded hover:bg-slate-50 min-w-[50px]">
                     <div className={`w-3 h-3 rounded-full mb-1 ${getLevelColorClass(lvl).split(' ')[1]}`}></div>
                     <span className="text-[9px] font-bold text-slate-500">{levelCounts[lvl] || 0}</span>
                </button>
              ))}
           </div>
        </div>
      </div>
    );
  };

  const SidebarItem = ({ icon, label, active = false, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
      <div className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}`}>{icon}</div>
      {sidebarOpen && <span className="text-xs font-bold font-sans tracking-wide whitespace-nowrap">{label}</span>}
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-20 shadow-xl fixed h-full left-0 top-0 overflow-hidden`}>
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

         {sidebarOpen && (
            <div className="p-6 border-b border-slate-100 flex flex-col items-center text-center shrink-0">
                <div className="w-16 h-16 rounded-full bg-blue-100 border-4 border-white shadow-lg mb-3 flex items-center justify-center overflow-hidden">
                    <User size={32} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm leading-tight px-2">{currentUser.name}</h3>
                <div className="flex flex-wrap gap-1 mt-2 w-full justify-center">
                    {['Superadmin', 'Karyawan', 'Admin MRK', 'Viewer'].map(role => (
                        <button
                            key={role}
                            onClick={() => {
                                const roles = currentUser.roles || [];
                                if (roles.includes(role)) {
                                    if (roles.length > 1) setCurrentUser({...currentUser, roles: roles.filter(r => r !== role)});
                                } else {
                                    setCurrentUser({...currentUser, roles: [...roles, role]});
                                }
                            }}
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                                (currentUser.roles || []).includes(role)
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>
         )}
         
         <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
            <SidebarItem 
              icon={<div className="p-1"><Home size={18} /></div>} 
              label="Dashboard" 
              active={activeTab === 'Dashboard'} 
              onClick={() => setActiveTab('Dashboard')} 
            />
             <SidebarItem 
              icon={<div className="p-1"><Info size={18} /></div>} 
              label="Informasi Dashboard" 
              active={activeTab === 'Informasi Dashboard'} 
              onClick={() => setActiveTab('Informasi Dashboard')} 
            />
         </nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col h-screen overflow-hidden relative bg-slate-50 transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'}`}>
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 sticky top-0 shadow-sm shrink-0">
           <div className="text-sm font-bold text-slate-400">{formatDate(currentTime)}</div>
           <div className="flex items-center gap-4">
               <button onClick={() => setShowNotification(true)} className="p-2.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-colors relative">
                 <Bell size={20} />
                 {pendingRisks.length > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>}
               </button>
           </div>
        </header>
  
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          
          {/* Top Banner */}
          <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-6 mb-8 text-white relative overflow-hidden shadow-xl shadow-blue-900/10 flex items-center justify-between min-h-[140px]">
                 <div className="relative z-10">
                     <h1 className="text-2xl font-bold mb-2 tracking-tight">{activeTab === 'Dashboard' ? 'Executive Dashboard' : 'Informasi Dashboard'}</h1>
                     <p className="text-blue-100 text-sm font-medium opacity-80 max-w-xl">
                        {activeTab === 'Dashboard' 
                           ? "Ringkasan performa pengelolaan risiko perusahaan secara real-time."
                           : "Informasi dan panduan penggunaan dashboard."}
                     </p>
                 </div>
                 {/* Navigation Toggle in Banner */}
                 <div className="relative z-10 flex bg-blue-800/50 p-1 rounded-lg backdrop-blur-sm">
                    {['Dashboard', 'Informasi Dashboard'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${
                                activeTab === tab ? 'bg-white text-blue-900 shadow-lg' : 'text-blue-100 hover:bg-white/10'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                 </div>
                 <div className="absolute right-0 top-0 h-full w-2/3 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          </div>

          {activeTab === 'Dashboard' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* 1. FILTER SECTION (Dynamic) */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex flex-wrap gap-4 items-end">
                        <div className="w-full md:w-auto min-w-[150px]">
                             <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Jenis Pengelolaan</label>
                             <select 
                                value={filters.jenis} 
                                onChange={(e) => {
                                    const newType = e.target.value;
                                    setFilters({ ...filters, jenis: newType, periode: getPeriodOptions(newType)[0] });
                                }}
                                className="w-full bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="OPERASIONAL">OPERASIONAL</option>
                                <option value="STRATEGIS">STRATEGIS</option>
                            </select>
                        </div>
                        <div className="w-full md:w-auto min-w-[150px]">
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Periode</label>
                            <select 
                                value={filters.periode}
                                onChange={(e) => setFilters({...filters, periode: e.target.value})}
                                className="w-full bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-100"
                            >
                                {getPeriodOptions(filters.jenis).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        
                        {/* Grade Checkbox Filter */}
                        <div className="relative group z-30">
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Grade Risiko</label>
                             <button className="w-full min-w-[180px] flex items-center justify-between gap-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 hover:bg-slate-100 text-slate-700">
                                <span>{filters.grades.length === ALL_GRADES.length ? 'Semua Grade' : `${filters.grades.length} terpilih`}</span>
                                <ChevronDown size={14} />
                            </button>
                            <div className="hidden group-hover:block absolute left-0 top-full mt-1 w-48 bg-white border border-slate-200 shadow-xl rounded-lg p-2 max-h-60 overflow-y-auto">
                                <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer text-[10px] font-bold text-slate-800 border-b border-slate-50 pb-2 mb-1">
                                    <input 
                                        type="checkbox"
                                        checked={filters.grades.length === ALL_GRADES.length}
                                        onChange={(e) => setFilters({...filters, grades: e.target.checked ? [...ALL_GRADES] : []})}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-0"
                                    />
                                    Pilih Semua
                                </label>
                                {ALL_GRADES.map(g => (
                                    <label key={g} className="flex items-center gap-2 px-2 py-1 hover:bg-slate-50 rounded cursor-pointer text-[10px] font-medium text-slate-600">
                                        <input 
                                            type="checkbox" 
                                            checked={filters.grades.includes(g)}
                                            onChange={(e) => {
                                                const newGrades = e.target.checked 
                                                    ? [...filters.grades, g]
                                                    : filters.grades.filter(item => item !== g);
                                                setFilters({...filters, grades: newGrades});
                                            }}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-0"
                                        />
                                        {g}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Hierarchical Filters (RBAC Limited) */}
                        {currentUser.roles.some(r => ['Superadmin', 'Admin MRK', 'Viewer'].includes(r)) && (
                          <>
                             <div className="w-full md:w-auto min-w-[180px]">
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Direktorat</label>
                                <select 
                                    value={filters.direktorat}
                                    onChange={(e) => setFilters({
                                        ...filters, 
                                        direktorat: e.target.value,
                                        kompartemen: 'Semua Kompartemen',
                                        departemen: 'Semua Departemen'
                                    })}
                                    className="w-full bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-100"
                                >
                                    <option>Semua Direktorat</option>
                                    {Object.keys(ORG_HIERARCHY).map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            
                            {filters.direktorat !== 'Semua Direktorat' && (
                                <div className="w-full md:w-auto min-w-[180px]">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Kompartemen</label>
                                    <select 
                                        value={filters.kompartemen}
                                        onChange={(e) => setFilters({...filters, kompartemen: e.target.value, departemen: 'Semua Departemen'})}
                                        className="w-full bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option>Semua Kompartemen</option>
                                        {Object.keys(ORG_HIERARCHY[filters.direktorat]).map(k => <option key={k} value={k}>{k}</option>)}
                                    </select>
                                </div>
                            )}

                             {filters.kompartemen !== 'Semua Kompartemen' && (
                                <div className="w-full md:w-auto min-w-[180px]">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Departemen</label>
                                    <select 
                                        value={filters.departemen}
                                        onChange={(e) => setFilters({...filters, departemen: e.target.value})}
                                        className="w-full bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option>Semua Departemen</option>
                                        {ORG_HIERARCHY[filters.direktorat][filters.kompartemen].map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            )}
                          </>
                        )}
                        {!currentUser.roles.some(r => ['Superadmin', 'Admin MRK', 'Viewer'].includes(r)) && (
                            <div className="w-full md:w-auto px-4 py-2 bg-slate-100 rounded text-xs text-slate-500 italic border border-slate-200">
                                Menampilkan data: {currentUser.unit}
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. SUMMARY CARDS - Responsive Grid */}
                <div>
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center">
                            Register Risk Status
                     </h4>
                     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 w-full">
                        {registerStatusOrder.map((lbl, i) => {
                            const count = risksList.filter(r => r.status === lbl).length;
                            return (
                                <div key={i} onClick={() => handleStatusClick(lbl)} className="bg-white border border-slate-200 hover:border-blue-300 p-3 rounded-xl flex flex-col justify-center items-center cursor-pointer group hover:shadow-md transition-all">
                                    <span className="text-2xl font-black text-slate-700 group-hover:text-blue-600">{count}</span>
                                    <span className="text-[9px] font-bold text-slate-400 text-center uppercase leading-tight line-clamp-2 mt-1">{lbl}</span>
                                </div>
                            )
                        })}
                     </div>
                </div>

                
                {/* 3. CHART & MAP & COMPLETENESS */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* CHART */}
                    <div className="xl:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800 text-lg">Level Risiko Berdasarkan Kategori</h3>
                             <select 
                                value={filters.chartCategory}
                                onChange={(e) => setFilters({...filters, chartCategory: e.target.value})}
                                className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 rounded px-3 py-2 outline-none"
                             >
                                <option value="Sasaran Generik">Sasaran Generik</option>
                                <option value="Aktivitas Generik">Aktivitas Generik</option>
                             </select>
                        </div>
                        <div className="h-[300px]">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} interval={0} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                    <Legend iconSize={8} wrapperStyle={{fontSize:'10px'}} />
                                    <Bar dataKey="High" stackId="a" fill="#dc2626" />
                                    <Bar dataKey="Moderate to High" stackId="a" fill="#f97316" />
                                    <Bar dataKey="Moderate" stackId="a" fill="#eab308" />
                                    <Bar dataKey="Low to Moderate" stackId="a" fill="#84cc16" />
                                    <Bar dataKey="Low" stackId="a" fill="#059669" radius={[4, 4, 0, 0]} />
                                </BarChart>
                             </ResponsiveContainer>
                        </div>
                    </div>

                    {/* COMPLETENESS STATS */}
                    <div className="space-y-4">
                         {/* Existing Filtered Stats */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                             <h3 className="font-bold text-slate-800 text-sm mb-4">Kelengkapan Jumlah Risiko</h3>
                             <div className="space-y-3">
                                {Object.values(ORG_HIERARCHY['Direktorat Operasi']['Kompartemen Pabrik 1']).slice(0, 5).map((dept, i) => {
                                    const total = risksList.filter(r => r.unitKerja === dept).length;
                                    const target = 50; // Dummy target
                                    const pct = Math.min(100, Math.round((total / target) * 100));
                                    return (
                                        <div key={i}>
                                            <div className="flex justify-between text-[10px] mb-1">
                                                <span className="font-bold text-slate-600 truncate max-w-[150px]">{dept}</span>
                                                <span className={`font-black ${pct < 80 ? 'text-orange-500' : 'text-green-600'}`}>{pct}% ({total}/{target})</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${pct < 80 ? 'bg-orange-400' : 'bg-green-500'}`} style={{width: `${pct}%`}}></div>
                                            </div>
                                        </div>
                                    )
                                })}
                             </div>
                        </div>

                        {/* New Percentage Filler Stats */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                             <h3 className="font-bold text-slate-800 text-sm mb-4">Kelengkapan Persentase Pengisi</h3>
                             <div className="flex items-center gap-4">
                                 <div className="w-16 h-16 rounded-full border-4 border-slate-100 flex items-center justify-center relative">
                                     <span className="text-xs font-black text-blue-600">85%</span>
                                     <svg className="absolute inset-0 w-full h-full -rotate-90 stroke-blue-600" viewBox="0 0 100 100">
                                          <circle cx="50" cy="50" r="46" fill="transparent" strokeWidth="8" strokeDasharray="289" strokeDashoffset="43" strokeLinecap="round" />
                                     </svg>
                                 </div>
                                 <div>
                                     <p className="text-xs font-bold text-slate-700">Total Responden</p>
                                     <p className="text-[10px] text-slate-400">124 dari 145 Karyawan telah mengisi</p>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>

                {/* 4. RISK MAPS (3 Maps Grid) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     <RiskMatrix title="Inherent" type="inherent" />
                     <RiskMatrix title="Residual" type="residual" />
                     <RiskMatrix title="Target" type="target" />
                </div>

                {/* 5. KRI TABLE (New Section) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-5 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Activity size={18} className="text-blue-600" /> Rekapitulasi Key Risk Indicator (KRI)
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-500">
                                <tr>
                                    <th className="p-3 border-r border-slate-100 w-[250px]">Key Risk Indicator</th>
                                    <th className="p-3 border-r border-slate-100 w-[100px] text-center">Satuan</th>
                                    <th className="p-3 border-r border-slate-100 w-[120px] text-center bg-blue-50/50">Realisasi (YTD)</th>
                                    <th className="p-3 border-r border-slate-100 w-[150px] text-center bg-green-50/50">Kriteria Aman</th>
                                    <th className="p-3 border-r border-slate-100 w-[150px] text-center bg-yellow-50/50">Kriteria Waspada</th>
                                    <th className="p-3 w-[150px] text-center bg-red-50/50">Kriteria Bahaya</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs divide-y divide-slate-100">
                                {risksList.slice(0, 5).map((r, i) => (
                                    <tr key={i} className="hover:bg-slate-50">
                                        <td className="p-3 border-r border-slate-100 font-bold text-slate-700">{r.kri.name}</td>
                                        <td className="p-3 border-r border-slate-100 text-center text-slate-500">{r.kri.satuan}</td>
                                        <td className="p-3 border-r border-slate-100 text-center font-black text-blue-600 bg-blue-50/20">{r.kri.realisasi}</td>
                                        <td className="p-3 border-r border-slate-100 text-center bg-green-50/20">{r.kri.safe}</td>
                                        <td className="p-3 border-r border-slate-100 text-center bg-yellow-50/20">{r.kri.warning}</td>
                                        <td className="p-3 text-center bg-red-50/20">{r.kri.danger}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 6. MONITORING TABLE (Existing) & COST SECTION (Existing) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                     <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Database size={18} className="text-blue-600" />
                        Biaya Mitigasi
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
                                 <div className="h-full bg-blue-600 w-[32%] rounded-full"></div>
                             </div>
                         </div>
                     </div>
                </div>

             </div>
          )}

          {activeTab === 'Informasi Dashboard' && (
             <div className="flex flex-col items-center justify-center p-20 text-center animate-in fade-in zoom-in duration-300">
                <BarChart3 size={64} className="text-slate-200 mb-4" />
                <h3 className="text-xl font-bold text-slate-400">Content Informasi Dashboard</h3>
                <p className="text-slate-400 mt-2">Halaman statis untuk panduan dan informasi dashboard.</p>
             </div>
          )}

        </main>
      </div>
  
      {/* MODAL & POPUPS (Existing codes kept same, simplified) */}
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
               {/* Table Content */}
               <div className="p-8 text-center text-slate-400 italic">Table Details Component ...</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;