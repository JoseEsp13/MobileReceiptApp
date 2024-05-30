import { createStackNavigator } from "@react-navigation/stack";
import routes from "../../routes";
import GroupsScreen from "../../screens/GroupsScreen";
import CreateGroupScreen from "../../screens/CreateGroupScreen";
import EditGroupScreen from "../../screens/EditGroupScreen";
import { IGroup } from "../state/IFirebaseDocument";


export type IGroupsStackScreenParamList = {
  [routes.GROUPS_SCREEN]: undefined,
  [routes.CREATE_GROUP_SCREEN]: undefined,
  [routes.EDIT_GROUP_SCREEN]: {group: IGroup}
}

const GroupsStack = createStackNavigator<IGroupsStackScreenParamList>();

export default function GroupsStackScreen() {
  return (
    <GroupsStack.Navigator>
      <GroupsStack.Screen name={routes.GROUPS_SCREEN} component={GroupsScreen} />
      <GroupsStack.Screen name={routes.CREATE_GROUP_SCREEN} component={CreateGroupScreen} />
      <GroupsStack.Screen name={routes.EDIT_GROUP_SCREEN} component={EditGroupScreen} />
    </GroupsStack.Navigator>
  );
}
