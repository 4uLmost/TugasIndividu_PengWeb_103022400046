# Activity Tracker Fullstack

Aplikasi pelacak aktivitas dan catatan tugas harian berbasis web fullstack. Proyek ini menghubungkan antarmuka frontend berbasis React dengan REST API NestJS yang terhubung secara permanen ke basis data PostgreSQL menggunakan Prisma ORM.

Proyek ini dibuat untuk memenuhi **Tugas Perkuliahan BAB 10 - Implementasi REST API + PostgreSQL + ORM (Prisma)**.

---

## 1. Teknologi

- **Frontend:** React 19, Vite, Tailwind CSS
- **Backend:** NestJS 12, Node.js (ESM), TypeScript
- **ORM:** Prisma 6
- **Database:** PostgreSQL

---

## 2. Struktur Direktori

```text
├── activity-tracker-backend/    # REST API NestJS & konfigurasi Prisma
│   ├── prisma/                  # schema.prisma, migrasi, dan seed
│   ├── src/
│   │   ├── categories/          # Modul manajemen kategori
│   │   ├── prisma/              # PrismaService & PrismaModule
│   │   ├── tasks/               # Modul CRUD task & subtask
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
├── activity-tracker-frontend/   # Antarmuka web React
│   ├── src/
│   │   ├── components/          # Komponen UI (Card, Modal, List, Sidebar, Summary)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── Dokumentasi/                 # Tangkapan layar bukti pengujian
└── README.md
```

---

## 3. Skema Data (Prisma ORM)

Entitas data dirancang pada file `activity-tracker-backend/prisma/schema.prisma`:

- **Task**: Menyimpan informasi tugas (`id`, `title`, `description`, `category`, `completed`, `starred`, `createdAt`, `updatedAt`).
- **Subtask**: Menyimpan rincian subtask dengan relasi `onDelete: Cascade` ke `Task` (`id`, `text`, `completed`, `taskId`, `createdAt`).
- **Category**: Menyimpan daftar kategori yang terdaftar (`id`, `name`, `createdAt`).

---

## 4. Cara Menjalankan Proyek

### A. Prasyarat
- Node.js versi 20+
- PostgreSQL server lokal berjalan pada port 5432
- Basis data PostgreSQL dibuat dengan nama: `activity_tracker_db`

### B. Menjalankan Backend (NestJS + Prisma)

1. Masuk ke direktori backend:
   ```bash
   cd activity-tracker-backend
   ```
2. Salin file environment:
   ```bash
   copy .env.example .env
   ```
   *Sesuaikan kredensial username dan password PostgreSQL pada `.env`.*
3. Pasang dependensi dan generate Prisma Client:
   ```bash
   npm install
   npx prisma generate
   ```
4. Jalankan migrasi basis data dan seed kategori awal:
   ```bash
   npx prisma migrate dev --name init
   node prisma/seed.js
   ```
5. Jalankan server backend:
   ```bash
   npm run start:dev
   ```
   *Server backend berjalan di `http://localhost:3000`.*

### C. Menjalankan Frontend (React + Vite)

1. Buka terminal baru dan masuk ke direktori frontend:
   ```bash
   cd activity-tracker-frontend
   ```
2. Pasang dependensi:
   ```bash
   npm install
   ```
3. Jalankan aplikasi frontend:
   ```bash
   npm run dev
   ```
   *Frontend berjalan di `http://localhost:5173`.*

---

