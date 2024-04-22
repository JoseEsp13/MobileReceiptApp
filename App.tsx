/**
 * App.tsx
 * 
 * Entry point into the application
 */
import React, {FC} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { Navigator } from './src/Navigator';


export const App = () => {
  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
};

export default App;
