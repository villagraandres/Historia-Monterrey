import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markers from '../data/markers.json';
import initialRegion from '../data/initialRegion.json';

// Fix de íconos usando CDN en lugar de archivos locales
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;



export default function MapaView({ onMarkerPress }) {
  const center = [initialRegion.latitude, initialRegion.longitude];

    return (
      <MapContainer
      center={center}
      zoom={13}
      style={{ width: '100%', height: '100vh' }}
      >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.coords[0], marker.coords[1]]}
          eventHandlers={{
            click: () => onMarkerPress(marker),
          }}
        >
          <Popup>{marker.title}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}