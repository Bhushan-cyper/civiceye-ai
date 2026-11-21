import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, ImagePlus, LoaderCircle, MapPin, Sparkles, Upload, X } from "lucide-react";
import api, { getErrorMessage } from "../services/api";
import MapView from "../components/MapView";
import SeverityBadge from "../components/SeverityBadge";

const categories = [
  "Road Damage / Potholes",
  "Garbage Accumulation",
  "Water Leakage",
  "Air Pollution",
  "Drainage Problems",
  "Streetlight Issues",
  "Other Civic Issues"
];

export default function Report() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ citizenName: "", category: "", description: "", locationName: "" });
  const [file, setFile] = useState(null);
  const [location, setLocation] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setImageUrl("");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  function chooseFile(event) {
    const next = event.target.files?.[0];
    setAnalysis(null);
    setAiMessage("");
    setError("");
    if (!next) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(next.type)) {
      setError("Choose a JPEG, PNG, or WebP image.");
      return;
    }
    if (next.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller.");
      return;
    }
    setFile(next);
  }

  async function analyze() {
    if (!file) return;
    setAnalyzing(true);
    setAnalysis(null);
    setAiMessage("");
    const body = new FormData();
    body.append("image", file);
    try {
      const response = (await api.post("/ai/analyze", body)).data;
      setAnalysis(response.data);
      setAiMessage(response.message);
    } catch (requestError) {
      setAiMessage(getErrorMessage(requestError));
    } finally {
      setAnalyzing(false);
    }
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (!location) {
      setError("Select the issue location by clicking on the map.");
      return;
    }
    setBusy(true);
    const body = new FormData();
    Object.entries({ ...form, latitude: location.latitude, longitude: location.longitude }).forEach(([key, value]) => body.append(key, value));
    if (file) body.append("image", file);
    try {
      const response = await api.post("/complaints", body);
      navigate(`/complaints/${response.data.data.complaintId}`, { state: { justSubmitted: true } });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container page-container narrow-container">
      <Link to="/" className="back-link"><ArrowLeft size={16} /> Back to home</Link>
      <div className="page-heading">
        <span className="eyebrow">CITIZEN REPORTING</span>
        <h1>Report a civic issue</h1>
        <p>Share a few details so the issue can be understood and tracked. All fields marked required must be completed.</p>
      </div>
      <form className="form-card" onSubmit={submit}>
        <div className="form-section">
          <div className="form-section-heading"><span className="step-number">01</span><div><h2>What happened?</h2><p>Describe the issue as clearly as you can.</p></div></div>
          <div className="field-grid">
            <label className="field-label">Your name <span className="required">*</span><input required maxLength="100" value={form.citizenName} onChange={(e) => setForm({ ...form, citizenName: e.target.value })} placeholder="Enter your name" autoComplete="name" /></label>
            <label className="field-label">Issue category <span className="required">*</span><select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="">Select a category</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
          </div>
          <label className="field-label">Description <span className="required">*</span><textarea required maxLength="2000" rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What did you notice? Include useful details such as size, duration, or impact." /><span className="field-hint">{form.description.length}/2,000 characters</span></label>
          <label className="field-label">Area or nearby landmark <span className="optional">(optional)</span><input maxLength="160" value={form.locationName} onChange={(e) => setForm({ ...form, locationName: e.target.value })} placeholder="e.g. Near a local landmark" /></label>
        </div>

        <div className="form-section">
          <div className="form-section-heading"><span className="step-number">02</span><div><h2>Add a photo</h2><p>A photo can help explain the issue. Max 5 MB, JPEG/PNG/WebP.</p></div></div>
          <label className="upload-zone">
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseFile} />
            {file ? <><img className="upload-preview" src={imageUrl} alt="Preview of selected civic issue" /><span className="upload-file"><CheckCircle2 size={17} />{file.name}</span></> : <><span className="upload-icon"><ImagePlus /></span><strong>Choose an image to upload</strong><span>or drag and drop here</span><span className="upload-button"><Upload size={15} /> Browse files</span></>}
          </label>
          {file && <div className="upload-actions"><span>{(file.size / 1024 / 1024).toFixed(2)} MB · ready to submit</span><button type="button" className="text-button" onClick={() => { setFile(null); setAnalysis(null); setAiMessage(""); }}> <X size={14} /> Remove photo</button></div>}
          {file && <div className="ai-action-row"><button type="button" className="button button-outline" disabled={analyzing} onClick={analyze}>{analyzing ? <LoaderCircle className="spin" size={17} /> : <Sparkles size={17} />}{analyzing ? "Analyzing image…" : "Preview AI analysis"}</button><span>AI suggestions are advisory, not verified assessments.</span></div>}
          {analysis && <div className="analysis-card"><div className="analysis-title"><Sparkles size={17} /><strong>AI suggestion</strong><SeverityBadge severity={analysis.severity} /></div><p>{analysis.description}</p><div className="analysis-meta"><span>Suggested: {analysis.category}</span><span>{Math.round(analysis.confidence * 100)}% confidence</span></div><p className="field-hint">Suggested action: {analysis.recommendedAction}</p></div>}
          {aiMessage && <div className="inline-notice"><AlertCircle size={16} />{aiMessage}</div>}
        </div>

        <div className="form-section">
          <div className="form-section-heading"><span className="step-number">03</span><div><h2>Pin the location</h2><p>Click the map to set the actual issue location. This is required.</p></div></div>
          <div className="map-prompt"><MapPin size={16} />{location ? `Selected: ${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}` : "No location selected yet"}</div>
          <MapView selectedLocation={location} onSelect={setLocation} height="360px" />
        </div>

        {error && <div className="form-error"><AlertCircle size={17} />{error}</div>}
        <div className="form-submit"><span><ShieldCheckText />Your contact details are not shown publicly.</span><button className="button button-primary" type="submit" disabled={busy}>{busy ? <LoaderCircle className="spin" size={17} /> : null}{busy ? "Submitting…" : "Submit report"}{!busy && <ArrowRight size={17} />}</button></div>
      </form>
      {busy && <p className="submit-hint">Your report is being saved and may be analyzed by AI. Please keep this page open.</p>}
    </div>
  );
}

function ShieldCheckText() {
  return <span className="privacy-shield">●</span>;
}
