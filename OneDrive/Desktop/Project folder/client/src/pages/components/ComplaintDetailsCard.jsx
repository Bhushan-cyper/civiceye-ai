import { Check, Circle, Clock3, MapPin } from "lucide-react";
import SeverityBadge from "../../components/SeverityBadge";
import { getAssetUrl } from "../../services/api";

const stages = ["SUBMITTED", "UNDER_REVIEW", "IN_PROGRESS", "RESOLVED"];
const formatDate = (date) => new Date(date).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

export default function ComplaintDetailsCard({ complaint }) {
  const currentIndex = stages.indexOf(complaint.status);
  return (
    <article className="track-result">
      <div className="track-result-head"><div><span className="eyebrow">TRACKING ID</span><h2>{complaint.complaintId}</h2></div><span className={`status-pill status-${complaint.status.toLowerCase()}`}>{complaint.status.replaceAll("_", " ")}</span></div>
      <div className="track-progress">
        {stages.map((stage, index) => {
          const completed = currentIndex >= index;
          const active = currentIndex === index;
          return <div className={`progress-step ${completed ? "completed" : ""} ${active ? "active" : ""}`} key={stage}><span className="progress-dot">{completed ? <Check size={14} /> : <Circle size={12} />}</span><span>{stage.replaceAll("_", " ")}</span></div>;
        })}
      </div>
      {complaint.status === "REJECTED" && <div className="inline-notice"><Clock3 size={16} />This report was marked rejected in the demonstration system.</div>}
      <div className="result-content">
        {complaint.imageUrl && <img className="result-image" src={getAssetUrl(complaint.imageUrl)} alt="Citizen-submitted issue" />}
        <div className="result-details">
          <div className="result-detail-top"><h3>{complaint.category}</h3><SeverityBadge severity={complaint.priority} /></div>
          <p>{complaint.description}</p>
          <div className="result-meta"><span><MapPin size={15} />{complaint.locationName || `${complaint.latitude.toFixed(5)}, ${complaint.longitude.toFixed(5)}`}</span><span>Submitted {formatDate(complaint.createdAt)}</span></div>
          {complaint.aiAvailable ? <div className="result-ai"><strong>AI-assisted suggestion · advisory only</strong><p>{complaint.aiDescription || "AI classification generated."} Suggested {complaint.aiCategory} with {complaint.aiSeverity} severity. {complaint.recommendedAction}</p></div> : <div className="result-ai muted"><strong>AI analysis unavailable</strong><p>This report was submitted without an AI assessment.</p></div>}
          {complaint.adminRemarks && <div className="admin-remarks"><strong>Latest demonstration admin remark</strong><p>{complaint.adminRemarks}</p></div>}
        </div>
      </div>
      <div className="history-section"><h3>Status history</h3>{complaint.statusHistory?.length ? <ol className="history-list">{complaint.statusHistory.map((item, index) => <li key={`${item.changedAt}-${index}`}><span className="history-dot" /><div><strong>{item.newStatus.replaceAll("_", " ")}</strong><time>{formatDate(item.changedAt)}</time>{item.remarks && <p>{item.remarks}</p>}</div></li>)}</ol> : <p className="field-hint">No status updates recorded.</p>}</div>
      <p className="demo-disclaimer">Status and remarks shown here are recorded in a demonstration environment and do not confirm government action.</p>
    </article>
  );
}
