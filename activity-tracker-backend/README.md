# Activity Tracker API (NestJS + PostgreSQL + Prisma ORM)

Backend REST API untuk aplikasi **Todo & Activity Tracker** yang dibangun menggunakan framework **NestJS**, basis data **PostgreSQL**, dan **Prisma ORM** sebagai pemenuhan tugas **Bab 10 - Implementasi REST API + PostgreSQL + ORM (Prisma)**.

---

## 1. Arsitektur & Teknologi
* **Framework:** NestJS 12
* **Database:** PostgreSQL 18
* **ORM:** Prisma ORM 6
* **Port Server:** `3000` (Default)
* **Koneksi Database:** `postgresql://postgres:4uLmosttt@localhost:5432/activity_tracker_db?schema=public`

---

## 2. Struktur Model Prisma (`schema.prisma`)
Entitas utama dirancang untuk mendukung manajemen tugas harian dan subtask:

* **Model `Task` (`tasks`):**
  * `id`: Int (Primary Key, Auto Increment)
  * `title`: String (Judul Catatan/Tugas)
  * `description`: String? (Deskripsi opsional)
  * `category`: String (Default: 'Internal')
  * `completed`: Boolean (Default: false)
  * `starred`: Boolean (Default: false)
  * `createdAt`: DateTime (Timestamp dibuat)
  * `updatedAt`: DateTime (Timestamp diperbarui)
  * `subtasks`: Relasi 1-ke-banyak dengan model `Subtask`

* **Model `Subtask` (`subtasks`):**
  * `id`: Int (Primary Key, Auto Increment)
  * `text`: String (Isi subtask)
  * `completed`: Boolean (Default: false)
  * `taskId`: Int (Foreign Key ke `Task`, dengan `onDelete: Cascade`)
  * `createdAt`: DateTime

---

## 3. Daftar Endpoint REST API

| Method | Endpoint | Deskripsi | Keterangan |
| :--- | :--- | :--- | :--- |
| `GET` | `/tasks` | Mengambil seluruh daftar tugas | Mendukung query `?status=completed` atau `?status=in-progress` |
| `GET` | `/tasks/stats` | Statistik agregasi tugas | **(Nilai Tambah / Poin 6)**: Menghitung total, selesai, dan in-progress |
| `GET` | `/tasks/:id` | Mengambil satu tugas berdasarkan ID | Menyertakan relasi subtasks |
| `POST` | `/tasks` | Menambahkan tugas baru | Menerima payload title, description, category, subtasks |
| `PATCH` | `/tasks/:id` | Memperbarui sebagian data tugas | Mengubah status selesai, bintang, atau judul |
| `DELETE` | `/tasks/:id` | Menghapus tugas secara permanen | Menghapus data dan subtasks terkait dari PostgreSQL |

---

## 4. Panduan Menjalankan Backend

1. **Instalasi Dependensi:**
   ```bash
   cd activity-tracker-backend
   npm install
   ```

2. **Migrasi Database PostgreSQL:**
   ```bash
   npx prisma migrate dev
   ```

3. **Membuka Prisma Studio (GUI Basis Data):**
   ```bash
   npx prisma studio
   ```

4. **Menjalankan Server NestJS:**
   ```bash
   npm run start:dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.
