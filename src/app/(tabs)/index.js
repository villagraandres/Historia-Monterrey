import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import mapStyle from '../../mapStyle.json'

export default function Mapa() {

  const markers = [{ 
        coords: [25.664795997346236, -100.31165318508616],
        id:'circulo-mercantil',
        title: "Circulo Mercantil222",
        description: "El Círculo Mercantil Mutualista de Monterrey fue constituido en 1901 y contaba con 38 socios.\nEl edificio actual fue diseñado por FIUSA y su construcción dirigida por Juan Garza Lafón, inaugurándose en septiembre de 1933. Ocupa parte del terreno de la antigua iglesia y convento de San Francisco que cerraban la calle de Zaragoza al sur y que fueron destruidos en 1914",
        icon:'genericS'   
  }]

  return (
    <View style={styles.container}>
      <MapView style={styles.map} customMapStyle={mapStyle}   
        initialRegion={{
          latitude: 25.67,
          longitude: -100.31,
          latitudeDelta: 0.22,
          longitudeDelta: 0.22,
        }}>
          {markers.map((marker) => (
            <Marker key={marker.id} coordinate={{latitude: marker.coords[0], longitude: marker.coords[1]}} title ={marker.title} description={marker.description}/>
            )
          )}

      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
