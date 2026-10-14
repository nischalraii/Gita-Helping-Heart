import { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import siteData from "../data/site.json";
import { MainNav } from "./MainNav";

export function Header() {
  const [open, setOpen] = useState(false);
  const { url } = usePage();
  const onHome = url.split("?")[0] === "/";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 900) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const brand = (
    <>
      <div className="logo">{siteData.logoText}</div>
      <div>
        <strong>{siteData.name}</strong>
        <small>{siteData.nameNe}</small>
      </div>
    </>
  );

  return (
    <header className={open ? "nav-open" : ""}>
      <div className="wrap nav">
        {onHome ? (
          <a className="brand" href="#home" onClick={() => setOpen(false)}>
            {brand}
          </a>
        ) : (
          <Link className="brand" href="/" onClick={() => setOpen(false)}>
            {brand}
          </Link>
        )}

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="main-nav"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <MainNav onNavigate={() => setOpen(false)} />
      </div>
    </header>
  );
}
