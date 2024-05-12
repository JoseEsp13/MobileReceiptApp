import { useEffect } from "react";
import { Text, View } from "react-native";
import auth from '@react-native-firebase/auth';
import { ILogoutScreenDrawerProps } from "../routes";

export default function LogoutScreen(props: ILogoutScreenDrawerProps) {

  useEffect(() => {
    auth().signOut();
  }, []);

  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <Text>You have been successfully logged out</Text>
    </View>
  )
}