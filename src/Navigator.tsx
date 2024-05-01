/**
 * Navigator.tsx
 * 
 * Contains the routes for the app. Also configures the left drawer and the title bar.
 */
import React from 'react';
import * as routes from './routes';
import {SelectImageScreen} from './screens/SelectImageScreen';
import {RouteProp} from '@react-navigation/native';
import { createDrawerNavigator, DrawerScreenProps } from '@react-navigation/drawer';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import GroupsScreen from './screens/GroupsScreen';
import { ProcessImageScreen } from './screens/ProcessImageScreen';

// Typescript route types required by react-navigation
// Defines the props variable for each screen
type RootStackParamList = {
  [routes.HOME_SCREEN]: undefined,
  [routes.SELECT_SCREEN]: undefined,
  [routes.PROCESS_IMAGE_SCREEN]: {
    uri: string;
  },
  [routes.GROUPS_SCREEN]: undefined,
  [routes.FRIENDS_SCREEN]: undefined,
  [routes.SETTINGS_SCREEN]: undefined
};

// Instantiates a react-navigation drawer with a title up top
const Drawer = createDrawerNavigator<RootStackParamList>();

// Typescript prop types for screens
export type HomeScreenNavigationProps = DrawerScreenProps<RootStackParamList, typeof routes.HOME_SCREEN>;
export type SelectScreenNavigationProps = DrawerScreenProps<RootStackParamList, typeof routes.SELECT_SCREEN>;
export type ProcessImageNavigationProps = DrawerScreenProps<RootStackParamList, typeof routes.PROCESS_IMAGE_SCREEN>;
export type ProcessImageRouteProps = RouteProp<RootStackParamList, typeof routes.PROCESS_IMAGE_SCREEN>;
export type GroupsNavigationProps = DrawerScreenProps<RootStackParamList, typeof routes.GROUPS_SCREEN>;
export type FriendsScreenNavigationProps = DrawerScreenProps<RootStackParamList, typeof routes.FRIENDS_SCREEN>;
export type SettingsScreenNavigationProps = DrawerScreenProps<RootStackParamList, typeof routes.SETTINGS_SCREEN>;

export const Navigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen name={routes.HOME_SCREEN} component={HomeScreen} />
    <Drawer.Screen name={routes.SELECT_SCREEN} component={SelectImageScreen} />
    <Drawer.Screen name={routes.PROCESS_IMAGE_SCREEN} component={ProcessImageScreen} options={{drawerItemStyle: {display: "none"}}} />
    <Drawer.Screen name={routes.GROUPS_SCREEN} component={GroupsScreen} />
    <Drawer.Screen name={routes.SETTINGS_SCREEN} component={SettingsScreen} />
  </Drawer.Navigator>
);