import jwt from "jsonwebtoken";

// Cek header "Authorization: Bearer <token>" lalu simpan data user di req.user
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Silakan login dulu" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Sesi habis, silakan login lagi" });
  }
}

// Dipakai setelah requireAuth: hanya peran tertentu yang boleh lewat
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Kamu tidak punya akses ke halaman ini" });
    }
    next();
  };
}
