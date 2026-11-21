import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin } from "lucide-react";
import SeverityBadge from "./SeverityBadge";

export default function ComplaintCard({ complaint }) {
  return (
    <Link className="complaint-card" to={`/complaints/${complaint.complaintId}`}>
      <div className="complaint-card-top">
        <span className="tracking-code">{complaint.complaintId}</span>
        <SeverityBadge severity={complaint.priority} />
      </div>
      <h3>{complaint.category}</h3>
      <p className="clamp-text">{complaint.description}</p>
      <div className="complaint-card-bottom">
        <span className="location-line"><MapPin size={14} />{complaint.locationName || `${Number(complaint.latitude).toFixed(3)}, ${Number(complaint.longitude).toFixed(3)}`}</span>
        <span className={`status-pill status-${complaint.status?.toLowerCase()}`}>{complaint.status?.replaceAll("_", " ")}</span>
        <ArrowUpRight size={16} className="card-arrow" />
      </div>
    </Link>
  );
}
