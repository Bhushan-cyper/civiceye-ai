export default function SeverityBadge({ severity = "MEDIUM" }) {
  return <span className={`severity-badge severity-${severity.toLowerCase()}`}>{severity}</span>;
}
