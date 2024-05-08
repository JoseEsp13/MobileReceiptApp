import { useEffect } from "react";
import { Text, View } from "react-native";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

export default function LogoutScreen() {

  useEffect(() => {
    auth().signOut();
  }, []);

  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <Text>You have been successfully logged out</Text>
    </View>
  )
}