import { Stack, useRouter } from "expo-router"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import markers from "../../../data/markers"

export default function Articulos (){
  const router = useRouter()

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Navegar por artículos',
          headerStyle: {
            height: 60,
            backgroundColor: '#f1e6d7',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
          },
          headerTintColor: '#4a2e13',
        }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        {markers.map((marker) => (
          <TouchableOpacity
            key={marker.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.navigate({ pathname: `(tabs)/articulos/[id]`, params: { info: marker.id } })}
          >
            <Text style={styles.title}>{marker.title}</Text>
            <Text style={styles.subtitle}>{marker.id}</Text>
            {marker.description ? (
              <Text style={styles.description} numberOfLines={3}>
                {marker.description}
              </Text>
            ) : null}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#f2e5d0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#d3b89b',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#555',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
})