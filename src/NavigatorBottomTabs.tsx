
// Not being used at the moment

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import useAppContext from './components/hooks/useAppContext';
import routes, { stackRoutes } from './routes';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import LogoutScreen from './screens/LogoutScreen';
import HomeScreen from './screens/HomeScreen';
import { SelectImageScreen } from './screens/SelectImageScreen';
import GroupsScreen from './screens/GroupsScreen';
import SettingsScreen from './screens/SettingsScreen';
import { ProcessImageScreen } from './screens/ProcessImageScreen';
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack';
import ContactsScreen from './screens/ContactsScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeStackScreen from './components/nav_stacks/HomeStackScreen';
import GroupsStackScreen from './components/nav_stacks/GroupsStackScreen';
import ContactsStackScreen from './components/nav_stacks/ContactsStackScreen';


export type IBottomTabsParamList = {
  [stackRoutes.HOME_STACK]: undefined,
  [stackRoutes.GROUPS_STACK]: undefined,
  [stackRoutes.CONTACTS_STACK]: undefined
};

export type ILoginStackParamList = {
  [routes.LOGIN_SCREEN]: undefined,
  [routes.SIGNUP_SCREEN]: undefined,
  [routes.LOGOUT_SCREEN]: undefined
}

const Tab = createBottomTabNavigator<IBottomTabsParamList>();
const LoginStack = createStackNavigator<ILoginStackParamList>();

export default function NavigatorBottomTabs() {

  const ctx = useAppContext();

  return (
    <>
      {ctx.authenticated == null ? (
          <LoginStack.Navigator>
            <LoginStack.Screen name={routes.LOGIN_SCREEN} component={LoginScreen} />
            <LoginStack.Screen name={routes.SIGNUP_SCREEN} component={SignUpScreen} />
            <LoginStack.Screen name={routes.LOGOUT_SCREEN} component={LogoutScreen} />
          </LoginStack.Navigator>
        ) : 
        (
          <Tab.Navigator screenOptions={({route}) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {

              // Bottom tab icons
              let iconName = "question-mark";
  
              if (route.name === stackRoutes.HOME_STACK) {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === stackRoutes.GROUPS_STACK) {
                iconName = focused ? 'people' : 'people-outline';
              } else if (route.name === stackRoutes.CONTACTS_STACK) {
                iconName = focused ? 'person' : 'person-outline';
              }
  
              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'steelblue',
            tabBarInactiveTintColor: 'gray',
          })}>
            <Tab.Screen name={stackRoutes.HOME_STACK} component={HomeStackScreen} />
            <Tab.Screen name={stackRoutes.GROUPS_STACK} component={GroupsStackScreen} />
            <Tab.Screen name={stackRoutes.CONTACTS_STACK} component={ContactsStackScreen} />
          </Tab.Navigator>
        )}
    </>
  )
}