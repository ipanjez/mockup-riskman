# RiskMan Dashboard - Mockup

Aplikasi mockup dashboard Risk Management (RiskMan) yang dibuat menggunakan React dan Vite. Aplikasi ini menampilkan peta risiko, status monitoring, dan tabel detail risiko dengan fitur filter dan sorting.

## Fitur Utama

- **Peta Risiko (Risk Matrix)**: Visualisasi level risiko (Inherent, Residual, Target).
- **Dashboard Status**: Summary status risiko (Draft, Berjalan, Selesai, dll).
- **Monitoring Table**: Tabel monitoring lengkap dengan baseline (Inherent, Residual, Target) dan detail bulanan (Jan-Des 2026).
- **Filter & Search**: Pencarian berdasarkan kode, deskripsi, sebab, dan dampak.

## Prasyarat

Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) di komputer Anda.

## Cara Menjalankan di Lokal (Komputer Sendiri)

1.  Buka terminal (Command Prompt atau PowerShell) di folder ini.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Jalankan aplikasi:
    ```bash
    npm run dev
    ```
4.  Buka browser dan kunjungi alamat yang muncul (biasanya `http://localhost:5173`).

## Cara Publish ke Publik Secara Gratis (GitHub Pages)

Anda bisa mempublikasikan aplikasi ini secara gratis menggunakan GitHub Pages. Ikuti langkah-langkah berikut:

### Langkah 1: Buat Repository di GitHub
1.  Buka [GitHub.com](https://github.com) dan login.
2.  Buat repository baru (klik tombol "+" di pojok kanan atas -> New repository).
3.  Beri nama (misalnya `riskman-dashboard`) dan biarkan settingan lain default. Klik "Create repository".

### Langkah 2: Upload Kode ke GitHub
Kembali ke folder proyek Anda di komputer, buka terminal dan jalankan perintah berikut satu per satu:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
# Ganti URL di bawah ini dengan URL repository yang baru Anda buat
git remote add origin https://github.com/USERNAME_ANDA/riskman-dashboard.git
git push -u origin main
```

### Langkah 3: Setup Deploy Otomatis
1.  Di terminal komputer Anda (VS Code), matikan server (Ctrl+C) lalu jalankan:
    ```bash
    npm install gh-pages --save-dev
    ```
2.  Buka file `package.json`, tambahkan baris berikut di bagian paling atas (di bawah `"private": true,` tapi sebelum `"scripts"` atau di antaranya):
    ```json
    "homepage": "https://USERNAME_ANDA.github.io/riskman-dashboard",
    ```
    *(Ganti `USERNAME_ANDA` dengan username GitHub Anda dan `riskman-dashboard` dengan nama repository Anda)*

3.  Masih di `package.json`, tambahkan script deploy di bagian `scripts`:
    ```json
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
    ```

4.  Jalankan perintah deploy:
    ```bash
    npm run deploy
    ```

5.  Tunggu sebentar, lalu buka link yang Anda tulis di `homepage` tadi. Aplikasi Anda sudah online!

---

**Catatan**: Jika Anda melihat halaman kosong saat deploy, pastikan `vite.config.js` sudah memiliki properti `base` yang sesuai.
Saat ini settingan `base` di `vite.config.js` adalah `./` yang seharusnya sudah aman untuk sebagian besar kasus deployment statis.
