import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Camera, Check, ChevronRight, MapPinned, ShieldCheck, Sparkles } from "lucide-react";

const steps = [
  { number: "01", title: "Spot an issue", text: "See a civic problem in your neighborhood? Share what happened and where it is." },
  { number: "02", title: "Add the details", text: "Upload a photo, describe the issue, and mark the real location on the map." },
  { number: "03", title: "Track progress", text: "Get a unique tracking ID and follow updates in the public demonstration dashboard." }
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-glow" />
        <div className="container hero-content">
          <div className="hero-copy">
            <div className="eyebrow eyebrow-light"><span className="live-dot" /> COMMUNITY-POWERED CIVIC INTELLIGENCE</div>
            <h1>Small reports.<br /><span>Stronger communities.</span></h1>
            <p>Turn the issues you see every day into clear, trackable reports. CivicEye helps make local infrastructure concerns easier to understand and follow.</p>
            <div className="hero-actions">
              <Link className="button button-primary" to="/report">Report a problem <ArrowRight size={17} /></Link>
              <Link className="button button-ghost" to="/dashboard">Explore the dashboard <ChevronRight size={17} /></Link>
            </div>
            <div className="hero-footnote"><ShieldCheck size={16} /> AI suggestions are advisory. Location is selected by you.</div>
          </div>
          <div className="hero-visual">
            <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
            <div className="visual-crosshair">+</div>
            <div className="visual-card visual-report">
              <span className="visual-icon"><MapPinned size={20} /></span>
              <div><small>COMMUNITY REPORT</small><strong>Road damage</strong></div>
              <span className="severity-badge severity-high">HIGH</span>
            </div>
            <div className="visual-card visual-ai">
              <span className="ai-spark"><Sparkles size={18} /></span>
              <div><small>AI ASSISTANCE</small><strong>Issue summary ready</strong></div>
              <Check size={17} className="check-mark" />
            </div>
            <div className="visual-center"><ActivityMark /></div>
            <span className="coord-label">REPORT · REVIEW · RESOLVE</span>
          </div>
        </div>
        <div className="hero-bottom-line" />
      </section>

      <section className="section container mission-section">
        <div className="section-intro">
          <span className="eyebrow">A CLEARER WAY TO SPEAK UP</span>
          <h2>Make local issues<br />visible and actionable.</h2>
        </div>
        <p className="mission-copy">A pothole, a leaking pipe, a blocked drain — small civic issues can have a big impact. CivicEye brings reports, map locations, and transparent status updates together in one place.</p>
        <div className="feature-grid">
          <article className="feature-card"><span className="feature-icon blue-bg"><Camera /></span><h3>Report with context</h3><p>Share a description, photo, and the map location you select.</p></article>
          <article className="feature-card"><span className="feature-icon violet-bg"><Sparkles /></span><h3>AI-assisted clarity</h3><p>Optional AI suggestions help structure a report, always subject to human review.</p></article>
          <article className="feature-card"><span className="feature-icon green-bg"><MapPinned /></span><h3>See the bigger picture</h3><p>Explore submitted reports on a map and review real complaint statistics.</p></article>
          <article className="feature-card"><span className="feature-icon orange-bg"><BarChart3 /></span><h3>Follow progress</h3><p>Use a unique ID to check a report's latest demonstration status.</p></article>
        </div>
      </section>

      <section className="steps-section">
        <div className="container">
          <div className="section-heading centered">
            <span className="eyebrow">HOW IT WORKS</span>
            <h2>From observation to follow-up</h2>
            <p>A simple process built around clear information and real locations.</p>
          </div>
          <div className="steps-grid">{steps.map((step) => <article className="step-card" key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
        </div>
      </section>

      <section className="cta-section container">
        <div><span className="eyebrow eyebrow-light">YOUR NEIGHBORHOOD, YOUR VOICE</span><h2>See something that needs attention?</h2><p>Start a report with a clear description and a location you choose.</p></div>
        <Link className="button button-white" to="/report">Create a report <ArrowRight size={17} /></Link>
      </section>
    </>
  );
}

function ActivityMark() {
  return <div className="activity-mark"><span /><span /><span /><span /><span /></div>;
}
