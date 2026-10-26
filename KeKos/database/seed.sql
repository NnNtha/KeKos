-- Data contoh Sprint 2. Password semua akun: password123
-- Akun pemilik di sini hanya sebagai pemilik data kos (fitur pemilik masuk Sprint 3), tidak bisa login.
USE kekos;

INSERT INTO users (id, nama, email, telepon, password_hash, role) VALUES
  (1, 'Contoh Pencari', 'pencari@kekos.test', '081234567890', '$2a$10$fdSqE3zvyILsvaxuV9WQyOxaAQ/l/orY3/ZYJ7HSE1VfMJ94atyCG', 'pencari'),
  (2, 'Budi Santoso', 'pemilik@kekos.test', '6281943332804', '$2a$10$fdSqE3zvyILsvaxuV9WQyOxaAQ/l/orY3/ZYJ7HSE1VfMJ94atyCG', 'pemilik'),
  (4, 'Siti Rahma', 'siti@gmail.com', '081200000001', '$2a$10$fdSqE3zvyILsvaxuV9WQyOxaAQ/l/orY3/ZYJ7HSE1VfMJ94atyCG', 'pencari'),
  (5, 'Agus Prasetyo', 'agus@gmail.com', '081200000002', '$2a$10$fdSqE3zvyILsvaxuV9WQyOxaAQ/l/orY3/ZYJ7HSE1VfMJ94atyCG', 'pemilik'),
  (6, 'Dyandra Alifyan Nugroho', 'dyandra@gmail.com', '081200000003', '$2a$10$fdSqE3zvyILsvaxuV9WQyOxaAQ/l/orY3/ZYJ7HSE1VfMJ94atyCG', 'pencari'),
  (8, 'Dewi S.', 'dewi@gmail.com', '081200000005', '$2a$10$fdSqE3zvyILsvaxuV9WQyOxaAQ/l/orY3/ZYJ7HSE1VfMJ94atyCG', 'pemilik');

INSERT INTO kos (id, pemilik_id, nama, tipe, area, jarak, alamat, lat, lng, deskripsi, jumlah_kamar, fasilitas, foto, status, updated_at) VALUES
  (1, 2, 'Kos Campur Premium', 'campur', 'Ketintang', '1 km dari Telkom University', 'Jl. Ketintang Baru No.10, Surabaya', -7.3141, 112.7262, 'Kos nyaman dekat kampus.', 13, 'Wifi,AC,K. Mandi Dalam', 'BUJANG-23-1.png', 'terverifikasi', NOW()),
  (2, 2, 'Cozy kos', 'putri', 'Ketintang', '500 meter dari Telkom University', 'Surabaya ketintang', -7.3098, 112.7301, 'Sangat strategis untuk mencari makan dan juga dekat dengan kampus', 16, 'Wifi,AC,K. Mandi Dalam', '7-inspirasi-desain-kos-kosan-sederhana-tapi-nyaman-bikin-betah-1.jpg', 'terverifikasi', NOW()),
  (3, 2, 'Kos Putra', 'putra', 'Ketintang', '900 meter dari Telkom University', 'Ketintang, Surabaya', -7.3162, 112.7318, 'Kos putra murah dekat kampus.', 10, 'Wifi,K. Mandi Dalam', 'whatsapp-image-2026-10-17-at-15-30-14-1.png', 'terverifikasi', NOW()),
  (4, 2, 'Kos Campur Ekonomis', 'campur', 'Ketintang', '700 meter dari Telkom University', 'Ketintang Tim. PTT IV No.27, Ketintang, Kec. Gayungan, Surabaya, Jawa Timur 60231', -7.3127, 112.7238, 'Kos ekonomis dengan fasilitas lengkap.', 13, 'Wifi,K. Mandi Dalam,AC', 'images-3.jpg,image-3.png,images-4.jpg', 'terverifikasi', NOW()),
  (7, 5, 'Kos Mawar Melati', 'putri', 'Depok', NULL, 'Depok', -6.3680, 106.8315, NULL, 6, 'Wifi', 'whatsapp-image-2026-10-17-at-15-30-14-2.jpg', 'terverifikasi', NOW() - INTERVAL 2 MONTH),
  (8, 8, 'Kos Bahari Jaya', 'campur', 'Surabaya', NULL, 'Surabaya', -7.3049, 112.7337, NULL, 6, 'Wifi', 'hi-check-out-this-great-stay-i-found-on-trivago-for-our-trip-to-la-fortuna-1.jpg', 'terverifikasi', NOW() - INTERVAL 3 MONTH);

