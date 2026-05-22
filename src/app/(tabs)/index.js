import { StyleSheet, View, Text, Modal, Image, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';
import MapaView from '../../components/MapView'; // Expo elige .native.js o .web.js solo
import { getMarkerImageSource } from '../../constants/markerImages';
import { Image as ExpoImage } from 'expo-image';

export default function Mapa() {
  const [modal, setModal] = useState(false);
  const [selectedMarker, setMarker] = useState(null);

  const showModal = (marker) => {
    setModal(true);
    setMarker(marker);
  };

  const markerImage = selectedMarker ? getMarkerImageSource(selectedMarker.id) : null;

  return (
    <View style={styles.container}>
      <MapaView onMarkerPress={showModal} />

      {modal && (
        <Modal animationType="fade" visible={true} transparent={true} onRequestClose={() => setModal(false)}>
          <Pressable style={styles.overlay} onPress={() => setModal(false)}>
            <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
              {markerImage ? <ExpoImage source={markerImage} style={styles.heroImage} contentFit="cover" transition={150} /> : null}

              <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.kicker}>Sitio histórico</Text>
                <Text style={styles.title}>{selectedMarker?.title ?? 'Sin título'}</Text>
                <Text style={styles.description}>
                  {selectedMarker?.description?.trim() || 'No hay descripción disponible para este marcador.'}
                </Text>

                {selectedMarker?.biblio ? <Text style={styles.source}>Fuente: {selectedMarker.biblio}</Text> : null}

                <Link href="/articulos" asChild>
                  <Pressable style={styles.articleButton}>
                    <Text style={styles.articleButtonText}>Leer más</Text>
                  </Pressable>
                </Link>

                <Pressable style={styles.closeButton} onPress={() => setModal(false)}>
                  <Text style={styles.closeButtonText}>Volver al mapa</Text>
                </Pressable>
              </ScrollView>
            </View>
          </Pressable>
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