import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import KosCard from "../components/KosCard.jsx";
import KosMap from "../components/KosMap.jsx";
import TextRotate from "../components/ui/TextRotate.jsx";
import InteractiveHoverButton from "../components/ui/InteractiveHoverButton.jsx";
import SpotlightCard from "../components/ui/SpotlightCard.jsx";
import { useApi } from "../hooks/useApi.js";
import { useDragScroll } from "../hooks/useDragScroll.js";
import { useScrollEffects } from "../hooks/useScrollEffects.js";
import { CAMPUS, RADIUS_METERS, distanceMeters, hasLocation } from "../lib/maps.js";

import heroImg from "../assets/sunlit-mediterranean-hilltop-town-and-church-1.png";
// Foto yang sama tanpa langit (hanya gedung), ditumpuk di atas garis supaya garis lewat di belakang rumah
import heroBuildingsImg from "../assets/hero-gedung.webp";
import dripImg from "../assets/black-dripping-paint-silhouette-1.png";
import distanceIcon from "../assets/distance-rounded.svg";
import zoomIcon from "../assets/sharp-zoom-out-map.svg";
import searchIcon from "../assets/search.svg";
import checkIcon from "../assets/check.svg";

const TYPES = [
  { value: "", label: "All" },
  { value: "putra", label: "Putra" },
  { value: "putri", label: "Putri" },
  { value: "campur", label: "Campur" },
];

// label = teks di tombol, value = kata yang dicari di kolom fasilitas database
const FACILITIES = [
  { label: "AC", value: "AC" },
  { label: "Kamar Mandi Dalam", value: "K. Mandi Dalam" },
  { label: "Dapur Bersama", value: "Dapur Bersama" },
  { label: "WiFi 100Mbps", value: "Wifi" },
  { label: "Water Heater", value: "Water Heater" },
  { label: "Parkir Mobil", value: "Parkir Mobil" },
];

// Kata yang bergantian di judul hero: "Temukan kos yang ___ untukmu."
const HERO_WORDS = ["cocok", "nyaman", "aman", "terjangkau"];

const MIN_PRICE = 500000;
const MAX_PRICE = 3000000;

function buildQuery({ type, maxPrice, facilities, q }) {
  const params = new URLSearchParams();
  if (type) params.set("tipe", type);
  params.set("min", MIN_PRICE);
  // Slider di ujung kanan berarti "3 juta ke atas", jadi tanpa batas atas
  if (maxPrice < MAX_PRICE) params.set("max", maxPrice);
  if (facilities.length) params.set("fasilitas", facilities.join(","));
  if (q.trim()) params.set("q", q.trim());
  return `/kos?${params}`;
}

