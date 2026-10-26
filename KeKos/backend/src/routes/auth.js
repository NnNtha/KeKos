import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function makeToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function publicUser(user) {
  return { id: user.id, nama: user.nama, email: user.email, telepon: user.telepon ?? null, role: user.role };
}

// POST /api/auth/register  { nama, email, telepon?, password }
// Sprint 2: akun baru selalu terdaftar sebagai pencari kos
router.post("/register", async (req, res) => {
  const { nama, email, password } = req.body;
  const telepon = req.body.telepon ? String(req.body.telepon).replace(/[\s-]/g, "") : null;
  if (!nama || !email || !password) {
    return res.status(400).json({ message: "Nama, email, dan password wajib diisi" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password minimal 6 karakter" });
  }
  if (telepon && !/^\+?[0-9]{9,15}$/.test(telepon)) {
    return res.status(400).json({ message: "Nomor telepon tidak valid" });
  }

  const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.length) {
    return res.status(409).json({ message: "Email sudah terdaftar. Silakan login." });
  }

  const hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO users (nama, email, telepon, password_hash, role) VALUES (?, ?, ?, ?, 'pencari')",
    [nama, email, telepon, hash]
  );
  const user = { id: result.insertId, nama, email, telepon, role: "pencari" };
  res.status(201).json({ token: makeToken(user), user: publicUser(user) });
});

// POST /api/auth/login  { email, password }
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
  }

  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  const user = rows[0];
  // Pesan sengaja sama untuk email & password, supaya orang tidak bisa menebak email yang terdaftar
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ message: "Email atau password salah" });
  }
  if (user.status === "nonaktif") {
    return res.status(403).json({ message: "Akun ini sudah dinonaktifkan" });
  }
  // Sprint 2 baru berisi fitur pencari kos
  if (user.role !== "pencari") {
    return res.status(403).json({ message: "Akun ini bukan akun pencari kos" });
  }

  res.json({ token: makeToken(user), user: publicUser(user) });
});

// GET /api/auth/me  (perlu token)
router.get("/me", requireAuth, async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
  if (!rows[0]) return res.status(404).json({ message: "User tidak ditemukan" });
  res.json({ user: publicUser(rows[0]) });
});

export default router;
