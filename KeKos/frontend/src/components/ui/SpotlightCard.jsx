import { useRef } from "react";

// Adaptasi "Spotlight Card / GlowCard" (jahed, 21st.dev): cahaya ungu KeKos mengikuti kursor
// di atas kartu dan garis tepinya. Posisi kursor disimpan di variabel CSS --x dan --y (lihat .kekos-spotlight).
export default function SpotlightCard({ children, className = "" }) {
  const ref = useRef(null);

  const onPointerMove = (event) => {
    const box = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--x", `${event.clientX - box.left}px`);
    ref.current.style.setProperty("--y", `${event.clientY - box.top}px`);
  };

  return (
    <div ref={ref} onPointerMove={onPointerMove} className={`kekos-spotlight ${className}`}>
      {children}
    </div>
  );
}
