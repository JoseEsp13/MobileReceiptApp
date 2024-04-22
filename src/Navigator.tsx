import React from 'react';
import * as routes from './routes';
import {SelectImageScreen} from './screens/SelectImageScreen';
import {RouteProp} from '@react-navigation/native';
import { createDrawerNavigator, DrawerNavigationProp, DrawerScreenProps } from '@react-navigation/drawer';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import DefineGroupsScreen from './screens/DefineGroupsScreen';
import { ProcessImageScreen } from './screens/ProcessImageScreen';


type RootStackParamList = {
  [routes.HOME_SCREEN]: undefined,
  [routes.SELECT_SCREEN]: undefined;
  [routes.PROCESS_IMAGE_SCREEN]: {
    uri: string;
  };
  [routes.DEFINE_GROUPS_SCREEN]: undefined
  [routes.SETTINGS_SCREEN]: undefined
};

const Drawer = createDrawerNavigator<RootStackParamList>();

export type HomeScreenNavigationProps = DrawerScreenProps<RootStackParamList, typeof routes.HOME_SCREEN>;
export type SelectScreenNavigationProps = DrawerScreenProps<RootStackParamList, typeof routes.SELECT_SCREEN>;
export type ProcessImageNavigationProps = DrawerScreenProps<RootStackParamList, typeof routes.PROCESS_IMAGE_SCREEN>;
export type ProcessImageRouteProps = RouteProp<RootStackParamList, typeof routes.PROCESS_IMAGE_SCREEN>;
export type DefineGroupsNavigationProps = DrawerScreenProps<RootStackParamList, typeof routes.DEFINE_GROUPS_SCREEN>;
export type SettingsScreenNavigationProps = DrawerScreenProps<RootStackParamList, typeof routes.SETTINGS_SCREEN>;

export const Navigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen name={routes.HOME_SCREEN} component={HomeScreen} />
    <Drawer.Screen name={routes.SELECT_SCREEN} component={SelectImageScreen} />
    <Drawer.Screen name={routes.PROCESS_IMAGE_SCREEN} component={ProcessImageScreen} options={{drawerItemStyle: {display: "none"}}} />
    <Drawer.Screen name={routes.DEFINE_GROUPS_SCREEN} component={DefineGroupsScreen} />
    <Drawer.Screen name={routes.SETTINGS_SCREEN} component={SettingsScreen} />
  </Drawer.Navigator>
);