import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Link className="footer-brand" to="/">CivicEye</Link>
        <span>A community-powered civic intelligence demonstration.</span>
        <span className="demo-note">Not affiliated with a government agency.</span>
      </div>
    </footer>
  );
}
