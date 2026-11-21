import { AlertTriangle, CheckCircle2, Clock3, FileText, TrendingUp } from "lucide-react";

const stats = [
  { key: "total", label: "Total reports", icon: FileText, color: "blue" },
  { key: "pending", label: "Pending review", icon: Clock3, color: "orange" },
  { key: "inProgress", label: "In progress", icon: TrendingUp, color: "purple" },
  { key: "resolved", label: "Resolved", icon: CheckCircle2, color: "green" },
  { key: "highSeverity", label: "High severity", icon: AlertTriangle, color: "red" },
  { key: "highPriorityUnresolved", label: "High priority unresolved", icon: AlertTriangle, color: "red" }
];

export default function DashboardStats({ data }) {
  return (
    <div className="stats-grid">
      {stats.map(({ key, label, icon: Icon, color }) => (
        <article className="stat-card" key={key}>
          <span className={`stat-icon ${color}`}><Icon size={20} /></span>
          <div><strong>{data?.[key] ?? "—"}</strong><span>{label}</span></div>
        </article>
      ))}
    </div>
  );
}
