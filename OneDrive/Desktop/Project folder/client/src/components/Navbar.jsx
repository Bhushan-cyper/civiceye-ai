import { Link, NavLink } from "react-router-dom";
import { Activity, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link className="brand" to="/" onClick={close}>
          <span className="brand-mark"><Activity size={21} /></span>
          <span>Civic<span className="brand-accent">Eye</span><small>CIVIC INTELLIGENCE</small></span>
        </Link>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? "main-nav nav-open" : "main-nav"}>
          <NavLink to="/" end onClick={close}>Home</NavLink>
          <NavLink to="/report" onClick={close}>Report an issue</NavLink>
          <NavLink to="/track" onClick={close}>Track report</NavLink>
          <NavLink to="/dashboard" onClick={close}>Civic dashboard</NavLink>
        </nav>
      </div>
    </header>
  );
}
