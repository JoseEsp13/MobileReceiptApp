/**
 * App.tsx
 * 
 * Entry point into the application
 */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { Navigator } from './src/Navigator';
import AppState from './src/components/AppState';


export default function App() {
  
  return (
    <NavigationContainer>
      <AppState>
        <Navigator />
      </AppState>
    </NavigationContainer>
  );
};
