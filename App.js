import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TitleHeader from './TitleHeader';
import DefineGroups from './DefineGroups';
import Settings from './Settings'; // Import the Settings component


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TitleHeader">
        <Stack.Screen
          name="TitleHeader"
          component={TitleHeader}
          options={{ headerShown: false }} // Hide the header for this screen
        />
        <Stack.Screen name="DefineGroups" component={DefineGroups} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
