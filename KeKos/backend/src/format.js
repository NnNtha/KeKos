// Mengubah baris database menjadi objek JSON yang dipakai frontend
import { pool } from "./db.js";

const list = (text) => (text ? text.split(",").map((s) => s.trim()).filter(Boolean) : []);

// SELECT kos lengkap dengan harga termurah, sisa kamar, rating, dan nama pemilik
export const KOS_SELECT = `
  SELECT k.*, u.nama AS pemilik_nama, u.telepon AS pemilik_telepon,
    (SELECT MIN(harga_per_bulan) FROM kamar WHERE kos_id = k.id AND aktif) AS harga_min,
    (SELECT COALESCE(SUM(jumlah), 0) FROM kamar WHERE kos_id = k.id AND aktif) AS sisa_kamar,
    (SELECT ROUND(AVG(rating), 1) FROM ulasan WHERE kos_id = k.id) AS rating,
    (SELECT COUNT(*) FROM ulasan WHERE kos_id = k.id) AS jumlah_ulasan
  FROM kos k LEFT JOIN users u ON u.id = k.pemilik_id`;

export function toKos(row) {
  const photos = list(row.foto);
  return {
    id: row.id,
    name: row.nama,
    type: row.tipe,
    area: row.area,
    distance: row.jarak,
    address: row.alamat,
    lat: row.lat == null ? null : Number(row.lat),
    lng: row.lng == null ? null : Number(row.lng),
    description: row.deskripsi,
    totalRooms: row.jumlah_kamar,
    facilities: list(row.fasilitas),
    photos,
    image: photos[0] || null,
    status: row.status,
    active: Boolean(row.aktif),
    price: row.harga_min == null ? null : Number(row.harga_min),
    roomsLeft: Number(row.sisa_kamar || 0),
    rating: row.rating == null ? 0 : Number(row.rating),
    reviews: Number(row.jumlah_ulasan || 0),
    owner: { id: row.pemilik_id, name: row.pemilik_nama, phone: row.pemilik_telepon },
    updatedAt: row.updated_at,
  };
}

export function toKamar(row) {
  return {
    id: row.id,
    kosId: row.kos_id,
    type: row.tipe,
    price: row.harga_per_bulan,
    available: row.jumlah,
    facilities: list(row.fasilitas),
    description: row.deskripsi,
    photos: list(row.foto),
    image: list(row.foto)[0] || null,
    active: Boolean(row.aktif),
  };
}

export async function notify(userId, judul, pesan, jenis = "info") {
  if (!userId) return;
  await pool.query("INSERT INTO notifikasi (user_id, jenis, judul, pesan) VALUES (?, ?, ?, ?)", [userId, jenis, judul, pesan]);
}
