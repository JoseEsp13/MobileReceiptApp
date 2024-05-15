import { createStackNavigator } from "@react-navigation/stack";
import routes from "../../routes";
import GroupsScreen from "../../screens/GroupsScreen";


type IGroupsStackScreenParamList = {
  [routes.GROUPS_SCREEN]: undefined,
}

const GroupsStack = createStackNavigator<IGroupsStackScreenParamList>();

export default function GroupsStackScreen() {
  return (
    <GroupsStack.Navigator>
      <GroupsStack.Screen name={routes.GROUPS_SCREEN} component={GroupsScreen} />
    </GroupsStack.Navigator>
  );
}
