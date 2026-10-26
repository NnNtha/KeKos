import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// GET /api/notifikasi  notifikasi milik user yang login (semua peran)
router.get("/", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM notifikasi WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
    [req.user.id]
  );
  res.json(rows.map((n) => ({
    id: n.id,
    type: n.jenis,
    title: n.judul,
    message: n.pesan,
    read: Boolean(n.sudah_dibaca),
    createdAt: n.created_at,
  })));
});

// PATCH /api/notifikasi/baca  tandai semua sudah dibaca
router.patch("/baca", async (req, res) => {
  await pool.query("UPDATE notifikasi SET sudah_dibaca = TRUE WHERE user_id = ?", [req.user.id]);
  res.json({ ok: true });
});

export default router;
