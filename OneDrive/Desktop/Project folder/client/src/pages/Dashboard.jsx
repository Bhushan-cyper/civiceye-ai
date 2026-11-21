import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowRight, BarChart3, LoaderCircle, RefreshCw, Search, X } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import api, { getErrorMessage } from "../services/api";
import DashboardStats from "../components/DashboardStats";
import ComplaintCard from "../components/ComplaintCard";
import MapView from "../components/MapView";
import { Link } from "react-router-dom";

const palette = ["#2f83bb", "#6f7ee8", "#33a887", "#e7a044", "#dc6b59", "#8c68b5", "#9aa9b6"];
const severityPalette = { HIGH: "#d94b45", MEDIUM: "#e89a35", LOW: "#2c9b73" };

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("");
  const [severity, setSeverity] = useState("");
  const [complaintSearch, setComplaintSearch] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [statsResponse, mapResponse] = await Promise.all([api.get("/complaints/stats"), api.get("/map/complaints")]);
      setStats(statsResponse.data.data);
      setComplaints(mapResponse.data.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const categories = useMemo(() => [...new Set(complaints.map((item) => item.category))].sort(), [complaints]);
  const filtered = complaints.filter((item) => (!category || item.category === category) && (!severity || item.priority === severity));
  async function searchComplaints(event) {
    event.preventDefault();
    const query = complaintSearch.trim();
    if (!query) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    setError("");
    try {
      const response = await api.get("/complaints", { params: { search: query } });
      setSearchResults(response.data.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="container page-container dashboard-page">
      <div className="dashboard-heading">
        <div><span className="eyebrow">CIVIC INTELLIGENCE</span><h1>Community dashboard</h1><p>A live view of reports submitted to this demonstration platform.</p></div>
        <button className="button button-outline" onClick={load} disabled={loading}><RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh data</button>
      </div>
      <div className="demo-banner"><span className="demo-banner-dot" /><div><strong>Demonstration admin view</strong><span>Reports and status changes are managed in this MVP. No government integration is claimed.</span></div></div>
      {error && <div className="form-error"><AlertCircle size={17} />{error}<button className="text-button" onClick={load}>Try again</button></div>}
      {loading && !stats ? <div className="loading-panel"><LoaderCircle className="spin" /> Loading dashboard data…</div> : stats && <>
        <DashboardStats data={stats} />
        <section className="accountability-strip"><div><span>RESOLUTION RATE</span><strong>{stats.resolutionRate}%</strong></div><div><span>AVG. TIME TO RESOLVE</span><strong>{stats.averageResolutionHours == null ? "—" : `${stats.averageResolutionHours} hrs`}</strong></div><p>Calculated from reports and timestamps in this database only. No unverified external outcomes are included.</p></section>
        <div className="dashboard-charts">
          <article className="chart-card"><div className="section-title"><div><span className="eyebrow">REPORT BREAKDOWN</span><h2>By category</h2></div><BarChart3 size={19} /></div>
            {stats.categoryDistribution.length ? <div className="chart-content"><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={stats.categoryDistribution} dataKey="value" nameKey="name" innerRadius={56} outerRadius={82} paddingAngle={3}>{stats.categoryDistribution.map((item, index) => <Cell key={item.name} fill={palette[index % palette.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div><ul className="chart-legend">{stats.categoryDistribution.map((item, index) => <li key={item.name}><i style={{ background: palette[index % palette.length] }} /><span>{item.name}</span><strong>{item.value}</strong></li>)}</ul></div> : <EmptyChart text="No reports to categorize yet." />}
          </article>
          <article className="chart-card"><div className="section-title"><div><span className="eyebrow">PRIORITY REVIEW</span><h2>By severity</h2></div><BarChart3 size={19} /></div>
            {stats.severityDistribution.some((item) => item.value) ? <div className="severity-chart">{stats.severityDistribution.map((item) => <div key={item.name} className="severity-row"><span className={`severity-dot ${item.name.toLowerCase()}`} /><span>{item.name}</span><div className="severity-track"><i style={{ width: `${stats.total ? item.value / stats.total * 100 : 0}%`, background: severityPalette[item.name] }} /></div><strong>{item.value}</strong></div>)}<p className="chart-footnote">Priority is an advisory classification and may be updated through administrator review.</p></div> : <EmptyChart text="No severity data available yet." />}
          </article>
        </div>
        <section className="area-section">
          <div className="section-title"><div><span className="eyebrow">AREA DISTRIBUTION</span><h2>Reports by named area</h2><p>Only citizen-provided area names are counted. Reports without a named area are omitted.</p></div></div>
          {stats.areaDistribution.length ? <div className="area-list">{stats.areaDistribution.map((item, index) => <div className="area-row" key={item.name}><span className="area-rank">{String(index + 1).padStart(2, "0")}</span><span className="area-name">{item.name}</span><span className="area-bar"><i style={{ width: `${Math.max(4, item.value / stats.areaDistribution[0].value * 100)}%` }} /></span><strong>{item.value}</strong></div>)}</div> : <EmptyChart text="No reports with a named area yet." />}
        </section>
        <section className="map-section">
          <div className="section-title map-title"><div><span className="eyebrow">GEOGRAPHIC VIEW</span><h2>Reported issue locations</h2><p>Markers appear only for citizen-selected locations.</p></div><span className="map-count">{filtered.length} mapped reports</span></div>
          <div className="filter-row"><label>Category<select value={category} onChange={(e) => setCategory(e.target.value)}><option value="">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label>Severity<select value={severity} onChange={(e) => setSeverity(e.target.value)}><option value="">All priorities</option>{["HIGH", "MEDIUM", "LOW"].map((item) => <option key={item}>{item}</option>)}</select></label></div>
          {filtered.length ? <MapView complaints={filtered} height="440px" /> : <div className="empty-map"><MapView height="320px" /><p>No reports match these filters. Submitted reports with selected coordinates will show here.</p></div>}
        </section>
        <section className="recent-section">
          <div className="section-title"><div><span className="eyebrow">{searchResults ? "COMPLAINT LOOKUP" : "LATEST ACTIVITY"}</span><h2>{searchResults ? "Search results" : "Recent reports"}</h2></div><Link className="inline-link" to="/track">Track a report <ArrowRight size={15} /></Link></div>
          <form className="dashboard-search" onSubmit={searchComplaints}><Search size={16} /><input value={complaintSearch} onChange={(event) => setComplaintSearch(event.target.value)} placeholder="Search by complaint ID" aria-label="Search by complaint ID" /><button className="button button-outline" disabled={searching}>{searching ? <LoaderCircle className="spin" size={15} /> : "Search"}</button>{searchResults && <button className="search-clear" type="button" aria-label="Clear search" onClick={() => { setSearchResults(null); setComplaintSearch(""); }}><X size={15} /></button>}</form>
          {(searchResults ?? stats.recent).length ? <div className="complaints-grid">{(searchResults ?? stats.recent).map((item) => <ComplaintCard key={item._id} complaint={item} />)}</div> : <EmptyChart text={searchResults ? "No complaint matches that ID." : "No reports have been submitted yet."} />}
        </section>
      </>}
    </div>
  );
}

function EmptyChart({ text }) {
  return <div className="chart-empty">{text}</div>;
}
