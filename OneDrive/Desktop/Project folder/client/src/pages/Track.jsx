import { useState } from "react";
import { AlertCircle, ArrowRight, LoaderCircle, Search, ShieldCheck } from "lucide-react";
import api, { getErrorMessage } from "../services/api";
import ComplaintDetailsCard from "./components/ComplaintDetailsCard";

export default function Track() {
  const [complaintId, setComplaintId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function search(event) {
    event.preventDefault();
    if (!complaintId.trim()) return;
    setLoading(true);
    setError("");
    setComplaint(null);
    try {
      const response = await api.get(`/complaints/track/${encodeURIComponent(complaintId.trim())}`);
      setComplaint(response.data.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container page-container">
      <div className="page-heading centered">
        <span className="eyebrow">REPORT FOLLOW-UP</span>
        <h1>Track a report</h1>
        <p>Enter the unique tracking ID you received when the report was submitted.</p>
      </div>
      <form className="track-search" onSubmit={search}>
        <label className="sr-only" htmlFor="track-id">Complaint tracking ID</label>
        <Search size={19} />
        <input id="track-id" value={complaintId} onChange={(event) => setComplaintId(event.target.value)} placeholder="e.g. CE-2026-A1B2C3D4" required />
        <button className="button button-primary" type="submit" disabled={loading}>{loading ? <LoaderCircle className="spin" size={17} /> : null}{loading ? "Searching…" : "Find report"}{!loading && <ArrowRight size={17} />}</button>
      </form>
      <p className="track-privacy"><ShieldCheck size={15} /> Only the report matching this tracking ID will be shown.</p>
      {error && <div className="form-error track-error"><AlertCircle size={17} />{error}</div>}
      {complaint && <ComplaintDetailsCard complaint={complaint} />}
      {!complaint && !error && <div className="track-empty"><span className="empty-icon"><Search /></span><h2>Your report status, at a glance.</h2><p>Tracking updates are based on the demonstration system's recorded status history.</p></div>}
    </div>
  );
}
