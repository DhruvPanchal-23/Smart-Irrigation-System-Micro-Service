import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import L from 'leaflet';

const icon = L.divIcon({ className: 'map-pin', html: '<span></span>', iconSize: [24, 24], iconAnchor: [12, 24] });

export default function FarmMap({ farm }) {
  const latitude = Number(farm?.location?.latitude);
  const longitude = Number(farm?.location?.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return <div className="dashboard-inline-empty">Farm coordinates are unavailable.</div>;
  return (
    <div className="dashboard-farm-map" aria-label={`Map showing ${farm.farmName}`}>
      <MapContainer key={`${latitude}-${longitude}`} center={[latitude, longitude]} zoom={12} scrollWheelZoom={false}>
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker icon={icon} position={[latitude, longitude]} />
      </MapContainer>
    </div>
  );
}
