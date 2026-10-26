import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DetailKos from "./pages/DetailKos";
import BookingKos from "./pages/BookingKos";
import RequireRole from "./components/RequireRole";

// Sprint 2 - Fitur Pencari Kos: login/daftar + halaman pencari kos saja
const pencari = (page) => <RequireRole role="pencari">{page}</RequireRole>;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Masuk & daftar */}
        <Route path="/" element={<Login />} />
        <Route path="/salah-pw" element={<Login initialError />} />
        <Route path="/register" element={<Register />} />
        <Route path="/buat-akun" element={<Navigate to="/register" replace />} />

        {/* Pencari kos */}
        <Route path="/dashboard" element={pencari(<Dashboard />)} />
        <Route path="/notifikasi" element={pencari(<Dashboard notifOpenInitially />)} />
        <Route path="/kos/:id" element={<DetailKos />} />
        <Route path="/kos/:id/booking" element={pencari(<BookingKos />)} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
