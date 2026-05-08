import {Tabs} from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout(){
    return (
        <Tabs>
            <Tabs.Screen 
            name='index'
            options={{title: 'Mapa', tabBarIcon: ({color,size}) => (
                <Ionicons name='map-outline' size={size} color={color}/>
            )}}
            />
            <Tabs.Screen name='articulos' options={{title:'Articulos', tabBarIcon: ({color, size}) => (
                <Ionicons name='newspaper-outline' size={size} color={color}/>
            )}}/>
            <Tabs.Screen name='perfil' options={{title: 'Perfil', tabBarIcon: ({color, size}) => (
                <Ionicons name="person-outline" size={size} color={color} />
            )}}/>
        </Tabs>
    )
}