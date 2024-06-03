import { createStackNavigator } from "@react-navigation/stack";
import routes from "../../routes";
import GroupsScreen from "../../screens/GroupsScreen";
import CreateGroupScreen from "../../screens/CreateGroupScreen";
import EditGroupScreen from "../../screens/EditGroupScreen";
import { IGroup } from "../state/IFirebaseDocument";
import GroupContactManagerScreen from "../../screens/GroupContactManagerScreen";


export type IGroupsStackScreenParamList = {
  [routes.GROUPS_SCREEN]: undefined,
  [routes.CREATE_GROUP_SCREEN]: {group: IGroup} | undefined,
  [routes.EDIT_GROUP_SCREEN]: {group: IGroup},
  [routes.GROUP_CONTACT_MANAGER_SCREEN]: {group: IGroup, returnScreen: typeof routes.EDIT_GROUP_SCREEN | typeof routes.CREATE_GROUP_SCREEN}
}

const GroupsStack = createStackNavigator<IGroupsStackScreenParamList>();

export default function GroupsStackScreen() {
  return (
    <GroupsStack.Navigator>
      <GroupsStack.Screen name={routes.GROUPS_SCREEN} component={GroupsScreen} />
      <GroupsStack.Screen name={routes.CREATE_GROUP_SCREEN} component={CreateGroupScreen} />
      <GroupsStack.Screen name={routes.EDIT_GROUP_SCREEN} component={EditGroupScreen} />
      <GroupsStack.Screen name={routes.GROUP_CONTACT_MANAGER_SCREEN} component={GroupContactManagerScreen} />
    </GroupsStack.Navigator>
  );
}
