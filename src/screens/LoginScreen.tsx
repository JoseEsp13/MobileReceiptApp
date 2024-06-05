import React, { useState } from 'react'
import { Alert, Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import logo from "../assets/logo.png"
import routes, { ILoginStackScreenProps } from '../routes'
import useAppContext from '../components/hooks/useAppContext';
import useIsDarkColorTheme from '../components/hooks/useIsDarkColorTheme';


export default function LoginScreen(props: ILoginStackScreenProps) {

  const ctx = useAppContext();
  const isDark = useIsDarkColorTheme();
  const [email, setEmail] =  useState("");
  const [password, setPassword] =  useState("");

  const handleLoginClick = () => {
    ctx.login(email, password);
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: isDark ? "black" : "white"}]}>
      <Image source={logo} style={styles.image} resizeMode='contain' />
      <Text style={[styles.title, {color: isDark ? "#eeeeee" : "#424242"}]}>Awesome Receipt App</Text>

      <View style={{backgroundColor: isDark ? "#212121" : "white", paddingTop: 20, paddingBottom: 20, paddingHorizontal: 15, borderRadius: 15, marginHorizontal: 20}}>
        <View>
          <TextInput
            style={[styles.input, {borderColor: "#424242", color: isDark ? "#eeeeee" : "#424242"}]}
            placeholder='EMAIL'
            placeholderTextColor={isDark ? "#eeeeee" : "#424242"}
            value={email} 
            onChangeText={setEmail} 
            autoCorrect={false}
            autoCapitalize='none'
            inputMode="email"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
        </View>
        <View>
          <TextInput
            style={[styles.input, {borderColor: "#424242", color: isDark ? "#eeeeee" : "#424242"}]}
            placeholder='PASSWORD'
            placeholderTextColor={isDark ? "#eeeeee" : "#424242"} 
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
              <Text style={[styles.forgetText, {color: isDark ? "#eeeeee" : "#424242"}]}>Forgot Password?</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.buttonView}>
        <Pressable style={styles.button} onPress={handleLoginClick}>
          <Text style={[styles.buttonText, {color: isDark ? "#eeeeee" : "#424242"}]}>LOGIN</Text>
        </Pressable>
      </View>

      <View style={styles.footerText}>
        <Text style={{marginRight: 5, color: isDark ? "#eeeeee" : "#424242"}}>Don't Have Account?</Text>
        <Pressable>
          <Text style={{color: isDark ? "#eeeeee" : "#424242"}} onPress={() => props.navigation.navigate(routes.SIGNUP_SCREEN)}>Sign Up</Text>
        </Pressable> 
      </View>
      
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container : {
    alignItems : "center",
    paddingTop: 70,
    flex: 1
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
    paddingVertical : 30
  },
  input : {
    height : 60,
    borderWidth : 1,
    borderRadius: 7,
    marginBottom: 15,
    padding: 10,
    paddingLeft: 20
  },
  rememberView : {
    width : "100%",
    paddingHorizontal : 20,
    justifyContent: "flex-end",
    alignItems : "center",
    flexDirection : "row",
    marginTop: 5
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
    marginTop: 25
  }
})