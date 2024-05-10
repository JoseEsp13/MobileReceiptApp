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
import * as routes from './routes';
import LoginScreen from './screens/LoginScreen';
import useAppContext from './components/hooks/useAppContext';
import LogoutScreen from './screens/LogoutScreen';
import SignUpScreen from './screens/SignUpScreen';

// Typescript route types required by react-navigation
// Defines additional prop variables for each screen.
export type RootDrawerParamList = {
  [routes.HOME_SCREEN]: undefined,
  [routes.SELECT_SCREEN]: undefined,
  [routes.PROCESS_IMAGE_SCREEN]: {
    uri: string;
  },
  [routes.GROUPS_SCREEN]: undefined,
  [routes.CONTACTS_SCREEN]: undefined,
  [routes.SETTINGS_SCREEN]: undefined,
  [routes.LOGIN_SCREEN]: undefined,
  [routes.LOGOUT_SCREEN]: undefined,
  [routes.SIGNUP_SCREEN]: undefined
};

// Typescript prop types for screens
// Adds additional methods to the prop variable such as navigate()
export type HomeScreenNavigationProps = DrawerScreenProps<RootDrawerParamList, typeof routes.HOME_SCREEN>;
export type SelectScreenNavigationProps = DrawerScreenProps<RootDrawerParamList, typeof routes.SELECT_SCREEN>;
export type ProcessImageNavigationProps = DrawerScreenProps<RootDrawerParamList, typeof routes.PROCESS_IMAGE_SCREEN>;
export type ProcessImageRouteProps = RouteProp<RootDrawerParamList, typeof routes.PROCESS_IMAGE_SCREEN>;
export type GroupsNavigationProps = DrawerScreenProps<RootDrawerParamList, typeof routes.GROUPS_SCREEN>;
export type ContactsScreenNavigationProps = DrawerScreenProps<RootDrawerParamList, typeof routes.CONTACTS_SCREEN>;
export type SettingsScreenNavigationProps = DrawerScreenProps<RootDrawerParamList, typeof routes.SETTINGS_SCREEN>;
export type LoginScreenNavigationProps = DrawerScreenProps<RootDrawerParamList, typeof routes.LOGIN_SCREEN>;
export type LogoutScreenNavigationProps = DrawerScreenProps<RootDrawerParamList, typeof routes.LOGOUT_SCREEN>;
export type SignUpScreenNavigationProps = DrawerScreenProps<RootDrawerParamList, typeof routes.SIGNUP_SCREEN>;

// Instantiates a react-navigation drawer with the current route up top
const Drawer = createDrawerNavigator<RootDrawerParamList>();

// Defines our routing and the component they route to
export const Navigator = () => {

  const ctx = useAppContext();

  return (
    <Drawer.Navigator>
      {ctx.authUser == null ? (
          <>
            <Drawer.Screen name={routes.LOGIN_SCREEN} component={LoginScreen} />
            <Drawer.Screen name={routes.SIGNUP_SCREEN} component={SignUpScreen} />
            
            <Drawer.Screen name={routes.LOGOUT_SCREEN} component={LogoutScreen} options={{drawerItemStyle: {display: "none"}}}/>
          </>
        ) : 
        (
          <>
            <Drawer.Screen name={routes.HOME_SCREEN} component={HomeScreen} />
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