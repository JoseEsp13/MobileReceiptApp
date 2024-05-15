/**
 * Navigator.tsx
 * 
 * Contains the routes for the app. Also configures the left drawer and the title bar.
 */
import React from 'react';
import {SelectImageScreen} from './screens/SelectImageScreen';
import {RouteProp} from '@react-navigation/native';
import { createDrawerNavigator, DrawerScreenProps } from '@react-navigation/drawer';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import GroupsScreen from './screens/GroupsScreen';
import { ProcessImageScreen } from './screens/ProcessImageScreen';
import routes, { IRootParamList } from './routes'
import LoginScreen from './screens/LoginScreen';
import useAppContext from './components/hooks/useAppContext';
import LogoutScreen from './screens/LogoutScreen';
import SignUpScreen from './screens/SignUpScreen';
import { View } from 'react-native';


export default function NavigatorDrawer() {
  return (<View></View>)
}

// Instantiates a react-navigation drawer
/*const Drawer = createDrawerNavigator<IRootParamList>();

// Defines our routing and the component they route to
export default function NavigatorDrawer() {

  const ctx = useAppContext();

  // If you want to turn off login authentication, set this to true
  const isAuthenticated = ctx.authenticated;

  return (
    <Drawer.Navigator>
      {!isAuthenticated ? (
          <>
            <Drawer.Screen name={routes.LOGIN_SCREEN} component={LoginScreen} />
            <Drawer.Screen name={routes.SIGNUP_SCREEN} component={SignUpScreen} />
            
            <Drawer.Screen name={routes.LOGOUT_SCREEN} component={LogoutScreen} options={{drawerItemStyle: {display: "none"}}}/>
          </>
        ) : 
        (
          <>
            <Drawer.Screen name={routes.HOME_SCREEN} component={HomeScreen} options={{title: `Welcome ${ctx.user.name}` ?? "Home"}}/>
            <Drawer.Screen name={routes.SELECT_SCREEN} component={SelectImageScreen} />
            <Drawer.Screen name={routes.GROUPS_SCREEN} component={GroupsScreen} />
            <Drawer.Screen name={routes.SETTINGS_SCREEN} component={SettingsScreen} />
            <Drawer.Screen name={routes.LOGOUT_SCREEN} component={LogoutScreen} />

            <Drawer.Screen name={routes.PROCESS_IMAGE_SCREEN} component={ProcessImageScreen} options={{drawerItemStyle: {display: "none"}}} />
          </>
        )}
    </Drawer.Navigator>
  )
}
*/