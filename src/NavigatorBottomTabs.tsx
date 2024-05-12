
// Not being used at the moment

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import useAppContext from './components/hooks/useAppContext';
import routes, { IRootParamList } from './routes';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import LogoutScreen from './screens/LogoutScreen';
import HomeScreen from './screens/HomeScreen';
import { SelectImageScreen } from './screens/SelectImageScreen';
import GroupsScreen from './screens/GroupsScreen';
import SettingsScreen from './screens/SettingsScreen';
import { ProcessImageScreen } from './screens/ProcessImageScreen';


const Tab = createBottomTabNavigator<IRootParamList>();

export default function NavigatorBottomTabs() {

  const ctx = useAppContext();

  return (
    <Tab.Navigator>
      {ctx.authenticated == null ? (
          <>
            <Tab.Screen name={routes.LOGIN_SCREEN} component={LoginScreen} />
            <Tab.Screen name={routes.SIGNUP_SCREEN} component={SignUpScreen} />
            
            <Tab.Screen name={routes.LOGOUT_SCREEN} component={LogoutScreen} />
          </>
        ) : 
        (
          <>
            <Tab.Screen name={routes.HOME_SCREEN} component={HomeScreen} />
            <Tab.Screen name={routes.SELECT_SCREEN} component={SelectImageScreen} />
            <Tab.Screen name={routes.GROUPS_SCREEN} component={GroupsScreen} />
            <Tab.Screen name={routes.SETTINGS_SCREEN} component={SettingsScreen} />
            <Tab.Screen name={routes.LOGOUT_SCREEN} component={LogoutScreen} />

            <Tab.Screen name={routes.PROCESS_IMAGE_SCREEN} component={ProcessImageScreen} />
          </>
        )}
    </Tab.Navigator>
  )
}