# Sistem Penilaian Evaluasi Akuntabilitas Kinerja Instansi (AKIP)

Aplikasi web untuk mengelola dan mengevaluasi kinerja instansi pemerintah berdasarkan sistem AKIP (Akuntabilitas Kinerja Instansi Pemerintah).

## 📋 Daftar Isi

- [Persyaratan Sistem](#persyaratan-sistem)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Persiapan Awal](#persiapan-awal)
- [Instalasi dan Setup](#instalasi-dan-setup)
- [Konfigurasi](#konfigurasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Troubleshooting](#troubleshooting)

## 🖥️ Persyaratan System

Sebelum memulai, pastikan komputer Anda sudah terinstall:

- **Node.js** versi 18 atau lebih baru ([Download disini](https://nodejs.org/))
- **npm** (biasanya sudah terinstall bersama Node.js)
- **Git** ([Download disini](https://git-scm.com/))
- **Editor Code** seperti VS Code ([Download disini](https://code.visualstudio.com/))

### Cara Cek Versi yang Terinstall

Buka terminal/command prompt dan jalankan:

```bash
node --version
npm --version
git --version
```

## 🛠️ Teknologi yang Digunakan

- **Next.js 14** - Framework React untuk production
- **TypeScript** - Superset JavaScript dengan type safety
- **Prisma** - ORM untuk database
- **PostgreSQL** - Database (via Supabase)
- **NextAuth.js** - Authentication
- **Supabase** - Backend as a Service (Database + Storage)
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library untuk Tailwind
- **Chart.js** - Library untuk visualisasi data

## 📦 Persiapan Awal

### 1. Setup Supabase

#### 1.1. Buat Akun Supabase
1. Kunjungi [https://supabase.com](https://supabase.com)
2. Klik **"Start your project"** atau **"Sign Up"**
3. Daftar menggunakan GitHub atau email

#### 1.2. Buat Project Baru
1. Setelah login, klik **"New Project"**
2. Isi informasi berikut:
   - **Name**: `akip-database` (atau nama bebas)
   - **Database Password**: Buat password yang kuat (SIMPAN password ini!)
   - **Region**: Pilih yang terdekat (contoh: `Southeast Asia (Singapore)`)
   - **Pricing Plan**: Pilih **"Free"** untuk development
3. Klik **"Create new project"**
4. Tunggu beberapa menit hingga database siap

#### 1.3. Dapatkan Credentials
Setelah project selesai dibuat:

1. **Database URL**:
   - Buka tab **"Settings"** → **"Database"**
   - Scroll ke bagian **"Connection string"**
   - Pilih **"URI"** atau **"Postgres"**
   - Copy connection string (formatnya seperti: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)
   - Ganti `[YOUR-PASSWORD]` dengan password yang tadi Anda buat

2. **Supabase URL dan Anon Key**:
   - Buka tab **"Settings"** → **"API"**
   - Copy **"Project URL"** (contoh: `https://xxxxx.supabase.co`)
   - Copy **"anon public"** key (string panjang yang dimulai dengan `eyJ...`)

### 2. Setup Email (Gmail untuk NodeMailer)

Aplikasi ini menggunakan email untuk fitur reset password.

#### 2.1. Buat App Password Gmail
1. Login ke akun Gmail Anda
2. Buka [https://myaccount.google.com/security](https://myaccount.google.com/security)
3. Pastikan **2-Step Verification** sudah aktif. Jika belum, aktifkan terlebih dahulu
4. Cari **"App passwords"** atau **"Sandi aplikasi"**
5. Pilih **"Mail"** dan device **"Other (Custom name)"**
6. Ketik nama: `AKIP System`
7. Klik **"Generate"**
8. Copy 16 digit password yang muncul (SIMPAN password ini!)

### 3. Generate NextAuth Secret

Buka terminal dan jalankan salah satu perintah berikut:

**Windows (PowerShell):**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Mac/Linux:**
```bash
openssl rand -base64 32
```

Copy hasil outputnya, ini akan digunakan untuk `NEXTAUTH_SECRET`

## 🚀 Instalasi dan Setup

### Langkah 1: Clone Repository

```bash
# Clone project
git clone <URL-REPOSITORY-INI>

# Masuk ke folder project
cd sistem-penilaian-evaluasi-akuntabilitas-kinerja-instansi
```

### Langkah 2: Install Dependencies

```bash
npm install
```

Tunggu hingga proses selesai. Proses ini akan menginstall semua package yang diperlukan.

### Langkah 3: Setup Environment Variables

1. Copy file `.env.example` menjadi `.env`:

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**Mac/Linux:**
```bash
cp .env.example .env
```

2. Buka file `.env` dengan text editor
3. Isi semua nilai yang diperlukan:

```env
# Database URL dari Supabase
DATABASE_URL="postgresql://postgres:YOUR_SUPABASE_PASSWORD@db.xxxxx.supabase.co:5432/postgres"

# NextAuth Secret yang sudah di-generate
NEXTAUTH_SECRET="hasil-generate-secret-tadi"

# URL aplikasi (untuk development)
NEXTAUTH_URL="http://localhost:3000"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJxxxxxxxxxx..."

# Email Configuration (Gmail)
EMAIL_USER="emailanda@gmail.com"
EMAIL_PASS="16-digit-app-password-dari-gmail"

# Cron Secret (optional, buat sendiri atau kosongkan)
CRON_SECRET="secret-untuk-cron-jobs"
```

**⚠️ PENTING**: 
- Jangan commit file `.env` ke Git!
- File `.env` sudah ada di `.gitignore`
- Simpan credentials ini di tempat aman

### Langkah 4: Setup Database

#### 4.1. Generate Prisma Client

```bash
npx prisma generate
```

Perintah ini akan membuat Prisma Client berdasarkan schema yang ada.

#### 4.2. Jalankan Migrasi Database

```bash
npx prisma migrate deploy
```

Perintah ini akan membuat semua tabel yang diperlukan di database Supabase Anda.

#### 4.3. Seed Database (Optional)

Untuk mengisi database dengan data awal (user admin, dll):

```bash
npm run prisma:seed
```

**Data Default Setelah Seed:**
- Email admin: (cek file `prisma/seed.ts`)
- Password default: (cek file `prisma/seed.ts`)

### Langkah 5: Verifikasi Database

Anda bisa melihat database Anda dengan cara:

1. **Menggunakan Prisma Studio** (Visual Database Editor):
```bash
npx prisma studio
```
Browser akan terbuka di `http://localhost:5555`

2. **Atau via Supabase Dashboard**:
   - Buka project Supabase Anda
   - Klik tab **"Table Editor"**
   - Lihat tabel-tabel yang sudah dibuat

## 🏃 Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

**Hot Reload:** Perubahan pada code akan otomatis ter-refresh di browser.

### Production Build

```bash
# Build aplikasi
npm run build

# Jalankan production server
npm start
```

### Menjalankan Test

```bash
# Run semua test
npm test

# Run test dengan coverage
npm run test:cover

# Run test dalam watch mode
npm run test:watch
```

## 📖 Struktur Project

```
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Data seeding
│   └── migrations/        # Database migrations
├── public/                # Static files (images, fonts, etc)
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (admin)/      # Admin pages
│   │   ├── (auth)/       # Authentication pages
│   │   ├── (content)/    # Content pages
│   │   ├── (dashboard)/  # Dashboard pages
│   │   └── api/          # API routes
│   ├── components/       # Reusable components
│   ├── lib/              # Utility functions & configs
│   ├── styles/           # CSS modules
│   └── types/            # TypeScript type definitions
├── .env                  # Environment variables (JANGAN DI-COMMIT!)
├── .env.example          # Template environment variables
└── package.json          # Dependencies & scripts
```

## 🔑 Fitur Utama

- ✅ Authentication & Authorization (Role-based)
- ✅ Manajemen User & Team
- ✅ Sistem Evaluasi Kinerja
- ✅ Dashboard & Analytics
- ✅ Export Data (Excel, PDF)
- ✅ Comment System
- ✅ Activity Logging
- ✅ Responsive Design
- ✅ Dark Mode Support (DaisyUI)

## 🐛 Troubleshooting

### Error: "Cannot find module '@prisma/client'"

**Solusi:**
```bash
npx prisma generate
```

### Error: "Environment variable not found: DATABASE_URL"

**Solusi:**
- Pastikan file `.env` ada di root folder
- Pastikan `DATABASE_URL` terisi dengan benar
- Restart development server

### Error: Database Connection Failed

**Solusi:**
- Cek apakah Supabase project Anda masih aktif
- Cek ulang DATABASE_URL di file `.env`
- Pastikan password di connection string sudah benar
- Cek koneksi internet Anda

### Error saat `npm install`

**Solusi:**
```bash
# Hapus node_modules dan package-lock.json
rm -rf node_modules package-lock.json

# Install ulang
npm install
```

### Port 3000 sudah digunakan

**Solusi:**
```bash
# Jalankan di port lain
npm run dev -- -p 3001
```

Atau matikan aplikasi yang menggunakan port 3000.

### Error: "Module not found" setelah install package baru

**Solusi:**
```bash
# Restart development server
# Tekan Ctrl+C untuk stop, lalu jalankan lagi:
npm run dev
```

## 📚 Resource Belajar

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [DaisyUI Components](https://daisyui.com/components/)

## 🤝 Kontribusi

Jika Anda ingin berkontribusi:

1. Fork repository ini
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 License

[Tentukan license yang sesuai]

## 📞 Support

Jika mengalami kendala, silakan buat issue di repository ini atau hubungi tim developer.

---

**Happy Coding! 🚀**
