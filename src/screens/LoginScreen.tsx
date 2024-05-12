import React, { useState } from 'react'
import { Alert, Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import logo from "../assets/logo.png"
import routes, { ILoginScreenDrawerProps } from '../routes'
import useAppContext from '../components/hooks/useAppContext';


export default function LoginScreen(props: ILoginScreenDrawerProps) {

  const ctx = useAppContext();
  const [email, setEmail] =  useState("");
  const [password, setPassword] =  useState("");

  const handleLoginClick = () => {
    ctx.login(email, password);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={logo} style={styles.image} resizeMode='contain' />
      <Text style={styles.title}>Awesome Receipt App</Text>
      <View style={styles.inputView}>
        <TextInput 
          style={styles.input} 
          placeholder='EMAIL' 
          value={email} 
          onChangeText={setEmail} 
          autoCorrect={false}
          autoCapitalize='none'
          inputMode="email"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <TextInput 
          style={styles.input} 
          placeholder='PASSWORD' 
          secureTextEntry 
          value={password} 
          onChangeText={setPassword} 
          autoCorrect={false}
          autoCapitalize='none'
          textContentType="newPassword"
        />
      </View>
      <View style={styles.rememberView}>
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

      <View style={styles.footerText}>
        <Text style={{marginRight: 5}}>Don't Have Account?</Text>
        <Pressable>
          <Text onPress={() => props.navigation.navigate(routes.SIGNUP_SCREEN)}>Sign Up</Text>
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
    justifyContent: "flex-end",
    alignItems : "center",
    flexDirection : "row",
    marginBottom : 8,
    marginTop: 10
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
    paddingHorizontal : 50,
    marginTop: 30
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
    display: "flex",
    flexDirection: "row",
    marginTop: 25,  
    color : "gray",
  }
})