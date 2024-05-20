import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';

import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from './screens/MapScreen';
import ListScreen from './screens/ListScreen';
import PlaylistScreen from './screens/PlaylistScreen';
import StoryScreen from './screens/StoryScreen';

const MapStack = createStackNavigator();
const ListStack = createStackNavigator();
const PlaylistStack = createStackNavigator();

// const Tab = createBottomTabNavigator();
const Tab = createMaterialBottomTabNavigator();

const MapStackScreen = () => (
  <MapStack.Navigator screenOptions={{ headerShown: false }}>
    <MapStack.Screen name="MapScreen" component={MapScreen} />
    <MapStack.Screen name="Story" component={StoryScreen} />
  </MapStack.Navigator>
);

const ListStackScreen = () => (
  <ListStack.Navigator screenOptions={{ headerShown: false }}>
    <ListStack.Screen name="ListScreen" component={ListScreen} />
    <ListStack.Screen name="Story" component={StoryScreen} />
  </ListStack.Navigator>
);


const PlaylistStackScreen = () => (
  <PlaylistStack.Navigator screenOptions={{ headerShown: false }}>
    <PlaylistStack.Screen name="PlaylistScreen" component={PlaylistScreen} />
    <PlaylistStack.Screen name="Story" component={StoryScreen} />
  </PlaylistStack.Navigator>
);

const AppNavigator = () => (
  <Tab.Navigator
      initialRouteName="MapStackScreen"
      shifting={false}
      sceneAnimationEnabled={false}
      // activeColor="#f0edf6"
      // inactiveColor="#3e2465"
      // barStyle={{
      //   backgroundColor: '#694fad'
      // }}
    >
    <Tab.Screen
      name="Map"
      component={MapStackScreen}
      options={{
          tabBarIcon: 'map',
        }}
     />
     <Tab.Screen
       name="List"
       component={ListStackScreen}
       options={{
           tabBarIcon: 'format-list-text',
         }}
      />
      <Tab.Screen
        name="Playlist"
        component={PlaylistStackScreen}
        options={{
          tabBarIcon: 'playlist-music',
        }}
      />
  </Tab.Navigator>
);

export default AppNavigator;
