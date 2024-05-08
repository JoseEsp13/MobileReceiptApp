import React, { useState } from 'react'
import { Alert, Button, Image, Pressable, SafeAreaView, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import logo from "../assets/logo.png"
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import * as routes from '../routes'
import { useNavigation } from '@react-navigation/native';
import { LoginScreenNavigationProps, RootDrawerParamList } from '../Navigator';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import useAppNavigation from '../components/hooks/useAppNavigation';


export default function LoginScreen(props: LoginScreenNavigationProps) {

  const [click, setClick] = useState(false);
  const [username, setUsername] =  useState("");
  const [password, setPassword] =  useState("");

  const handleLoginClick = () => {
    auth()
      .signInWithEmailAndPassword(username, password)
      .then(() => {
        console.log('User signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }
    
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
    
        console.error(error);
      })
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={logo} style={styles.image} resizeMode='contain' />
      <Text style={styles.title}>Awesome Receipt App</Text>
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
      <View style={styles.rememberView}>
        <View style={styles.switch}>
          <Switch value={click} onValueChange={setClick} trackColor={{true : "green" , false : "gray"}} />
          <Text style={styles.rememberText}>Remember Me</Text>
        </View>
        <View>
          <Pressable onPress={() => Alert.alert("Forget Password!")}>
            <Text style={styles.forgetText}>Forgot Password?</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.buttonView}>
        <Pressable style={styles.button} onPress={handleLoginClick}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </Pressable>
      </View>

      <Text style={styles.footerText}>Don't Have Account?
        <Pressable>
          <Text style={styles.signup} onPress={() => props.navigation.navigate(routes.SIGNUP_SCREEN)}>  Sign Up</Text>
        </Pressable>
      </Text>  
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
    marginTop: 15,
    color : "gray",
  },
  signup : {
    fontSize : 13
  }
})