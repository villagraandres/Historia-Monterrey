import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markers from '../data/markers.json';
import initialRegion from '../data/initialRegion.json';
import { getMarkerIconUrl } from '../constants/markerIcons';

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



export default function MapaView({ onMarkerPress, mapMode = 'satellite' }) {
  const center = [initialRegion.latitude, initialRegion.longitude];
  const tileUrl = mapMode === 'satellite'
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const attribution = mapMode === 'satellite' ? 'Tiles © Esri' : '© OpenStreetMap contributors';

    return (
      <MapContainer
      center={center}
      zoom={15}
      style={{ width: '100%', height: '100vh' }}
      >
      <TileLayer
        url={tileUrl}
        attribution={attribution}
      />
      {markers.map((marker) => (
        (() => {
          const customIcon = L.icon({
            iconUrl: getMarkerIconUrl(marker.icon),
            iconRetinaUrl: getMarkerIconUrl(marker.icon),
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [64, 64],
            iconAnchor: [32, 64],
            popupAnchor: [0, -58],
            shadowSize: [41, 41],
          });

          return (
        <Marker
          key={marker.id}
          position={[marker.coords[0], marker.coords[1]]}
          icon={customIcon}
          eventHandlers={{
            click: () => onMarkerPress(marker),
          }}
        >
          <Popup>{marker.title}</Popup>
        </Marker>
          );
        })()
      ))}
    </MapContainer>
  );
}