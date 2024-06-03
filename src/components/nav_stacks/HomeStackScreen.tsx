import { createStackNavigator } from "@react-navigation/stack";
import routes from "../../routes";
import HomeScreen from "../../screens/HomeScreen";
import { SelectImageScreen } from "../../screens/SelectImageScreen";
import { ProcessImageScreen } from "../../screens/ProcessImageScreen";
import LogoutScreen from "../../screens/LogoutScreen";
import SplitScreen from "../../screens/SplitScreen";

export type IHomeStackParamList = {
  [routes.HOME_SCREEN]: undefined,
  [routes.SELECT_SCREEN]: undefined,
  [routes.PROCESS_IMAGE_SCREEN]: {uri: string;},
  [routes.LOGOUT_SCREEN]: undefined,
  [routes.SPLIT_SCREEN]: undefined
}

const HomeStack = createStackNavigator<IHomeStackParamList>();

export default function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name={routes.HOME_SCREEN} component={HomeScreen} />
      <HomeStack.Screen name={routes.SELECT_SCREEN} component={SelectImageScreen} />
      <HomeStack.Screen name={routes.PROCESS_IMAGE_SCREEN} component={ProcessImageScreen} />
      <HomeStack.Screen name={routes.LOGOUT_SCREEN} component={LogoutScreen} />
      <HomeStack.Screen name={routes.SPLIT_SCREEN} component={SplitScreen} />
    </HomeStack.Navigator>
  );
}