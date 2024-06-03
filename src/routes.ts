/**
 * routes.ts
 * 
 * Defines the routes for the app
 */
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { RouteProp } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { IBottomTabsParamList, ILoginStackParamList } from "./NavigatorBottomTabs";
import { IHomeStackParamList } from "./components/nav_stacks/HomeStackScreen";
import { IContact, IGroup } from "./components/state/IFirebaseDocument";
import { IContactsStackScreenParamList } from "./components/nav_stacks/ContactsStackScreen";
import { IGroupsStackScreenParamList } from "./components/nav_stacks/GroupsStackScreen";

// Defines what parameters gets sent to a screen route
export type IRootParamList = {
  [routes.HOME_SCREEN]: undefined,
  [routes.SELECT_SCREEN]: undefined,
  [routes.PROCESS_IMAGE_SCREEN]: {uri: string;},
  [routes.GROUPS_SCREEN]: undefined,
  [routes.CONTACTS_SCREEN]: undefined,
  [routes.CREATE_CONTACT_SCREEN]: undefined,
  [routes.SETTINGS_SCREEN]: undefined,
  [routes.LOGIN_SCREEN]: undefined,
  [routes.LOGOUT_SCREEN]: undefined,
  [routes.SIGNUP_SCREEN]: undefined,
  [routes.EDIT_CONTACT_SCREEN]: {contact: IContact;}
  [routes.SPLIT_SCREEN]: undefined,
  [routes.EDIT_GROUP_SCREEN]: {group: IGroup}
  [routes.GROUP_CONTACT_MANAGER_SCREEN]: {group: IGroup, returnScreen: typeof routes.CREATE_GROUP_SCREEN | typeof routes.EDIT_GROUP_SCREEN}
};


// Routes
export interface IRoutes {
  HOME_SCREEN: "Home ",
  SELECT_SCREEN: "Select Image",
  PROCESS_IMAGE_SCREEN: "Process Image",
  SETTINGS_SCREEN: "Settings",
  GROUPS_SCREEN: "Groups ",
  EDIT_GROUP_SCREEN: "Edit Group",
  CREATE_GROUP_SCREEN: "Create Group",
  CONTACTS_SCREEN: "Contacts ",
  CREATE_CONTACT_SCREEN: "Create Contact",
  LOGIN_SCREEN: "Login",
  LOGOUT_SCREEN: "Logout",
  SIGNUP_SCREEN: "Sign Up",
  EDIT_CONTACT_SCREEN: "Edit Contact",
  GROUP_CONTACT_MANAGER_SCREEN: "Attach Contacts to Group"
  SPLIT_SCREEN: "Split"
}

const routes: IRoutes = {
  HOME_SCREEN: "Home ",
  SELECT_SCREEN: "Select Image",
  PROCESS_IMAGE_SCREEN: "Process Image",
  SETTINGS_SCREEN: "Settings",
  GROUPS_SCREEN: "Groups ",
  EDIT_GROUP_SCREEN: "Edit Group",
  CREATE_GROUP_SCREEN: "Create Group",
  CONTACTS_SCREEN: "Contacts ",
  CREATE_CONTACT_SCREEN: "Create Contact",
  LOGIN_SCREEN: "Login",
  LOGOUT_SCREEN: "Logout",
  SIGNUP_SCREEN: "Sign Up",
  EDIT_CONTACT_SCREEN: "Edit Contact",
  GROUP_CONTACT_MANAGER_SCREEN: "Attach Contacts to Group",
  SPLIT_SCREEN: "Split"
}

export interface IStackRoutes {
  HOME_STACK: "Home",
  CONTACTS_STACK: "Contacts",
  GROUPS_STACK: "Groups",
}

export const stackRoutes: IStackRoutes = {
  HOME_STACK: "Home",
  CONTACTS_STACK: "Contacts",
  GROUPS_STACK: "Groups",
}

