import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./index.css";

const Home = lazy(() => import("./pages/Home"));
const Report = lazy(() => import("./pages/Report"));
const Track = lazy(() => import("./pages/Track"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ComplaintDetails = lazy(() => import("./pages/ComplaintDetails"));

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-main">
        <Suspense fallback={<div className="loading-panel">Loading CivicEye…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<Report />} />
            <Route path="/track" element={<Track />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/complaints/:id" element={<ComplaintDetails />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