## 5. Dokumentasi Endpoint REST API

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/tasks` | Mengambil seluruh daftar catatan tugas |
| `GET` | `/tasks?status=in-progress` | Query filter tugas yang belum selesai |
| `GET` | `/tasks?status=completed` | Query filter tugas yang telah selesai |
| `GET` | `/tasks/stats` | *(Nilai Tambah)* Statistik jumlah total, selesai, in-progress, dan berbintang |
| `GET` | `/tasks/:id` | Mengambil rincian 1 tugas beserta daftar subtask |
| `POST` | `/tasks` | Menambahkan catatan tugas baru beserta subtask |
| `PATCH` | `/tasks/:id` | Memperbarui catatan tugas (update status, konten, atau subtask) |
| `DELETE` | `/tasks/:id` | Menghapus tugas secara permanen dari basis data |
| `GET` | `/categories` | Mengambil daftar kategori dari PostgreSQL |
| `POST` | `/categories` | Menambahkan label kategori baru |
| `DELETE` | `/categories/:id` | Menghapus label kategori |

---

## 6. Dokumentasi Tahapan & Bukti Pengujian

Berikut adalah dokumentasi tangkapan layar pengujian fitur CRUD, persistensi data PostgreSQL, penanganan error, dan endpoint nilai tambah:

### Tahap 1: Kondisi Awal (Daftar Kosong)
Tampilan awal antarmuka sebelum ada data tugas yang ditambahkan.

![Tahap 1 - Data Kosong](Dokumentasi/data%20masih%20kosong-1.png)

---

### Tahap 2: Menambahkan Catatan Baru (Create)
Pengisian formulir modal catatan baru dengan data judul, deskripsi, subtask, dan pemilihan kategori yang tersinkronisasi dari PostgreSQL.

![Tahap 2 - Tambah Task](Dokumentasi/tambah%20task-2.png)

---

### Tahap 3: Catatan Berhasil Ditambahkan (Read)
Data catatan tugas baru berhasil disimpan dan langsung ditampilkan pada antarmuka pengguna.

![Tahap 3 - Task Berhasil Ditambahkan](Dokumentasi/taks%20berhasil%20di%20tambahkan-3.png)

---

### Tahap 4: Verifikasi Data di PostgreSQL
Pengecekan record data pada tabel PostgreSQL yang membuktikan bahwa data tersimpan di basis data melalui Prisma ORM.

![Tahap 4 - Bukti Data di PostgreSQL](Dokumentasi/bukti%20data%20berhasil%20di%20tambahkan%20ke%20postgree-4.png)

---

### Tahap 5: Membuka Menu Edit Catatan
Membuka menu opsi aksi tiga titik (`•••`) pada kartu catatan dan memilih opsi "Edit Catatan".

![Tahap 5 - Menekan Tombol Edit](Dokumentasi/menekan%20tombol%20edit%20catatan-5.png)

---

### Tahap 6: Mengubah Data Catatan (Update)
Mengubah rincian data tugas pada formulir modal edit.

![Tahap 6 - Mengubah Isi Data](Dokumentasi/merubah%20isi%20data-6.png)

---

### Tahap 7: Perubahan Data Berhasil Disimpan
Tampilan kartu tugas setelah data berhasil diperbarui melalui request `PATCH` ke backend.

![Tahap 7 - Data Berhasil Diubah](Dokumentasi/data%20berhasil%20di%20ubah-7.png)

---

### Tahap 8: Mematikan Server Backend
Menghentikan proses server NestJS untuk menguji ketahanan dan persistensi penyimpanan permanen.

![Tahap 8 - Mematikan Backend](Dokumentasi/mematikan%20backend-8.png)

---

### Tahap 9: Penanganan Error Saat Backend Mati
Antarmuka pengguna menampilkan status error koneksi secara responsif ketika komunikasi dengan server terputus.

![Tahap 9 - Error Saat Backend Mati](Dokumentasi/tampilan%20ketika%20backend%20di%20matikan-9.png)

---

### Tahap 10: Menjalankan Kembali Server Backend
Menjalankan kembali server NestJS.

![Tahap 10 - Menyalakan Kembali Backend](Dokumentasi/menyalakan%20kembali%20backend-10.png)

---

### Tahap 11: Pembuktian Persistensi Data
Setelah server kembali aktif dan halaman dimuat ulang, seluruh data catatan tugas tetap utuh dan tersimpan secara permanen di PostgreSQL.

![Tahap 11 - Data Tetap Ada](Dokumentasi/data%20masih%20ada-11.png)

---

### Tahap 12: Menghapus Catatan (Delete)
Memilih menu aksi hapus tugas untuk menghapus catatan tertentu.

![Tahap 12 - Hapus Task](Dokumentasi/hapus%20task-12.png)

---

### Tahap 13: Tugas Terhapus dari Antarmuka
Catatan tugas telah berhasil dihapus dari daftar tampilan frontend.

![Tahap 13 - Data Terhapus](Dokumentasi/data%20terhapus-13.png)

---

### Tahap 14: Verifikasi Penghapusan di PostgreSQL
Pengecekan basis data PostgreSQL yang membuktikan bahwa baris data tugas dan relasi subtask-nya telah terhapus.

![Tahap 14 - Bukti Data Terhapus](Dokumentasi/bukti%20data%20terhapus-14.png)

---

### Tahap 15: Pengujian Endpoint Nilai Tambah
Hasil pengujian endpoint query lanjutan `GET /tasks/stats` yang mengembalikan ringkasan statistik data catatan secara dinamis.

![Tahap 15 - Endpoint Nilai Tambah](Dokumentasi/endpoint%20untuk%20nilai%20tambahan-15.png)
