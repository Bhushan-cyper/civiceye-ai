import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, CheckCircle2, LoaderCircle, Save } from "lucide-react";
import api, { getErrorMessage } from "../services/api";
import ComplaintDetailsCard from "./components/ComplaintDetailsCard";
import MapView from "../components/MapView";

const statuses = ["SUBMITTED", "UNDER_REVIEW", "IN_PROGRESS", "RESOLVED", "REJECTED"];

export default function ComplaintDetails() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState("SUBMITTED");
  const [priority, setPriority] = useState("MEDIUM");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/complaints/${encodeURIComponent(id)}`);
      setComplaint(response.data.data);
      setStatus(response.data.data.status);
      setPriority(response.data.data.priority);
      setRemarks(response.data.data.adminRemarks || "");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  async function saveReview(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const response = await api.patch(`/complaints/${complaint.complaintId}/status`, { status, priority, remarks });
      setComplaint((current) => ({ ...current, ...response.data.data, statusHistory: current.statusHistory }));
      setSuccess("Demonstration review saved.");
      await load();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container page-container">
      <Link to="/dashboard" className="back-link"><ArrowLeft size={16} /> Back to dashboard</Link>
      {loading ? <div className="loading-panel"><LoaderCircle className="spin" /> Loading complaint…</div> : error && !complaint ? <div className="form-error"><AlertCircle size={17} />{error}</div> : complaint && <>
        <div className="details-heading"><div><span className="eyebrow">COMPLAINT DETAILS</span><h1>{complaint.complaintId}</h1><p>Submitted {new Date(complaint.createdAt).toLocaleString()}</p></div><Link className="button button-outline" to="/track">Tracking page</Link></div>
        <div className="details-layout">
          <div className="details-main"><ComplaintDetailsCard complaint={complaint} /><section className="details-map-section"><h2>Reported location</h2><p>{complaint.locationName || "Citizen-selected map location"} · {complaint.latitude.toFixed(5)}, {complaint.longitude.toFixed(5)}</p><MapView selectedLocation={{ latitude: complaint.latitude, longitude: complaint.longitude }} height="330px" /></section></div>
          <aside className="admin-panel"><div className="admin-panel-heading"><span className="admin-label">DEMONSTRATION MODE</span><h2>Admin review</h2><p>Update recorded complaint status and priority. This does not constitute official government action.</p></div>
            <form onSubmit={saveReview}>
              <label className="field-label">Status<select value={status} onChange={(e) => setStatus(e.target.value)}>{statuses.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}</select></label>
              <label className="field-label">Reviewed priority<select value={priority} onChange={(e) => setPriority(e.target.value)}>{["HIGH", "MEDIUM", "LOW"].map((item) => <option key={item}>{item}</option>)}</select><span className="field-hint">Administrator review may override the AI suggestion.</span></label>
              <label className="field-label">Administrative remarks<textarea maxLength="1000" rows="5" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Add a note for the report record…" /></label>
              {error && <div className="form-error compact-error"><AlertCircle size={16} />{error}</div>}
              {success && <div className="inline-success"><CheckCircle2 size={16} />{success}</div>}
              <button className="button button-primary full-button" disabled={saving}>{saving ? <LoaderCircle className="spin" size={16} /> : <Save size={16} />}{saving ? "Saving…" : "Save review"}</button>
            </form>
          </aside>
        </div>
      </>}
    </div>
  );
}
