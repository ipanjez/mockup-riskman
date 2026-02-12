// src/components/DashboardFilter.jsx
import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { ORG_STRUCTURE } from '../data/dummyData';

const DashboardFilter = ({ currentUser, onFilterChange }) => {
  const [filters, setFilters] = useState({
    jenisPengelolaan: '',
    periode: '',
    unitKerja: 'All', // Can be specific dept
    tahun: '2025'
  });

  // Role-based logic for 'Jenis Pengelolaan'
  const getJenisPengelolaanOptions = () => {
    if (currentUser.role === 'PIC SISMEN') {
      return currentUser.assignment || [];
    }
    return ['Operasional', 'Proyek', 'Strategis', 'ISO 27001', 'SMK3'];
  };

  // Logic for 'Periode' based on 'Jenis Pengelolaan'
  const getPeriodeOptions = () => {
    if (filters.jenisPengelolaan === 'Operasional' || filters.jenisPengelolaan === 'Strategis') {
      return ['Q1', 'Q2', 'Q3', 'Q4'];
    }
    // Default monthly
    return [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
  };

  const handleApply = () => {
    onFilterChange(filters);
  };

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm px-6 py-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Title / Context */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Filter size={20} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Filter Dashboard</h2>
            <p className="text-xs text-slate-500">Sesuaikan tampilan data risiko</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          
          {/* Jenis Pengelolaan */}
          <div className="flex flex-col">
            <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">Jenis Risiko</label>
            <select 
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-40 p-2"
              value={filters.jenisPengelolaan}
              onChange={(e) => setFilters({...filters, jenisPengelolaan: e.target.value})}
            >
              <option value="">-- Pilih Jenis --</option>
              {getJenisPengelolaanOptions().map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Tahun */}
          <div className="flex flex-col">
            <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">Tahun</label>
            <select 
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-24 p-2"
              value={filters.tahun}
              onChange={(e) => setFilters({...filters, tahun: e.target.value})}
            >
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>

          {/* Periode */}
          <div className="flex flex-col">
            <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">Periode</label>
            <select 
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-32 p-2"
              value={filters.periode}
              onChange={(e) => setFilters({...filters, periode: e.target.value})}
              disabled={!filters.jenisPengelolaan}
            >
              <option value="">Semua Periode</option>
              {getPeriodeOptions().map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

           {/* Unit Kerja - Recursive breakdown skipped for brevity, implementing simulate flat structure */}
           <div className="flex flex-col">
            <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">Unit Kerja</label>
            <select 
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-48 p-2"
              value={filters.unitKerja}
              onChange={(e) => setFilters({...filters, unitKerja: e.target.value})}
            >
              <option value="All">Semua Unit Kerja</option>
              {Object.keys(ORG_STRUCTURE).map(dir => (
                <optgroup label={dir} key={dir}>
                  {Object.keys(ORG_STRUCTURE[dir]).map(komp => (
                    <option key={komp} value={komp}>{komp}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Button */}
          <div className="flex flex-col justify-end h-full mt-5">
             <button 
              onClick={handleApply}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
             >
                Terapkan
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardFilter;
