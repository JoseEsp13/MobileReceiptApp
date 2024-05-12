/**
 * App.tsx
 * 
 * Entry point into the application
 */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import NavigatorBottomTabs from './src/NavigatorBottomTabs';
import AppState from './src/components/state/AppState';
import NavigatorDrawer from './src/NavigatorDrawer';


export default function App() {
  
  return (
    <NavigationContainer>
      <AppState>
        <NavigatorDrawer />
      </AppState>
    </NavigationContainer>
  );
};
