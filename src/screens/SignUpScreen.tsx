import { useState } from "react";
import { Image, Pressable, SafeAreaView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

export default function SignUpScreen() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUpClick = () => {
    auth()
      .createUserWithEmailAndPassword(username, password)
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }
    
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
    
        console.error(error);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      <View style={styles.inputView}>
        <TextInput 
          style={styles.input} 
          placeholder='EMAIL OR USERNAME' 
          value={username} 
          onChangeText={setUsername} 
          autoCorrect={false}
          autoCapitalize='none' 
        />
        <TextInput 
          style={styles.input} 
          placeholder='PASSWORD' 
          secureTextEntry 
          value={password} 
          onChangeText={setPassword} 
          autoCorrect={false}
          autoCapitalize='none'
        />
      </View>

      <View style={styles.buttonView}>
        <Pressable style={styles.button} onPress={handleSignUpClick}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container : {
    alignItems : "center",
    paddingTop: 70,
  },
  image : {
    height : 160,
    width : 170
  },
  title : {
    fontSize : 24,
    fontWeight : "bold",
    textTransform : "uppercase",
    textAlign: "center",
    paddingVertical : 40,
  },
  inputView : {
    gap : 15,
    width : "100%",
    paddingHorizontal : 40,
    marginBottom  :5
  },
  input : {
    height : 50,
    paddingHorizontal : 20,
    borderWidth : 1,
    borderRadius: 7
  },
  rememberView : {
    width : "100%",
    paddingHorizontal : 50,
    justifyContent: "space-between",
    alignItems : "center",
    flexDirection : "row",
    marginBottom : 8
  },
  switch :{
    flexDirection : "row",
    gap : 1,
    justifyContent : "center",
    alignItems : "center"
    
  },
  rememberText : {
    fontSize: 13
  },
  forgetText : {
    fontSize : 11,
  },
  button : {
    height : 45,
    borderColor : "gray",
    borderWidth  : 1,
    borderRadius : 5,
    alignItems : "center",
    justifyContent : "center"
  },
  buttonText : {
    fontSize: 18,
    fontWeight : "bold"
  }, 
  buttonView :{
    width :"100%",
    paddingHorizontal : 50
  },
  optionsText : {
    textAlign : "center",
    paddingVertical : 10,
    color : "gray",
    fontSize : 13,
    marginBottom : 6
  },
  mediaIcons : {
    flexDirection : "row",
    gap : 15,
    alignItems: "center",
    justifyContent : "center",
    marginBottom : 23
  },
  icons : {
    width : 40,
    height: 40,
  },
  footerText : {
    textAlign: "center",
    color : "gray",
  },
  signup : {
    fontSize : 13
  }
})
