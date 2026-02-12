// src/App.jsx
import React, { useState, useMemo } from 'react';
import { 
  Users, Home, Info, ChevronLeft, ChevronRight, LayoutDashboard, 
  Menu, User, Settings, LogOut, Search, Bell
} from 'lucide-react';

import { USERS, RISKS_DATA } from './data/dummyData';
import DashboardFilter from './components/DashboardFilter';
import StatusCards from './components/StatusCards';
import RiskMap from './components/RiskMap';
import ChartsSection from './components/ChartsSection';
import RiskRecapTable from './components/RiskRecapTable';

const SidebarItem = ({ icon, label, active, onClick, collapsed }) => (
  <button 
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors
      ${active ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
      ${collapsed ? 'justify-center' : ''}
    `}
    title={collapsed ? label : ''}
  >
    {icon}
    {!collapsed && <span>{label}</span>}
  </button>
);

const App = () => {
  // --- STATE ---
  const [currentUser, setCurrentUser] = useState(USERS[0]); // Default Superadmin
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [globalFilters, setGlobalFilters] = useState({
    jenisPengelolaan: '',
    periode: '',
    unitKerja: 'All',
    tahun: '2025'
  });

  // --- FILTERING LOGIC (The Core Logic) ---
  const filteredRisks = useMemo(() => {
    let dataset = RISKS_DATA;

    // 1. Role Based Access Control (RBAC)
    if (currentUser.role === 'Superadmin') {
      // All access
    } else if (currentUser.role === 'Staff') {
      dataset = dataset.filter(r => r.pemilik === currentUser.id);
    } else if (currentUser.role === 'AVP' || currentUser.role === 'VP') {
       // Simplified: See unit_kerja or parent_unit logic
       // In real app, check hierarchy. Here mock strict equality + parent
       // Assuming 'parent_unit' === 'unit_kerja' for simplicity in mock data relations
       dataset = dataset.filter(r => r.unit_kerja === currentUser.unit_kerja || (currentUser.unit_kerja && r.unit_kerja.includes(currentUser.unit_kerja))); 
    } else if (currentUser.role === 'PIC SISMEN') {
       const assignments = currentUser.assignment || [];
       dataset = dataset.filter(r => assignments.includes(r.jenis_pengelolaan));
    }

    // 2. Apply Global Filters
    if (globalFilters.jenisPengelolaan) {
      dataset = dataset.filter(r => r.jenis_pengelolaan === globalFilters.jenisPengelolaan);
    }
    if (globalFilters.periode) {
      // Loose match for Q1, Q2 etc in string
      dataset = dataset.filter(r => r.periode.includes(globalFilters.periode));
    }
    if (globalFilters.unitKerja && globalFilters.unitKerja !== 'All') {
      // Simple exact match or includes for mock
      dataset = dataset.filter(r => r.unit_kerja === globalFilters.unitKerja);
    }
    
    return dataset;
  }, [currentUser, globalFilters]);


  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* 1. SIDEBAR */}
      <aside className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-20 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-16 flex items-center justify-center border-b border-slate-100 px-4">
           {sidebarOpen ? (
             <div className="flex items-center gap-2 font-bold text-xl text-blue-900">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">R</div>
               <span>RiskMan</span>
             </div>
           ) : (
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">R</div>
           )}
        </div>

        <nav className="flex-1 py-4 space-y-1 overflow-y-auto custom-scrollbar">
           <SidebarItem 
             icon={<LayoutDashboard size={20}/>} 
             label="Dashboard" 
             active={activeTab === 'Dashboard'} 
             onClick={() => setActiveTab('Dashboard')}
             collapsed={!sidebarOpen}
           />
           <SidebarItem 
             icon={<Info size={20}/>} 
             label="Informasi" 
             active={activeTab === 'Informasi'} 
             onClick={() => setActiveTab('Informasi')}
             collapsed={!sidebarOpen}
           />
           
           <div className={`mt-8 px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider ${!sidebarOpen && 'hidden'}`}>
             Admin Tools
           </div>
           <SidebarItem 
             icon={<Settings size={20}/>} label="Pengaturan" collapsed={!sidebarOpen}
             onClick={() => setActiveTab('Settings')}
           />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
             onClick={() => setSidebarOpen(!sidebarOpen)}
             className="w-full flex items-center justify-center p-2 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors"
          >
             {sidebarOpen ? <ChevronLeft size={20}/> : <ChevronRight size={20}/>}
          </button>
        </div>
      </aside>


      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shadow-sm shrink-0">
           {/* Breadcrumb / Title */}
           <div className="flex items-center gap-4">
              <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md"><Menu size={24}/></button>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">{activeTab}</h1>
           </div>

           {/* Right Actions: Search, Role Switcher, Profile */}
           <div className="flex items-center gap-4">
              <div className="relative hidden md:block group">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" size={16} />
                 <input 
                   type="text" 
                   placeholder="Cari risiko..." 
                   className="pl-9 pr-4 py-2 bg-slate-50 border border-transparent focus:bg-white focus:border-blue-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 w-64 transition-all"
                 />
              </div>

              {/* SIMULATION DROPDOWN */}
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5 hover:bg-amber-100 transition-colors">
                 <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Simulate Role:</span>
                 <select 
                   className="bg-transparent text-xs text-slate-700 font-bold border-none focus:ring-0 cursor-pointer outline-none"
                   value={currentUser.id}
                   onChange={(e) => {
                     const user = USERS.find(u => u.id === parseInt(e.target.value));
                     if (user) setCurrentUser(user);
                   }}
                 >
                    {USERS.map(u => (
                      <option key={u.id} value={u.id}>{u.role} - {u.name}</option>
                    ))}
                 </select>
              </div>

              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                  <div className="text-right hidden sm:block">
                      <p className="text-xs font-semibold text-slate-700">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-500">{currentUser.jabatan}</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-white ring-2 ring-slate-100 cursor-pointer">
                    {currentUser.avatar}
                  </div>
              </div>
           </div>
        </header>


        {/* CONTENT SCROLLABLE */}
        <div className="flex-1 overflow-y-auto bg-slate-50 scroll-smooth">
           
           {/* STICKY FILTER */}
           {activeTab === 'Dashboard' && (
              <DashboardFilter 
                currentUser={currentUser} 
                onFilterChange={setGlobalFilters} 
              />
           )}

           <div className="p-6 max-w-[1600px] mx-auto space-y-6 min-h-full">
              
              {activeTab === 'Dashboard' ? (
                <>
                  {/* SECTION B: Summary Cards */}
                  <StatusCards data={filteredRisks} />

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                     {/* SECTION C: Inherent Risk Map */}
                     <RiskMap 
                       title="Peta Risiko Inherent" 
                       data={filteredRisks}  // Inherent is default mapping in component logic if title contains 'Inherent'
                     />
                     {/* SECTION C: Residual Risk Map - using same component but need to ensure it uses Residual values */}
                     {/* The RiskMap component has internal logic: if (title.includes("Residual")) it uses residual keys. */}
                     <RiskMap 
                       title="Peta Risiko Residual" 
                       data={filteredRisks}
                     />
                     
                    {/* SECTION for simple stats or pie chart could go here, but for now spacer or maybe combine maps */}
                     <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg flex flex-col justify-between h-full min-h-[300px]">
                        <div>
                           <h3 className="text-lg font-bold mb-2">Completion Rate</h3>
                           <p className="text-blue-100 text-sm mb-6">Persentase kelengkapan data risiko unit kerja Anda.</p>
                           <div className="text-5xl font-black mb-2">85%</div>
                           <div className="w-full bg-blue-900/30 h-2 rounded-full overflow-hidden">
                              <div className="bg-white h-full w-[85%] rounded-full"></div>
                           </div>
                           <p className="text-xs mt-2 text-blue-200">Target Q1: 100%</p>
                        </div>
                        <button className="flex items-center gap-2 text-sm font-semibold hover:text-blue-200 transition-colors mt-4">
                           Lihat Detail <ChevronRight size={16}/>
                        </button>
                     </div>
                  </div>
                  
                   {/* SECTION D: Charts */}
                   <ChartsSection data={filteredRisks} />

                  {/* SECTION E: Recap Table */}
                  <RiskRecapTable data={filteredRisks} />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                   <div className="p-6 bg-white rounded-full shadow-sm mb-4">
                      <Info size={48} className="text-blue-500" />
                   </div>
                   <h3 className="text-lg font-medium text-slate-600">Halaman Informasi</h3>
                   <p className="max-w-md text-center mt-2 text-slate-500">
                     Konten informasi tambahan, panduan pengguna (User Manual), dan dokumentasi kebijakan manajemen risiko akan ditampilkan di sini.
                   </p>
                </div>
              )}
              
              {/* FOOTER - inside scroll area */}
              <footer className="pt-8 pb-4 text-center text-[10px] text-slate-400">
                  <p>RiskMan Dashboard System v2.0 &bull; PT Pupuk Kalimantan Timur &bull; &copy; 2026</p>
              </footer>
           </div>

        </div>

      </main>
    </div>
  );
};

export default App;
