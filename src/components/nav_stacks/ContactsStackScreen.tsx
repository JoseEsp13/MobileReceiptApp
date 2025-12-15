import { createStackNavigator } from "@react-navigation/stack";
import routes from "../../routes";
import ContactsScreen from "../../screens/ContactsScreen";
import CreateContactScreen from "../../screens/CreateContactScreen";
import { IContact } from "../state/IFirebaseDocument";
import EditContactScreen from "../../screens/EditContactScreen";


export type IContactsStackScreenParamList = {
  [routes.CONTACTS_SCREEN]: undefined,
  [routes.CREATE_CONTACT_SCREEN]: undefined,
  [routes.EDIT_CONTACT_SCREEN]: {contact: IContact}
}

const ContactsStack = createStackNavigator<IContactsStackScreenParamList>();

export default function ContactsStackScreen() {
  return (
    <ContactsStack.Navigator>
      <ContactsStack.Screen name={routes.CONTACTS_SCREEN} component={ContactsScreen} />
      <ContactsStack.Screen name={routes.CREATE_CONTACT_SCREEN} component={CreateContactScreen} />
      <ContactsStack.Screen name={routes.EDIT_CONTACT_SCREEN} component={EditContactScreen} />
    </ContactsStack.Navigator>
  );
}