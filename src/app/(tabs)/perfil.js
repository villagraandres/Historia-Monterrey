import { View, Text, StyleSheet, FlatList, useWindowDimensions } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getColeccionableImageSource } from "../../constants/markerImages";
import { Image as ExpoImage } from "expo-image";

export default function Perfil(){
  const [coleccionables, setColeccionables] = useState([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const itemSize = (width - 40) / 2;

  const loadColeccionables = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem("coleccionables");
      if (stored) {
        const ids = JSON.parse(stored);
        console.log("Coleccionables obtenidos:", ids);
        setColeccionables(ids);
      } else {
        setColeccionables([]);
      }
    } catch (error) {
      console.error("Error al cargar coleccionables:", error);
      setColeccionables([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadColeccionables();
    }, [loadColeccionables])
  );

  const renderColeccionable = ({ item }) => {
    const imageSource = getColeccionableImageSource(item);
    console.log(`Renderizando coleccionable ${item} con imagen:`, imageSource);
    return (
      <View style={[styles.coleccionableCard, { width: itemSize, height: itemSize }]}>
        {imageSource ? (
          <ExpoImage
            source={imageSource}
            style={styles.coleccionableImage}
            contentFit="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>{item}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Coleccionables</Text>
      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : coleccionables.length === 0 ? (
        <Text style={styles.emptyText}>No hay coleccionables aún</Text>
      ) : (
        <FlatList
          data={coleccionables}
          renderItem={renderColeccionable}
          keyExtractor={(item) => item}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4efe7",
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 20,
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  listContent: {
    paddingBottom: 20,
  },
  coleccionableCard: {
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  coleccionableImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#6b7280",
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 5,
  },
});