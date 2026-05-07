import {Tabs} from 'expo-router'

export default function TabLayout(){
    return (
        <Tabs>
            <Tabs.Screen 
            name='index'
            options={{title: 'Mapa'}}
            />
            <Tabs.Screen name='articulos' options={{title:'Articulos'}}/>
            <Tabs.Screen name='perfil' options={{title: 'Perfil'}}/>
        </Tabs>
    )
}