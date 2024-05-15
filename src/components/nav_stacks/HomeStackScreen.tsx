import { createStackNavigator } from "@react-navigation/stack";
import routes from "../../routes";
import HomeScreen from "../../screens/HomeScreen";
import { SelectImageScreen } from "../../screens/SelectImageScreen";
import { ProcessImageScreen } from "../../screens/ProcessImageScreen";

export type IHomeStackParamList = {
  [routes.HOME_SCREEN]: undefined,
  [routes.SELECT_SCREEN]: undefined,
  [routes.PROCESS_IMAGE_SCREEN]: {uri: string;},
}

const HomeStack = createStackNavigator<IHomeStackParamList>();

export default function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name={routes.HOME_SCREEN} component={HomeScreen} />
      <HomeStack.Screen name={routes.SELECT_SCREEN} component={SelectImageScreen} />
      <HomeStack.Screen name={routes.PROCESS_IMAGE_SCREEN} component={ProcessImageScreen} />
    </HomeStack.Navigator>
  );
}