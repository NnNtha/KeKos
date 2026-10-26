import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { notify } from "../format.js";

const router = Router();
router.use(requireAuth, requireRole("pencari"));

// GET /api/booking?kos_id=4  booking milik pencari yang sedang login
router.get("/", async (req, res) => {
  const params = [req.user.id];
  let sql = `SELECT b.*, u.telepon AS pemilik_telepon FROM booking b
             JOIN kos k ON k.id = b.kos_id LEFT JOIN users u ON u.id = k.pemilik_id
             WHERE b.pencari_id = ?`;
  if (req.query.kos_id) {
    sql += " AND b.kos_id = ?";
    params.push(req.query.kos_id);
  }
  const [rows] = await pool.query(`${sql} ORDER BY b.created_at DESC`, params);
  res.json(rows.map((b) => ({
    id: b.id,
    kosId: b.kos_id,
    roomId: b.kamar_id,
    status: b.status,
    // Nomor WhatsApp pemilik hanya dibuka setelah booking diterima
    ownerPhone: b.status === "diterima" ? b.pemilik_telepon : null,
    createdAt: b.created_at,
  })));
});

// POST /api/booking  { kamar_id }
router.post("/", async (req, res) => {
  const [kamar] = await pool.query(
    `SELECT km.*, k.nama AS kos_nama, k.pemilik_id FROM kamar km JOIN kos k ON k.id = km.kos_id
     WHERE km.id = ? AND km.aktif AND k.aktif AND k.status = 'terverifikasi'`,
    [req.body.kamar_id]
  );
  const room = kamar[0];
  if (!room) return res.status(404).json({ message: "Kamar tidak ditemukan" });
  if (room.jumlah <= 0) return res.status(409).json({ message: "Kamar ini sudah penuh" });
  if (room.pemilik_id === req.user.id) return res.status(400).json({ message: "Kamu tidak bisa booking kos milikmu sendiri" });

  const [aktif] = await pool.query(
    "SELECT id FROM booking WHERE pencari_id = ? AND kos_id = ? AND status IN ('menunggu', 'diterima')",
    [req.user.id, room.kos_id]
  );
  if (aktif.length) return res.status(409).json({ message: "Kamu sudah punya booking di kos ini" });

  const [result] = await pool.query(
    "INSERT INTO booking (kos_id, kamar_id, pencari_id) VALUES (?, ?, ?)",
    [room.kos_id, room.id, req.user.id]
  );
  await notify(room.pemilik_id, "Booking Baru Memerlukan Persetujuan", `Ada booking baru untuk ${room.kos_nama} (${room.tipe}).`);
  res.status(201).json({ id: result.insertId, status: "menunggu" });
});

export default router;
