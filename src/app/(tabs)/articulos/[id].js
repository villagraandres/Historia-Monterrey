import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions, Image } from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import markers from "../../../data/markers";
import { getMarkerImages } from "../../../constants/markerImages";

export default function Articulo(){
        const params = useLocalSearchParams();
        const router = useRouter();
        const { width } = useWindowDimensions();

        // obtener el marcador por id (params.info)
        const marker = markers.find(m => m.id === params.info) ?? null;
        const images = marker ? getMarkerImages(marker.id) : [];
        const carouselWidth = Math.min(width - 32, 640);

        return (
                <>
                <Stack.Screen options={{headerTitle: marker?.title ?? `Artículo ${params.info}`}} />
                <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
                    <View style={styles.carouselWrap}>
                        <Text style={styles.carouselHint}>Imágenes encontradas: {images.length}</Text>
                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={carouselWidth + 16}
                            decelerationRate="fast"
                            contentContainerStyle={styles.carouselContent}
                        >
                            {(images.length > 0 ? images : [null]).map((item, index) => (
                                <View key={`${marker?.id ?? params.info}-${index}`} style={[styles.slide, { width: carouselWidth }]}>
                                    {item ? (
                                        <Image source={item} style={styles.image} resizeMode="cover" />
                                    ) : (
                                        <View style={styles.imageFallback} />
                                    )}
                                </View>
                            ))}
                        </ScrollView>
                        <Text style={styles.carouselHint}>Desliza para ver más fotos</Text>
                    </View>

                    <View style={styles.container}>
                        <Text style={styles.kicker}>Sitio histórico</Text>
                        <Text style={styles.title}>{marker?.title ?? 'Sin título'}</Text>
                        <Text style={styles.description}>
                            {marker?.description?.trim() || 'No hay descripción disponible para este marcador.'}
                        </Text>

                        {marker?.biblio ? <Text style={styles.source}>Fuente: {marker.biblio}</Text> : null}

                        <TouchableOpacity
                            style={styles.mapButton}
                            onPress={() => marker ? router.push({ pathname: '/', params: { info: marker.id } }) : null}
                        >
                            <Text style={styles.mapButtonText}>Ver en el mapa</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                </>
        )
}

const styles = StyleSheet.create({
    page: {
        paddingBottom: 24,
    },
    carouselWrap: {
        paddingTop: 16,
        paddingBottom: 8,
    },
    carouselContent: {
        paddingHorizontal: 16,
    },
    slide: {
        paddingHorizontal: 0,
        marginRight: 16,
    },
    image: {
        width: '100%',
        height: 320,
        borderRadius: 22,
        backgroundColor: '#e5e7eb',
    },
    imageFallback: {
        width: '100%',
        height: 320,
        borderRadius: 22,
        backgroundColor: '#e5e7eb',
    },
    container: { paddingHorizontal: 16, paddingTop: 16 },
    kicker: { fontSize: 12, letterSpacing: 1.3, textTransform: 'uppercase', color: '#8b5e34', marginBottom: 8, fontWeight: '700' },
    title: { fontSize: 20, fontWeight: '800', marginBottom: 12 },
    description: { fontSize: 15, lineHeight: 22, color: '#333' },
    source: { marginTop: 12, fontSize: 13, lineHeight: 18, color: '#6b7280', fontStyle: 'italic' },
    carouselHint: { marginTop: 10, paddingHorizontal: 16, fontSize: 12, color: '#6b7280' },
    mapButton: { marginTop: 18, backgroundColor: '#1f2937', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
    mapButtonText: { color: '#fffaf2', fontWeight: '700' },
    footerSpace: { height: 16 },
});