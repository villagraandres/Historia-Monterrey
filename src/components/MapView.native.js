import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { mapStyle } from '../constants/mapStyle';
import markers from '../data/markers.json';
import initialRegion from '../data/initialRegion.json';
import { getMarkerIconSource } from '../constants/markerIcons';

export default function MapaView({ onMarkerPress, mapMode = 'satellite' }) {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        customMapStyle={mapStyle}
        initialRegion={initialRegion}
        mapType={mapMode === 'satellite' ? 'satellite' : 'standard'}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.coords[0], longitude: marker.coords[1] }}
            title={marker.title}
            description={marker.description}
            anchor={{ x: 0.5, y: 1 }}
            image={getMarkerIconSource(marker.icon)}
            onPress={() => onMarkerPress(marker)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
});