/**
 * App.tsx
 * 
 * Entry point into the application
 */
import React from 'react';
import {DarkTheme, DefaultTheme, NavigationContainer} from '@react-navigation/native';
import AppState from './src/components/state/AppState';
import { useColorScheme } from 'react-native';
import NavigatorBottomTabs from './src/NavigatorBottomTabs';


export default function App() {
  
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={scheme === "dark" ? DarkTheme : DefaultTheme}>
      <AppState>
        <NavigatorBottomTabs />
      </AppState>
    </NavigationContainer>
  );
};
