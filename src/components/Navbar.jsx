import React, { useEffect, useState } from "react";

export default function Navbar({ onAdminToggle }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="container nav-inner">
        <div className="brand">Mansy <span>Store</span></div>
        <button className="btn gold" onClick={onAdminToggle}>
          لوحة التحكم
        </button>
      </div>
    </nav>
  );
}