// Drawer
// Adds additional methods to the "prop" variables of each screen, such as navigate()
//export type IHomeScreenDrawerProps = DrawerScreenProps<IRootParamList, typeof routes.HOME_SCREEN>;
//export type ISelectScreenDrawerProps = DrawerScreenProps<IRootParamList, typeof routes.SELECT_SCREEN>;
//export type IProcessImageDrawerProps = DrawerScreenProps<IRootParamList, typeof routes.PROCESS_IMAGE_SCREEN>;
//export type IGroupsDrawerProps = DrawerScreenProps<IRootParamList, typeof routes.GROUPS_SCREEN>;
//export type IContactsScreenDrawerProps = DrawerScreenProps<IRootParamList, typeof routes.CONTACTS_SCREEN>;
//export type ISettingsScreenDrawerProps = DrawerScreenProps<IRootParamList, typeof routes.SETTINGS_SCREEN>;
//export type ILoginScreenDrawerProps = DrawerScreenProps<IRootParamList, typeof routes.LOGIN_SCREEN>;
//export type ILogoutScreenDrawerProps = DrawerScreenProps<IRootParamList, typeof routes.LOGOUT_SCREEN>;
//export type ISignUpScreenDrawerProps = DrawerScreenProps<IRootParamList, typeof routes.SIGNUP_SCREEN>;

// Bottom Tabs
// Adds additional methods to the "prop" variables of each screen, such as navigate()
export type IHomeScreenTabProps = BottomTabScreenProps<IRootParamList, typeof routes.HOME_SCREEN>;
export type IGroupsTabProps = BottomTabScreenProps<IRootParamList, typeof routes.GROUPS_SCREEN>;
export type IContactsScreenTabProps = BottomTabScreenProps<IRootParamList, typeof routes.CONTACTS_SCREEN>;

export type ISelectScreenTabProps = BottomTabScreenProps<IRootParamList, typeof routes.SELECT_SCREEN>;
export type IProcessImageTabProps = BottomTabScreenProps<IRootParamList, typeof routes.PROCESS_IMAGE_SCREEN>;

export type ISettingsScreenTabProps = BottomTabScreenProps<IRootParamList, typeof routes.SETTINGS_SCREEN>;
export type ILoginScreenTabProps = BottomTabScreenProps<IRootParamList, typeof routes.LOGIN_SCREEN>;
export type ILogoutScreenTabProps = BottomTabScreenProps<IRootParamList, typeof routes.LOGOUT_SCREEN>;
export type ISignUpScreenTabProps = BottomTabScreenProps<IRootParamList, typeof routes.SIGNUP_SCREEN>;

export type ISignUpScreenStackProps = StackScreenProps<IRootParamList, typeof routes.SIGNUP_SCREEN>;

export type IProcessImageStackScreenProps = StackScreenProps<IRootParamList, typeof routes.PROCESS_IMAGE_SCREEN>;

export type ICreateContactScreenProps = StackScreenProps<IContactsStackScreenParamList, typeof routes.CREATE_CONTACT_SCREEN>;
export type IEditContactScreenProps = StackScreenProps<IContactsStackScreenParamList, typeof routes.EDIT_CONTACT_SCREEN>;

export type ICreateGroupScreenProps = StackScreenProps<IGroupsStackScreenParamList, typeof routes.CREATE_GROUP_SCREEN>;
export type IEditGroupScreenProps = StackScreenProps<IGroupsStackScreenParamList, typeof routes.EDIT_GROUP_SCREEN>;
export type IGroupScreenProps = StackScreenProps<IGroupsStackScreenParamList, typeof routes.GROUPS_SCREEN>;
export type IGroupContactManagerScreenProps = StackScreenProps<IGroupsStackScreenParamList, typeof routes.GROUP_CONTACT_MANAGER_SCREEN>;


export type ILoginStackScreenProps = StackScreenProps<ILoginStackParamList, typeof routes.LOGIN_SCREEN>;
export type ILogoutStackScreenProps = StackScreenProps<ILoginStackParamList, typeof routes.LOGOUT_SCREEN>;


// Adds additional methods to the prop type. This one is combined with another type on the Process Image screen
export type IProcessImageRouteProps = RouteProp<IRootParamList, typeof routes.PROCESS_IMAGE_SCREEN>;

export default routes;