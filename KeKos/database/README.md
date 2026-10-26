# Database KeKos — Sprint 2 (MySQL)

- `schema.sql` membuat (ulang) database `kekos` dan tabel: `users`, `kos`, `kamar`, `booking`, `ulasan`, `notifikasi`
- `seed.sql` mengisi data contoh: 6 kos terverifikasi lengkap dengan tipe kamar, ulasan, dan titik peta

## Import lewat MySQL Workbench
1. Buka koneksi **Local instance MySQL**.
2. **File → Open SQL Script...** → pilih `schema.sql` → klik ⚡ **Execute**.
3. **File → Open SQL Script...** → pilih `seed.sql` → klik ⚡ **Execute**.
4. Panel **Schemas** → klik kanan → **Refresh All**.

Perhatian: `schema.sql` menghapus database `kekos` yang lama sebelum membuat ulang.

## Import lewat terminal
```bash
mysql -u root -p < schema.sql
mysql -u root -p < seed.sql
```

## Akun contoh (password: `password123`)
- `pencari@kekos.test`, `siti@gmail.com`, `dyandra@gmail.com` (pencari kos, bisa login)
- `pemilik@kekos.test`, `agus@gmail.com`, `dewi@gmail.com` hanya sebagai pemilik data kos contoh.
  Login pemilik kos belum tersedia di Sprint 2.
