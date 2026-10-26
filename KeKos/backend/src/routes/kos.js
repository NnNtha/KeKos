import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { KOS_SELECT, toKos, toKamar } from "../format.js";

const router = Router();

// GET /api/kos?tipe=putra&min=500000&max=3000000&fasilitas=AC,Wifi&q=ketintang
// Hanya kos yang sudah diverifikasi admin dan sedang aktif
router.get("/", async (req, res) => {
  const { tipe, min, max, fasilitas, q } = req.query;
  const where = ["k.status = 'terverifikasi'", "k.aktif"];
  const params = [];
  if (["putra", "putri", "campur"].includes(tipe)) {
    where.push("k.tipe = ?");
    params.push(tipe);
  }
  if (q) {
    where.push("(k.nama LIKE ? OR k.area LIKE ? OR k.alamat LIKE ? OR k.jarak LIKE ?)");
    params.push(...Array(4).fill(`%${q}%`));
  }
  for (const f of String(fasilitas || "").split(",").filter(Boolean)) {
    where.push("k.fasilitas LIKE ?");
    params.push(`%${f}%`);
  }
  const having = [];
  if (min) { having.push("(harga_min IS NULL OR harga_min >= ?)"); params.push(Number(min)); }
  if (max) { having.push("(harga_min IS NULL OR harga_min <= ?)"); params.push(Number(max)); }

  const sql = `${KOS_SELECT} WHERE ${where.join(" AND ")}${having.length ? ` HAVING ${having.join(" AND ")}` : ""} ORDER BY k.id`;
  const [rows] = await pool.query(sql, params);
  res.json(rows.map(toKos));
});

// GET /api/kos/:id  detail kos + daftar tipe kamar + ulasan
router.get("/:id", async (req, res) => {
  const [rows] = await pool.query(`${KOS_SELECT} WHERE k.id = ?`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ message: "Kos tidak ditemukan" });

  const [kamar] = await pool.query("SELECT * FROM kamar WHERE kos_id = ? AND aktif ORDER BY tipe", [req.params.id]);
  const [ulasan] = await pool.query(
    `SELECT ul.*, u.nama, u.role FROM ulasan ul JOIN users u ON u.id = ul.user_id
     WHERE ul.kos_id = ? ORDER BY ul.created_at DESC`,
    [req.params.id]
  );
  const distribusi = [5, 4, 3, 2, 1].map((bintang) => ({
    stars: bintang,
    count: ulasan.filter((u) => u.rating === bintang).length,
  }));

  res.json({
    ...toKos(rows[0]),
    rooms: kamar.map(toKamar),
    ratingDistribution: distribusi,
    reviewList: ulasan.map((u) => ({
      id: u.id,
      userId: u.user_id,
      name: u.nama,
      rating: u.rating,
      text: u.isi,
      helpful: u.membantu,
      createdAt: u.created_at,
    })),
  });
});

// POST /api/kos/:id/ulasan  { rating, isi }  (pencari kos)
router.post("/:id/ulasan", requireAuth, requireRole("pencari"), async (req, res) => {
  const rating = Number(req.body.rating);
  const isi = String(req.body.isi || "").trim();
  if (!(rating >= 1 && rating <= 5) || !isi) {
    return res.status(400).json({ message: "Rating (1-5) dan isi ulasan wajib diisi" });
  }
  await pool.query("INSERT INTO ulasan (kos_id, user_id, rating, isi) VALUES (?, ?, ?, ?)", [req.params.id, req.user.id, rating, isi]);
  res.status(201).json({ ok: true });
});

// DELETE /api/kos/:id/ulasan/:ulasanId  (penulis ulasan itu sendiri)
router.delete("/:id/ulasan/:ulasanId", requireAuth, async (req, res) => {
  const [rows] = await pool.query("SELECT user_id FROM ulasan WHERE id = ? AND kos_id = ?", [req.params.ulasanId, req.params.id]);
  if (!rows[0]) return res.status(404).json({ message: "Ulasan tidak ditemukan" });
  if (rows[0].user_id !== req.user.id) {
    return res.status(403).json({ message: "Kamu hanya bisa menghapus ulasanmu sendiri" });
  }
  await pool.query("DELETE FROM ulasan WHERE id = ?", [req.params.ulasanId]);
  res.json({ ok: true });
});

export default router;
