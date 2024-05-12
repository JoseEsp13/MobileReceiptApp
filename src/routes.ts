import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { RouteProp } from "@react-navigation/native";

/**
 * routes.ts
 * 
 * Route names
 */

// Defines what parameters gets sent to a screen route
export type IRootParamList = {
  [routes.HOME_SCREEN]: undefined,
  [routes.SELECT_SCREEN]: undefined,
  [routes.PROCESS_IMAGE_SCREEN]: {uri: string;},
  [routes.GROUPS_SCREEN]: undefined,
  [routes.CONTACTS_SCREEN]: undefined,
  [routes.SETTINGS_SCREEN]: undefined,
  [routes.LOGIN_SCREEN]: undefined,
  [routes.LOGOUT_SCREEN]: undefined,
  [routes.SIGNUP_SCREEN]: undefined
};

// Drawer
// Adds additional methods to the "prop" variables of each screen, such as navigate()
export type IHomeScreenDrawerProps = DrawerScreenProps<IRootParamList, typeof routes.HOME_SCREEN>;
export type ISelectScreenDrawerProps = DrawerScreenProps<IRootParamList, typeof routes.SELECT_SCREEN>;
export type IProcessImageDrawerProps = DrawerScreenProps<IRootParamList, typeof routes.PROCESS_IMAGE_SCREEN>;
export type IGroupsDrawerProps = DrawerScreenProps<IRootParamList, typeof routes.GROUPS_SCREEN>;
export type IContactsScreenDrawerProps = DrawerScreenProps<IRootParamList, typeof routes.CONTACTS_SCREEN>;
export type ISettingsScreenDrawerProps = DrawerScreenProps<IRootParamList, typeof routes.SETTINGS_SCREEN>;
export type ILoginScreenDrawerProps = DrawerScreenProps<IRootParamList, typeof routes.LOGIN_SCREEN>;
export type ILogoutScreenDrawerProps = DrawerScreenProps<IRootParamList, typeof routes.LOGOUT_SCREEN>;
export type ISignUpScreenDrawerProps = DrawerScreenProps<IRootParamList, typeof routes.SIGNUP_SCREEN>;

// Bottom Tabs
// Adds additional methods to the "prop" variables of each screen, such as navigate()
export type IHomeScreenTabProps = BottomTabScreenProps<IRootParamList, typeof routes.HOME_SCREEN>;
export type ISelectScreenTabProps = BottomTabScreenProps<IRootParamList, typeof routes.SELECT_SCREEN>;
export type IProcessImageTabProps = BottomTabScreenProps<IRootParamList, typeof routes.PROCESS_IMAGE_SCREEN>;
export type IGroupsTabProps = BottomTabScreenProps<IRootParamList, typeof routes.GROUPS_SCREEN>;
export type IContactsScreenTabProps = BottomTabScreenProps<IRootParamList, typeof routes.CONTACTS_SCREEN>;
export type ISettingsScreenTabProps = BottomTabScreenProps<IRootParamList, typeof routes.SETTINGS_SCREEN>;
export type ILoginScreenTabProps = BottomTabScreenProps<IRootParamList, typeof routes.LOGIN_SCREEN>;
export type ILogoutScreenTabProps = BottomTabScreenProps<IRootParamList, typeof routes.LOGOUT_SCREEN>;
export type ISignUpScreenTabProps = BottomTabScreenProps<IRootParamList, typeof routes.SIGNUP_SCREEN>;

// Adds additional methods to the prop type. This one is combined with another type on the Process Image screen
export type IProcessImageRouteProps = RouteProp<IRootParamList, typeof routes.PROCESS_IMAGE_SCREEN>;


// Routes
export interface IRoutes {
  HOME_SCREEN: "Home",
  SELECT_SCREEN: "Select Image",
  PROCESS_IMAGE_SCREEN: "Process Image",
  SETTINGS_SCREEN: "Settings",
  GROUPS_SCREEN: "Groups",
  CONTACTS_SCREEN: "Contacts",
  LOGIN_SCREEN: "Login",
  LOGOUT_SCREEN: "Logout",
  SIGNUP_SCREEN: "Sign Up",
}

const routes: IRoutes = {
  HOME_SCREEN: "Home",
  SELECT_SCREEN: "Select Image",
  PROCESS_IMAGE_SCREEN: "Process Image",
  SETTINGS_SCREEN: "Settings",
  GROUPS_SCREEN: "Groups",
  CONTACTS_SCREEN: "Contacts",
  LOGIN_SCREEN: "Login",
  LOGOUT_SCREEN: "Logout",
  SIGNUP_SCREEN: "Sign Up"
}

export default routes;