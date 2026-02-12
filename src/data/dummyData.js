// src/data/dummyData.js

export const USERS = [
  { id: 1, name: "Super Admin", role: "Superadmin", unit_kerja: "All", jabatan: "Head", avatar: "SA" },
  { id: 2, name: "Budi Santoso", role: "SVP", unit_kerja: "Direktorat Operasi", jabatan: "SVP Operasi", avatar: "BS" },
  { id: 3, name: "Siti Aminah", role: "VP", unit_kerja: "Departemen Produksi 1A", parent_unit: "Direktorat Operasi", jabatan: "VP Produksi", avatar: "SA" },
  { id: 4, name: "Andi Wijaya", role: "AVP", unit_kerja: "Bagian Mesin", parent_unit: "Departemen Produksi 1A", jabatan: "AVP Mesin", avatar: "AW" },
  { id: 5, name: "Dewi Staff", role: "Staff", unit_kerja: "Bagian Mesin", parent_unit: "Departemen Produksi 1A", jabatan: "Staff Mesin", avatar: "DS" },
  { id: 6, name: "Rina PIC", role: "PIC SISMEN", unit_kerja: "Departemen K3", assignment: ["ISO 27001", "SMK3"], avatar: "RP" },
];

export const ORG_STRUCTURE = {
  "Direktorat Utama": {
    "Kompartemen SDM": ["Departemen HR", "Departemen Umum"],
    "Kompartemen Keuangan": ["Departemen Akuntansi", "Departemen Anggaran"]
  },
  "Direktorat Operasi": {
    "Kompartemen Pabrik 1": ["Departemen Produksi 1A", "Departemen Pemeliharaan 1"],
    "Kompartemen Pabrik 2": ["Departemen Produksi 2A", "Departemen K3"]
  }
};

export const RISK_LEVELS = {
  1: "Low", 2: "Low to Moderate", 3: "Moderate", 4: "Moderate to High", 5: "High"
};

// 5x5 Matrix helper
// Likelihood (1-5) x Consequence (1-5)
export const MATRIX_COLOR = {
  "1-1": "green", "1-2": "green", "1-3": "green", "1-4": "yellow", "1-5": "red",
  "2-1": "green", "2-2": "green", "2-3": "yellow", "2-4": "red", "2-5": "red",
  "3-1": "green", "3-2": "yellow", "3-3": "yellow", "3-4": "red", "3-5": "red",
  "4-1": "green", "4-2": "yellow", "4-3": "red", "4-4": "red", "4-5": "red",
  "5-1": "yellow", "5-2": "red", "5-3": "red", "5-4": "red", "5-5": "red"
};

export const RISKS_DATA = [
  {
    id: "R-001",
    kode_risiko: "RISK-OP-2025-001",
    sasaran: "Pencapaian Target Produksi",
    aktivitas: "Operasional Pabrik 1A",
    risiko: "Kerusakan Kompresor Utama",
    sebab: "Maintenance tidak terjadwal",
    dampak: "Stop pabrik 2 hari",
    inherent_likelihood: 4,
    inherent_consequence: 4, // High
    residual_likelihood: 2,
    residual_consequence: 3, // Lower
    biaya_mitigasi: 150000000, 
    tipe_biaya: "CAPEX",
    unit_kerja: "Departemen Produksi 1A",
    periode: "Q1-2025",
    status_dokumen: "Menunggu Approval VP",
    status_monitoring: "Berjalan",
    jenis_pengelolaan: "Operasional",
    pemilik: 5 // Dewi Staff
  },
  {
    id: "R-002",
    kode_risiko: "RISK-K3-2025-012",
    sasaran: "Zero Accident",
    aktivitas: "Safety Patrol",
    risiko: "Kecelakaan Kerja Ringan",
    sebab: "APD tidak lengkap",
    dampak: "Cidera ringan personel",
    inherent_likelihood: 3,
    inherent_consequence: 2, // Moderate
    residual_likelihood: 1,
    residual_consequence: 2, // Low
    biaya_mitigasi: 25000000,
    tipe_biaya: "OPEX",
    unit_kerja: "Departemen K3",
    periode: "Q1-2025",
    status_dokumen: "Final",
    status_monitoring: "Selesai",
    jenis_pengelolaan: "SMK3",
    pemilik: 6 // Rina PIC
  },
  {
    id: "R-003",
    kode_risiko: "RISK-FIN-2025-005",
    sasaran: "Stabilitas Cashflow",
    aktivitas: "Pembayaran Vendor",
    risiko: "Keterlambatan Pembayaran",
    sebab: "Sistem ERP Down",
    dampak: "Denda keterlambatan",
    inherent_likelihood: 2,
    inherent_consequence: 3,
    residual_likelihood: 1,
    residual_consequence: 1,
    biaya_mitigasi: 0,
    tipe_biaya: "OPEX",
    unit_kerja: "Departemen Akuntansi",
    periode: "Q1-2025",
    status_dokumen: "Draft",
    status_monitoring: "Baru",
    jenis_pengelolaan: "Operasional",
    pemilik: 2 // Budi Santoso (Example)
  },
  {
    id: "R-004",
    kode_risiko: "RISK-PROJ-2026-001",
    sasaran: "Implementasi ISO 27001",
    aktivitas: "Audit Internal",
    risiko: "Temuan Mayor Audit",
    sebab: "Prosedur belum sosialisasi",
    dampak: "Sertifikasi tertunda",
    inherent_likelihood: 3,
    inherent_consequence: 4,
    residual_likelihood: 2,
    residual_consequence: 2,
    biaya_mitigasi: 50000000,
    tipe_biaya: "OPEX",
    unit_kerja: "Departemen HR",
    periode: "Q1-2026",
    status_dokumen: "Revisi",
    status_monitoring: "Menunggu Approval",
    jenis_pengelolaan: "ISO 27001",
    pemilik: 6
  },
  {
    id: "R-005",
    kode_risiko: "RISK-OP-2025-006",
    sasaran: "Efisiensi Energi",
    aktivitas: "Penggunaan Listrik Pabrik",
    risiko: "Pemborosan Energi > 5%",
    sebab: "Sensor otomatis rusak",
    dampak: "Biaya operasional naik",
    inherent_likelihood: 5,
    inherent_consequence: 2,
    residual_likelihood: 3,
    residual_consequence: 2,
    biaya_mitigasi: 75000000,
    tipe_biaya: "CAPEX",
    unit_kerja: "Departemen Pemeliharaan 1",
    periode: "Q2-2025",
    status_dokumen: "Final",
    status_monitoring: "Berjalan",
    jenis_pengelolaan: "Operasional",
    pemilik: 3
  },
  {
    id: "R-006",
    kode_risiko: "RISK-IT-2025-003",
    sasaran: "Keamanan Data",
    aktivitas: "Server Maintenance",
    risiko: "Serangan Ransomware",
    sebab: "Firewall outdated",
    dampak: "Kehilangan data kritis",
    inherent_likelihood: 2,
    inherent_consequence: 5, // Extreme impact
    residual_likelihood: 1,
    residual_consequence: 5,
    biaya_mitigasi: 500000000,
    tipe_biaya: "CAPEX",
    unit_kerja: "Departemen Umum",
    periode: "Q3-2025",
    status_dokumen: "Menunggu Approval SVP",
    status_monitoring: "Baru",
    jenis_pengelolaan: "Operasional",
    pemilik: 1
  }
];
