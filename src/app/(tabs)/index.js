import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text, Modal, Button } from 'react-native';
import {mapStyle} from '../../constants/mapStyle'
import markers from '../../data/markers.json'
import initialRegion from '../../data/initialRegion.json'
import { useState, useRef } from 'react';
import { Link } from 'expo-router';


export default function Mapa() {

  const [modal, SetModal] = useState(false)
  const [selectedMarker, setMarker] = useState({})

  const showModal = (marker) => {
    SetModal(true)
    setMarker(marker)
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} customMapStyle={mapStyle}   
        initialRegion={initialRegion}>
          {markers.map((marker) => (
            <Marker key={marker.id} coordinate={{latitude: marker.coords[0], longitude: marker.coords[1]}} title={marker.title} description={marker.description} onPress={(() =>showModal(marker))}/>
            )
          )}
      </MapView>
      {modal && 
      <Modal animationType='fade' visible={true} transparent={true} onRequestClose={()  => SetModal(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{textAlign: 'center'}}>{selectedMarker.title}</Text>
            <Text style={{textAlign: 'center'}}>{selectedMarker.description}</Text>
            <Link href="/articulos" style={{textDecorationLine: 'underline'}}>Leer mas</Link>
            <Button title='Volver al mapa' onPress={() => SetModal(false)}></Button>  
          </View>
        </View>
        </Modal>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { 
    width: '100%', 
    height: '100%' 
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignitems: 'center'
  },
    modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

});
