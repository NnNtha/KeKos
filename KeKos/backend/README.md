# KeKos Backend (Node.js + Express + MySQL) — Sprint 2

## Menjalankan
1. Siapkan database dulu (lihat `../database/README.md`).
2. Salin `.env.example` menjadi `.env`, lalu isi `DB_PASSWORD` dengan password root MySQL kamu.
3. Jalankan:
   ```bash
   npm install
   npm run dev
   ```
   Server jalan di http://localhost:3000. Butuh Node.js versi 20.6 atau lebih baru.

## API
Semua URL di bawah `/api`. Yang bertanda 🔒 perlu header `Authorization: Bearer <token>` dari login.

| Method | URL | Peran | Keterangan |
|---|---|---|---|
| GET | `/health` | | cek server hidup |
| POST | `/auth/register` | | `{ nama, email, telepon, password }` (selalu jadi pencari kos) |
| POST | `/auth/login` | | `{ email, password }` → `{ token, user }`. Sprint 2 hanya menerima akun pencari kos |
| GET | `/auth/me` | 🔒 semua | user yang sedang login |
| GET | `/kos` | | kos terverifikasi; filter `?tipe=&min=&max=&fasilitas=AC,Wifi&q=` |
| GET | `/kos/:id` | | detail kos + tipe kamar + ulasan |
| POST | `/kos/:id/ulasan` | 🔒 pencari | `{ rating, isi }` |
| DELETE | `/kos/:id/ulasan/:ulasanId` | 🔒 penulis ulasan | hapus ulasan |
| GET | `/booking?kos_id=` | 🔒 pencari | booking milik sendiri |
| POST | `/booking` | 🔒 pencari | `{ kamar_id }` |
| GET | `/notifikasi` | 🔒 semua | notifikasi milik sendiri |
| PATCH | `/notifikasi/baca` | 🔒 semua | tandai semua sudah dibaca |


## Struktur
```
src/
  server.js           titik awal, daftar route
  db.js               koneksi MySQL
  middleware/auth.js  cek token login
  routes/auth.js      register, login, me
  routes/kos.js       data kos untuk pencari
  routes/booking.js   booking pencari
  routes/notifikasi.js notifikasi pencari
  format.js           ubah baris database jadi JSON
```
