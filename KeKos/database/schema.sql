-- Skema database KeKos Sprint 2 - Fitur Pencari Kos (MySQL / MariaDB)
-- PERHATIAN: file ini menghapus database kekos lama (kalau ada) lalu membuatnya ulang.
DROP DATABASE IF EXISTS kekos;
CREATE DATABASE IF NOT EXISTS kekos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kekos;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  telepon VARCHAR(20) NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('pencari', 'pemilik') NOT NULL DEFAULT 'pencari', -- Sprint 2: yang bisa login hanya pencari
  status ENUM('aktif', 'nonaktif') NOT NULL DEFAULT 'aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pemilik_id INT NULL,
  nama VARCHAR(150) NOT NULL,
  tipe ENUM('putra', 'putri', 'campur') NOT NULL DEFAULT 'campur',
  area VARCHAR(100) NULL,               -- contoh: "Ketintang"
  jarak VARCHAR(100) NULL,              -- contoh: "800 meter dari Telkom University"
  alamat VARCHAR(255) NULL,
  lat DECIMAL(10, 7) NULL,              -- titik lokasi di peta, contoh: -7.3117
  lng DECIMAL(10, 7) NULL,              -- contoh: 112.7275
  deskripsi TEXT NULL,
  jumlah_kamar INT NOT NULL DEFAULT 0,
  fasilitas VARCHAR(255) NULL,          -- dipisah koma, contoh: "Wifi,AC,K. Mandi Dalam"
  foto VARCHAR(500) NULL,               -- nama file gambar, dipisah koma kalau lebih dari satu
  status ENUM('menunggu', 'terverifikasi', 'ditolak') NOT NULL DEFAULT 'terverifikasi',
  aktif BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (pemilik_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS kamar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kos_id INT NOT NULL,
  tipe VARCHAR(50) NOT NULL,            -- contoh: "Tipe A"
  harga_per_bulan INT NOT NULL,
  jumlah INT NOT NULL DEFAULT 0,        -- jumlah kamar yang masih tersedia
  fasilitas VARCHAR(255) NULL,
  deskripsi VARCHAR(255) NULL,
  foto VARCHAR(500) NULL,
  aktif BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (kos_id) REFERENCES kos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS booking (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kos_id INT NOT NULL,
  kamar_id INT NULL,
  pencari_id INT NOT NULL,
  tanggal_masuk DATE NULL,
  status ENUM('menunggu', 'diterima', 'ditolak') NOT NULL DEFAULT 'menunggu',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (kos_id) REFERENCES kos(id) ON DELETE CASCADE,
  FOREIGN KEY (kamar_id) REFERENCES kamar(id) ON DELETE SET NULL,
  FOREIGN KEY (pencari_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ulasan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kos_id INT NOT NULL,
  user_id INT NOT NULL,
  rating TINYINT NOT NULL,              -- 1 sampai 5
  isi TEXT NOT NULL,
  membantu INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (kos_id) REFERENCES kos(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifikasi (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  jenis ENUM('sukses', 'info', 'peringatan', 'error') NOT NULL DEFAULT 'info',
  judul VARCHAR(150) NOT NULL,
  pesan VARCHAR(255) NOT NULL,
  sudah_dibaca BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
