import { StyleSheet, View, Text, Modal, Pressable, ScrollView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Link } from 'expo-router';
import MapaView from '../../components/MapView'; // Expo elige .native.js o .web.js solo
import markers from '../../data/markers';
import { getMarkerImageSource } from '../../constants/markerImages';
import { Image as ExpoImage } from 'expo-image';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Mapa() {
  const [modal, setModal] = useState(false);
  const [selectedMarker, setMarker] = useState(null);
  const params = useLocalSearchParams();
  const [mapMode, setMapMode] = useState(Platform.OS === 'web' ? 'standard' : 'satellite');
  const [ubicacionActiva, setUbicacion] = useState(false)
  const [currentPosition, setCurrentPosition] = useState(null);
  const [markerCercano, setMarkerCercano] = useState(false);
  const [coleccionablesGuardados, setColeccionablesGuardados] = useState([]);

  const cargarColeccionablesGuardados = async () => {
    try {
      const existing = await AsyncStorage.getItem("coleccionables");
      const coleccionables = existing ? JSON.parse(existing) : [];
      setColeccionablesGuardados(Array.isArray(coleccionables) ? coleccionables : []);
      return Array.isArray(coleccionables) ? coleccionables : [];
    } catch (error) {
      console.error('Error al cargar coleccionables guardados:', error);
      setColeccionablesGuardados([]);
      return [];
    }
  };

  const agregarColeccionable = async (markerId) => {
    try {
      const existing = await cargarColeccionablesGuardados();
      let coleccionables = Array.isArray(existing) ? [...existing] : [];

      if (!coleccionables.includes(markerId)) {
        coleccionables.push(markerId);
        await AsyncStorage.setItem("coleccionables", JSON.stringify(coleccionables));
        setColeccionablesGuardados(coleccionables);
        console.log('Coleccionable agregado:', markerId);
      } else {
        console.log('El coleccionable ya existe:', markerId);
      }
    } catch (error) {
      console.error('Error al guardar el coleccionable:', error);
    }
  }

  const isCollected = (markerId) => coleccionablesGuardados.includes(markerId);

  const getDistanceMeters = (from, to) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371000; // radio de la Tierra en metros
    const dLat = toRad(to.latitude - from.latitude);
    const dLon = toRad(to.longitude - from.longitude);
    const lat1 = toRad(from.latitude);
    const lat2 = toRad(to.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const showModal = (marker) => {
    setMarker(marker);
    if (ubicacionActiva && currentPosition) {
      const distance = getDistanceMeters(
        { latitude: currentPosition.latitude, longitude: currentPosition.longitude },
        { latitude: marker.coords[0], longitude: marker.coords[1] }
      );
      console.log(`Distancia al marcador ${marker.id}: ${distance.toFixed(1)} m`);
      setMarkerCercano(distance <= 400);
    } else {
      setMarkerCercano(false);
    }
    setModal(true);
  };

  useEffect(() => {
    // Si viene ?info=<id> en la URL, abrir el modal del marcador correspondiente
    if (params?.info) {
      const m = markers.find((x) => x.id === params.info);
      if (m) {
        showModal(m);
      }
    }
  }, [params?.info]);

  useEffect(() => {
    cargarColeccionablesGuardados();
  }, []);

  const markerImage = selectedMarker ? getMarkerImageSource(selectedMarker.id) : null


  const toggleUbicacionAsync = async () => {
    if (!ubicacionActiva) {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        console.log('Location permission status:', status);

        if (status !== 'granted') {
          setUbicacion(false);
          setCurrentPosition(null);
          return;
        }

        const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        console.log('Ubicación actual:', position.coords);
        setCurrentPosition(position.coords);
        setUbicacion(true);
      } catch (err) {
        console.warn('Error al obtener la ubicación:', err);
        setUbicacion(false);
        setCurrentPosition(null);
      }
    } else {
      setUbicacion(false);
      setCurrentPosition(null);
      setMarkerCercano(false);
    }
  };

  return (
    <View style={styles.container}>
      <MapaView onMarkerPress={showModal} mapMode={mapMode} hasLocationPermission={ubicacionActiva} />

      <View style={[styles.mapControls, Platform.OS === 'web' && styles.mapControlsWeb]} pointerEvents="box-none">
        <View style={styles.mapHeader}>
          <Pressable
            style={[styles.mapToggleButton, mapMode === 'satellite' && styles.mapToggleButtonActive]}
            onPress={() => setMapMode('satellite')}
          >
            <Text style={[styles.mapToggleText, mapMode === 'satellite' && styles.mapToggleTextActive]}>Satélite</Text>
          </Pressable>
          <Pressable
            style={[styles.mapToggleButton, mapMode === 'standard' && styles.mapToggleButtonActive]}
            onPress={() => setMapMode('standard')}
          >
            <Text style={[styles.mapToggleText, mapMode === 'standard' && styles.mapToggleTextActive]}>Normal</Text>
          </Pressable>
          <Pressable style={[styles.mapToggleButton, !ubicacionActiva && styles.mapToggleButtonActive]} onPress={toggleUbicacionAsync}>
            <Text style={[styles.mapToggleText, !ubicacionActiva && styles.mapToggleTextActive]}>Ubicación</Text>
          </Pressable>
        </View>
      </View>

      {modal && (
        <Modal animationType="fade" visible={true} transparent={true} onRequestClose={() => setModal(false)}>
          <View style={styles.overlay}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setModal(false)} />
            <View style={styles.modalCard}>
              {markerImage ? <ExpoImage source={markerImage} style={styles.heroImage} contentFit="cover" transition={150} /> : null}

              <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.kicker}>Sitio histórico</Text>
                <Text style={styles.title}>{selectedMarker?.title ?? 'Sin título'}</Text>
                <Text style={styles.description}>
                  {selectedMarker?.description?.trim() || 'No hay descripción disponible para este marcador.'}
                </Text>

                {selectedMarker?.biblio ? <Text style={styles.source}>Fuente: {selectedMarker.biblio}</Text> : null}

                {(markerCercano && selectedMarker.collection && !isCollected(selectedMarker.id)) && (
                  <Pressable
                    style={styles.collectionButton}
                    onPress={() => agregarColeccionable(selectedMarker.id)}
                  >
                    <Text style={styles.collectionButtonText}>Obtener coleccionable</Text>
                  </Pressable>
                )}

                <Link href={{pathname: `(tabs)/articulos/[id]`, params: {info: selectedMarker.id}} } asChild>
                  <Pressable style={styles.articleButton}>
                    <Text style={styles.articleButtonText}>Leer más</Text>
                  </Pressable>
                </Link>

                <Pressable style={styles.closeButton} onPress={() => setModal(false)}>
                  <Text style={styles.closeButtonText}>Volver al mapa</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4efe7',
  },
  mapControls: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 40,
    elevation: 40,
  },
  mapControlsWeb: {
    left: 'auto',
    top: 'auto',
    right: 12,
    bottom: 92,
    width: 156,
    height: 56,
  },
  mapHeader: {
    flexDirection: 'row',
    gap: 10,
    ...(Platform.OS === 'web'
      ? {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          elevation: 50,
        }
      : {
          position: 'absolute',
          top: 12,
          left: 12,
          right: 12,
          zIndex: 50,
          elevation: 50,
        }),
  },
  mapToggleButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(31, 41, 55, 0.12)',
  },
  mapToggleButtonActive: {
    backgroundColor: '#1f2937',
    borderColor: '#1f2937',
  },
  mapToggleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  mapToggleTextActive: {
    color: '#fffaf2',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(17, 24, 39, 0.58)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#fffaf2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  heroImage: {
    width: '100%',
    height: 220,
    backgroundColor: '#d6d3d1',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 22,
    flexGrow: 1,
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: '#8b5e34',
    marginBottom: 8,
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    color: '#111827',
    fontWeight: '800',
  },
  description: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 23,
    color: '#374151',
  },
  source: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 18,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  articleButton: {
    marginTop: 18,
    backgroundColor: '#1f2937',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  articleButtonText: {
    color: '#fffaf2',
    fontSize: 15,
    fontWeight: '700',
  },
  collectionButton: {
    marginTop: 18,
    backgroundColor: '#047857',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  collectionButtonText: {
    color: '#fffaf2',
    fontSize: 15,
    fontWeight: '700',
  },
  closeButton: {
    marginTop: 12,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d6d3d1',
    backgroundColor: '#fffdf8',
  },
  closeButtonText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '700',
  },
});