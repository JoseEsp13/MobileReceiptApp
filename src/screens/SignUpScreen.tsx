import { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import useAppContext from "../components/hooks/useAppContext";
import routes, { ISignUpScreenStackProps } from "../routes";

interface ISignUpErrors {
  name?: string,
  email?: string,
  password?: string,
}

export default function SignUpScreen(props: ISignUpScreenStackProps) {

  const ctx = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<ISignUpErrors>({});

  const handleSignUpClick = async() => {
    const hasErrors = errorCheck();
    if (hasErrors) {
      // TO DO: do something
      console.log(errors)
      return;
    } 

    try {
      await ctx.createAuthenticatedUserAsync(email, password, name);
    } catch (ex) {
      console.error(ex);
    }
  }

  const errorCheck = () => {
    setErrors({});
    let errors: ISignUpErrors = {}
    // TO DO: create regex tester for email
    if (!email) {
      errors.email = "Email required"
    }

    // TO DO: minimum length required for name?
    if (!name) {
      errors.name = "Name required"
    }
    
    // TO DO: password minimums?
    if (!password) {
      errors.password = "Password required"
    }

    setErrors(errors);
    return errors.email || errors.name || errors.password
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      <View style={styles.inputView}>
        <TextInput 
          style={styles.input} 
          placeholder='YOUR NAME' 
          value={name} 
          onChangeText={setName} 
          autoCorrect={false}
          autoCapitalize='none'
        />
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
      <View style={styles.buttonView}>
        <Pressable style={styles.button} onPress={handleSignUpClick}>
          <Text style={styles.buttonText}>CREATE</Text>
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
    marginTop: 30,
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
