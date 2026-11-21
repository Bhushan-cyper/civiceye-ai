import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import SeverityBadge from "./SeverityBadge";

const severityColors = { HIGH: "#d94b45", MEDIUM: "#e89a35", LOW: "#2c9b73" };
const pinIcon = (color) => L.divIcon({
  className: "map-pin-wrap",
  html: `<span class="map-pin" style="--pin-color:${color}"></span>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

function MapClick({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect?.({ latitude: event.latlng.lat, longitude: event.latlng.lng });
    }
  });
  return null;
}

function FitComplaints({ complaints }) {
  const map = useMap();
  useEffect(() => {
    const points = complaints
      .filter((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude))
      .map((item) => [item.latitude, item.longitude]);
    if (points.length === 1) map.setView(points[0], 14);
    if (points.length > 1) map.fitBounds(points, { padding: [28, 28], maxZoom: 14 });
  }, [complaints, map]);
  return null;
}

export default function MapView({ complaints = [], selectedLocation, onSelect, height = "400px" }) {
  const center = selectedLocation
    ? [selectedLocation.latitude, selectedLocation.longitude]
    : [20, 0];
  return (
    <div className="map-frame" style={{ height }}>
      <MapContainer center={center} zoom={selectedLocation ? 14 : 2} scrollWheelZoom className="leaflet-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClick onSelect={onSelect} />
        <FitComplaints complaints={complaints} />
        {selectedLocation && (
          <Marker position={[selectedLocation.latitude, selectedLocation.longitude]} icon={pinIcon("#2476aa")}>
            <Popup>Selected report location</Popup>
          </Marker>
        )}
        {complaints.map((complaint) => (
          <Marker key={complaint._id || complaint.complaintId} position={[complaint.latitude, complaint.longitude]} icon={pinIcon(severityColors[complaint.priority] || severityColors.MEDIUM)}>
            <Popup>
              <strong>{complaint.category}</strong>
              <p>{complaint.description}</p>
              <p><SeverityBadge severity={complaint.priority} /> <span>{complaint.complaintId}</span></p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
