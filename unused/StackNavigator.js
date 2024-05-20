import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from './screens/MapScreen';
import StoryScreen from './screens/StoryScreen';
import ClusterListScreen from './screens/ClusterListScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Map">
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Stories"
        component={ClusterListScreen}
        options={{ title: 'Stories' }}  // Optionally set a title
      />
      <Stack.Screen
        name="Story"
        component={StoryScreen}
        options={{ title: 'Story' }}  // Optionally set a title
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
