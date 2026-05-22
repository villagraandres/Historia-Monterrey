import { View, Text } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";


export default function Articulo(){
    const params = useLocalSearchParams();
    /**
     * Con el id que se recibe en parms.info se saca la info de /data
     */
    console.log(params.info);
    
    return (

        <>
        <Stack.Screen options={{headerTitle: `Artículo ${params.info}`}} />
        <View>
            <Text>Articulo {params.info}</Text>
        </View>
        </>
    )
}