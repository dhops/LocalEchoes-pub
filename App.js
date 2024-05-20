import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/TabNavigator'; // Adjust the path as needed
import { StoriesProvider } from './src/context/StoriesContext';
import { PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <StoriesProvider>
          <AppNavigator />
        </StoriesProvider>
      </NavigationContainer>
    </PaperProvider>
  );
}