export default function Dashboard({ notifOpenInitially = false }) {
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [facilities, setFacilities] = useState([]);
  const [search, setSearch] = useState("");
  const [mapOpen, setMapOpen] = useState(false);
  // Filter baru dipakai setelah tombol "Apply Filters" diklik; pencarian langsung (dengan jeda)
  const [applied, setApplied] = useState({ type: "", maxPrice: MAX_PRICE, facilities: [] });
  const [q, setQ] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setQ(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const listPath = useMemo(() => buildQuery({ ...applied, q }), [applied, q]);
  const kosList = useApi(listPath);
  const allKos = useApi("/kos");
  const { ref: sliderRef, canPrev, canNext, slide } = useDragScroll();
  const nearby = useMemo(
    () => (allKos.data || []).filter((kos) => hasLocation(kos) && distanceMeters(CAMPUS, kos) <= RADIUS_METERS).length,
    [allKos.data]
  );

  const toggleFacility = (value) =>
    setFacilities((list) => (list.includes(value) ? list.filter((f) => f !== value) : [...list, value]));

  const pageRef = useRef(null);
  useScrollEffects(pageRef);

  const fill = ((maxPrice - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  return (
    <main ref={pageRef} className="overflow-x-clip bg-[#f4f4f4]">
      {/* Bar tipis di atas yang terisi sesuai posisi scroll */}
      <div data-scroll-progress aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-1 origin-left scale-x-0 bg-[#7d7fff]" />
      {/* ---------- Hero ---------- */}
      <section className="relative h-[min(1024px,71.11vw)] min-h-[600px] overflow-hidden">
        {/* Tinggi hero mengikuti rasio frame Figma (1440x1024). Urutan lapisan (skala & posisi sama):
            foto → garis zig-zag putih → foto gedung tanpa langit. Jadi garis berjalan di langit tapi
            lewat di BELAKANG rumah & gereja di lebar layar berapa pun, termasuk saat parallax.
            Garis tergambar dari paling kiri, titik terendahnya tepat di puncak menara gereja (gedung tertinggi), lalu zig-zag ke kanan.
            data-parallax-anchor="top" = foto baru bergeser setelah halaman di-scroll. */}
        <div data-parallax="0.4" data-parallax-anchor="top" className="absolute inset-0">
          <img src={heroImg} alt="" className="h-full w-full object-cover" />
          <svg
            aria-hidden="true"
            viewBox="0 0 1440 1024"
            preserveAspectRatio="xMidYMid slice"
            className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block"
          >
            <polyline
              className="kekos-draw"
              pathLength="1"
              points="0,540 270,450 455,548 629,379 739,488 965,264 1189,488 1445,236"
              fill="none"
              stroke="#fff"
              strokeWidth="7"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
          <img src={heroBuildingsImg} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
        </div>
        <Navbar notifOpenInitially={notifOpenInitially} />
        <div data-scroll-fade className="relative z-10 px-6 pt-[160px] sm:pl-[16%] sm:pt-[209px]">
          <h1 data-reveal="left" className="font-poppins text-[34px] font-bold leading-tight text-white sm:text-[48px]">Halo, Sobat KeKos!</h1>
          <p data-reveal="left" style={{ "--reveal-delay": "120ms" }} className="font-poppins text-[22px] text-white sm:text-[32px]">
            Temukan kos yang{" "}
            <TextRotate texts={HERO_WORDS} className="rounded-lg bg-[#7d7fff] px-2 font-semibold" /> untukmu.
          </p>
          <p data-reveal="left" style={{ "--reveal-delay": "240ms" }} className="font-poppins text-base text-white sm:text-xl">Nyaman, dekat kampus, dan sesuai budget.</p>
          <div data-reveal="up" style={{ "--reveal-delay": "400ms" }} className="mt-4">
            <InteractiveHoverButton
              as="a"
              href="#cari-kos"
              className="border-white px-5 py-1.5 font-poppins text-[13px] shadow-[0_4px_4px_#00000040]"
            >
              Cari Kos!
            </InteractiveHoverButton>
          </div>
        </div>
      </section>

      {/* ---------- Peta persebaran ---------- */}
      <section id="peta" className="relative bg-black pb-[140px] pt-[100px] sm:pb-[300px] sm:pt-[135px]">
        <h2 data-reveal="up" className="text-center font-spacemono text-[30px] font-bold leading-[1.3] text-white sm:text-[40px]">
          Peta
          <br />
          Persebaran Kos
        </h2>
        <p data-reveal="up" style={{ "--reveal-delay": "120ms" }} className="mx-auto mt-3 max-w-[689px] px-4 text-center font-serif4 text-base text-white sm:text-lg">
          Temukan kos di sekitar kampus dengan mudah melalui peta interaktif KeKos.
        </p>
        <div data-reveal="zoom" className="relative z-10 mx-auto mt-12 w-[min(1087px,calc(100%-32px))] overflow-hidden rounded-[20px] bg-white">
          <KosMap kos={allKos.data || []} className="aspect-[1087/481] min-h-[300px] w-full" />
          <div className="flex items-center gap-3 px-4 py-4 sm:h-[100px] sm:gap-4 sm:px-6">
            <img src={distanceIcon} alt="" className="h-10 w-10 shrink-0 invert sm:h-[60px] sm:w-[60px]" />
            <p className="flex-1 font-poppins text-lg text-black sm:text-[32px]">
              {allKos.data ? nearby : "…"} kos terdeteksi di sekitar radius {RADIUS_METERS / 1000}km
            </p>
            <button type="button" onClick={() => setMapOpen(true)} aria-label="Perbesar peta" className="shrink-0">
              <img src={zoomIcon} alt="" className="h-9 w-9 sm:h-[53px] sm:w-[53px]" />
            </button>
          </div>
        </div>
        <img
          src={dripImg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 w-full translate-y-[60%] select-none"
        />
      </section>

      {mapOpen && (
        <div
          role="dialog"
          aria-label="Peta persebaran kos"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000cc] p-4"
          onClick={() => setMapOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="h-full max-h-[860px] w-full max-w-[1400px] overflow-hidden rounded-xl">
            <KosMap kos={allKos.data || []} interactive className="h-full w-full" />
          </div>
          <button type="button" className="absolute right-6 top-6 z-[1000] rounded-full bg-white px-4 py-2 font-poppins text-sm shadow">
            Tutup
          </button>
        </div>
      )}

      {/* ---------- Cari kos ---------- */}
      <section id="cari-kos" className="relative px-4 pb-24 pt-[180px] sm:pt-[330px]">
        <h2 data-reveal="up" className="text-center font-serif4 text-[26px] text-black sm:text-[32px]">Temukan Kos yang Cocok Untukmu</h2>
        <p data-reveal="up" style={{ "--reveal-delay": "120ms" }} className="mx-auto mt-3 max-w-[1199px] text-center font-serif4 text-base text-black sm:text-xl">
          Cari dan bandingkan berbagai pilihan kos berdasarkan harga, tipe kos, fasilitas, dan lokasi sesuai kebutuhanmu.
        </p>

        <div data-reveal="up" style={{ "--reveal-delay": "200ms" }} className="mx-auto mt-11 max-w-[1052px] rounded-xl border-[3px] border-black bg-white p-4 shadow-[0_4px_10px_#00000040] sm:px-[15px] sm:pb-4 sm:pt-[14px]">
          <div className="flex flex-col gap-8 md:flex-row md:justify-between">
            <div className="md:w-[491px]">
              <p className="font-inter text-[11px] font-bold tracking-wide text-[#555]">KOS TYPE</p>
              <div className="mt-3 inline-flex rounded-md bg-[#f1f1f1] p-[5px]" role="group" aria-label="Tipe kos">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    aria-pressed={type === t.value}
                    onClick={() => setType(t.value)}
                    className={`h-6 w-[65px] rounded font-inter text-[11px] ${
                      type === t.value ? "bg-white font-semibold text-black shadow-[0_1px_2px_#00000040]" : "text-[#555]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="mt-2 flex items-center justify-between">
                <label htmlFor="budget" className="font-inter text-[9px] font-bold tracking-wide text-[#555]">
                  MONTHLY BUDGET
                </label>
                <span className="font-inter text-xs font-semibold text-black">
                  IDR {MIN_PRICE.toLocaleString("en-US")} - {maxPrice.toLocaleString("en-US")}
                  {maxPrice >= MAX_PRICE ? "+" : ""}
                </span>
              </div>
              <input
                id="budget"
                type="range"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={100000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="kekos-range mt-5 w-full"
                style={{ "--fill": `${fill}%` }}
              />
              <div className="mt-1 flex justify-between font-inter text-[10px] text-[#666]">
                <span>Rp 500,000</span>
                <span>Rp 1,500,000</span>
                <span>Rp 3,000,000&gt;</span>
              </div>
            </div>

            <div className="md:w-[399px]">
              <p className="font-inter text-[11px] font-bold tracking-wide text-[#555]">FILTER</p>
              <div className="mt-3 flex flex-wrap gap-x-2.5 gap-y-3">
                {FACILITIES.map((f) => {
                  const on = facilities.includes(f.value);
                  return (
                    <button
                      key={f.value}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleFacility(f.value)}
                      className={`inline-flex h-[26px] items-center gap-1.5 rounded-full border px-[11px] font-inter text-[11px] ${
                        on ? "border-[#8f8f8f] bg-[#d9d9d9] text-black" : "border-[#8f8f8f] bg-white text-black"
                      }`}
                    >
                      {on && <img src={checkIcon} alt="" className="h-[6px] w-2" />}
                      {f.label}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setApplied({ type, maxPrice, facilities })}
                className="mt-4 h-10 w-full max-w-[308px] rounded-md bg-black font-inter text-sm font-medium text-white hover:bg-[#222] md:ml-11"
              >
                Apply Filters ({kosList.data ? kosList.data.length : 0} Kos)
              </button>
            </div>
          </div>

          <label className="mx-auto mt-8 flex h-[50px] max-w-[478px] items-center gap-3 rounded-lg border border-[#9b9b9b] bg-white px-7 sm:h-[59px]">
            <img src={searchIcon} alt="" className="h-7 w-7" />
            <span className="sr-only">Cari kos</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kos dekat kampus"
              className="min-w-0 flex-1 bg-transparent font-poppins text-base text-black outline-none placeholder:text-[#555] sm:text-xl"
            />
          </label>
        </div>

        <div className="relative mt-20 sm:-mx-4">
          {canPrev && (
            <button
              type="button"
              onClick={() => slide(-1)}
              aria-label="Geser ke kiri"
              className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black text-2xl text-white shadow-[0_4px_10px_#00000059] hover:bg-[#333]"
            >
              ‹
            </button>
          )}
          {canNext && (
            <button
              type="button"
              onClick={() => slide(1)}
              aria-label="Geser ke kanan"
              className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black text-2xl text-white shadow-[0_4px_10px_#00000059] hover:bg-[#333]"
            >
              ›
            </button>
          )}
        <div
          ref={sliderRef}
          className="flex cursor-grab snap-x snap-mandatory gap-[38px] overflow-x-auto scroll-smooth scroll-px-1 px-1 pb-6 pt-2 [scrollbar-width:thin] select-none sm:scroll-px-4 sm:px-4"
        >
          {kosList.loading && <p className="font-roboto text-sm text-[#555]">Memuat kos...</p>}
          {kosList.error && <p className="font-roboto text-sm text-[#c00]">{kosList.error}</p>}
          {kosList.data?.length === 0 && (
            <p className="font-roboto text-sm text-[#555]">Tidak ada kos yang cocok. Coba ubah filter.</p>
          )}
          {kosList.data?.map((kos, i) => (
            <div key={kos.id} data-reveal="card" style={{ "--reveal-delay": `${Math.min(i, 4) * 120}ms` }} className="snap-start">
              <SpotlightCard>
              <KosCard kos={kos}>
                <div className="mt-3 flex items-center justify-center gap-[18px]">
                  <Link
                    to={`/kos/${kos.id}`}
                    className="rounded-md bg-[#2b2b2b] px-3 py-[7px] font-roboto text-sm text-white hover:bg-black"
                  >
                    Detail
                  </Link>
                  <Link
                    to={`/kos/${kos.id}/booking`}
                    className="w-[95px] rounded-md bg-black py-1 text-center font-roboto text-sm leading-[19px] text-white hover:bg-[#333]"
                  >
                    Booking
                    <br />
                    Cepat
                  </Link>
                </div>
              </KosCard>
              </SpotlightCard>
            </div>
          ))}
        </div>
        </div>
      </section>
    </main>
  );
}
