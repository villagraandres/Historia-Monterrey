import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Platform } from 'react-native';
import * as Location from 'expo-location';
import { mapStyle } from '../constants/mapStyle';
import markers from '../data/markers.json';
import initialRegion from '../data/initialRegion.json';
import { getMarkerIconSource } from '../constants/markerIcons';

export default function MapaView({ onMarkerPress, mapMode = 'satellite' }) {
  const mapRef = useRef(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadUserLocation = async () => {
      if (Platform.OS !== 'android') {
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (!isActive) {
        return;
      }

      const granted = status === 'granted';
      setHasLocationPermission(granted);

      if (!granted) {
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      if (!isActive || !mapRef.current) {
        return;
      }

      mapRef.current.animateToRegion(
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: initialRegion.latitudeDelta,
          longitudeDelta: initialRegion.longitudeDelta,
        },
        900
      );
    };

    loadUserLocation().catch(() => {
      if (isActive) {
        setHasLocationPermission(false);
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        customMapStyle={mapStyle}
        initialRegion={initialRegion}
        mapType={mapMode === 'satellite' ? 'satellite' : 'standard'}
        showsUserLocation={Platform.OS === 'android' && hasLocationPermission}
        showsMyLocationButton={Platform.OS === 'android' && hasLocationPermission}
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