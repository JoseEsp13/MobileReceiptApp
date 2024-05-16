import { Pressable, StyleSheet, Text, View } from "react-native";
import routes, { ILogoutStackScreenProps } from "../routes";
import useAppContext from "../components/hooks/useAppContext";

export default function LogoutScreen(props: ILogoutStackScreenProps) {

  const ctx = useAppContext()

  const handleLogout = () => {
    ctx.logout();
  }

  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      {ctx.authenticated ?
        <View style={styles.buttonView}>
          <Pressable style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>LOGOUT</Text>
          </Pressable>
        </View>
      :
        <View style={styles.buttonView}>
          <Text style={{textAlign: "center"}}>You have been successfully logged out</Text>
          <Pressable style={styles.button} onPress={() => props.navigation.navigate(routes.LOGIN_SCREEN)}>
            <Text style={styles.buttonText}>Go back to login</Text>
          </Pressable>
        </View>
        
      }
    </View>
  )
}

const styles = StyleSheet.create({
  button : {
    height : 45,
    borderColor : "gray",
    borderWidth  : 1,
    borderRadius : 5,
    alignItems : "center",
    justifyContent : "center",
    marginTop: 25
  },
  buttonText : {
    fontSize: 18,
    fontWeight : "bold"
  }, 
  buttonView :{
    width :"100%",
    paddingHorizontal : 50,
    display: "flex",
    justifyContent: "center",
  }
})