INSERT INTO kamar (kos_id, tipe, harga_per_bulan, jumlah, fasilitas, deskripsi, foto) VALUES
  (2, 'Tipe A', 1000000, 2, 'Wifi,K. Mandi Dalam,AC', 'pemandangan indah kota langsung dari jendela kamar Anda.', 'u-co-live-centro-1.jpg'),
  (2, 'Tipe B', 1400000, 4, 'Wifi,K. Mandi Dalam,AC', 'pemandangan indah kota langsung dari jendela kamar Anda.', 'projeto-de-marcenaria-para-detalhamento-dos-moveis-da-cozinha-sala-de-jantar-02-quartos-masculinos-e-01-quarto-de-casal-1.jpg'),
  (2, 'Tipe C', 2000000, 0, 'Wifi,K. Mandi Dalam,AC', 'pemandangan indah kota langsung dari jendela kamar Anda.', 'at-siot-1.jpg'),
  (1, 'Tipe A', 1800000, 2, 'Wifi,K. Mandi Dalam,AC', 'pemandangan indah kota langsung dari jendela kamar Anda.', 'compact-and-functional-kitnet-1.jpg'),
  (1, 'Tipe B', 1400000, 2, 'Wifi,K. Mandi Dalam,AC', 'pemandangan indah kota langsung dari jendela kamar Anda.', '7-1.jpg'),
  (1, 'Tipe C', 1000000, 0, 'Wifi,K. Mandi Dalam', 'pemandangan indah kota langsung dari jendela kamar Anda.', '6-1.jpg'),
  (3, 'Tipe A', 900000, 2, 'Wifi,K. Mandi Dalam', 'pemandangan indah kota langsung dari jendela kamar Anda.', '5-1.jpg'),
  (3, 'Tipe B', 800000, 0, 'Wifi,K. Mandi Dalam', 'pemandangan indah kota langsung dari jendela kamar Anda.', '352f832b-c8c6-410d-be3f-8646f8278e9c-2.png'),
  (3, 'Tipe C', 500000, 3, 'Wifi', 'pemandangan indah kota langsung dari jendela kamar Anda.', 'donner-moi-une-idee-de-decoration-pour-ma-chambre-1.jpg'),
  (4, 'Tipe A', 1800000, 2, 'Wifi,K. Mandi Dalam,AC', 'pemandangan indah kota langsung dari jendela kamar Anda.', 'compact-and-functional-kitnet-1.jpg'),
  (4, 'Tipe B', 1400000, 1, 'Wifi,K. Mandi Dalam,AC', 'pemandangan indah kota langsung dari jendela kamar Anda.', '7-1.jpg'),
  (4, 'Tipe C', 1000000, 0, 'Wifi,K. Mandi Dalam', 'pemandangan indah kota langsung dari jendela kamar Anda.', '6-1.jpg'),
  (7, 'Tipe A', 750000, 3, 'Wifi', 'Kamar rapi dengan jendela besar.', 'images-4.jpg'),
  (8, 'Tipe A', 850000, 2, 'Wifi', 'Kamar nyaman dekat jalan utama.', 'images-3.jpg');

INSERT INTO ulasan (kos_id, user_id, rating, isi, membantu, created_at) VALUES
  (4, 1, 5, 'Udah tinggal di sini selama 1 tahun pas awal semester 5. Kosannya super tenang buat ngerjain tugas kuliah dan skripsi. WiFi Indihome 100 Mbps stabil banget, gak pernah lemot pas ujian online. Bu Kos dan Pak Kos juga ramah bgt, sering kirim takjil kalau puasa. Air lancar jaya dan parkiran motor ada CCTV 24 jam aman. Recommended buat anak teknik atau mipa UGM!', 28, NOW() - INTERVAL 14 DAY),
  (4, 4, 4, 'Kamarnya bersih dan dekat kampus.', 3, NOW() - INTERVAL 30 DAY),
  (1, 1, 5, 'Nyaman dan bersih.', 2, NOW() - INTERVAL 5 DAY),
  (2, 4, 5, 'Kos favorit!', 1, NOW() - INTERVAL 7 DAY),
  (3, 6, 2, 'Agak bising.', 0, NOW() - INTERVAL 9 DAY);

INSERT INTO booking (kos_id, kamar_id, pencari_id, status) VALUES
  (2, 1, 6, 'menunggu'),
  (1, 4, 6, 'menunggu');

INSERT INTO notifikasi (user_id, jenis, judul, pesan, created_at) VALUES
  (1, 'sukses', 'Booking Diterima!', 'Permintaan booking kos "Kos Melati" telah diterima oleh pemilik kos.', NOW() - INTERVAL 2 MINUTE),
  (1, 'info', 'Selamat Datang di KeKos', 'Cari kos impianmu di sekitar kampus lewat peta dan filter.', NOW() - INTERVAL 1 DAY);
