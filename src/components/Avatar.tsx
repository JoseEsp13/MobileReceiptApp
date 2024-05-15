import { Image, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { IContact } from "./state/IFirebaseDocument";


interface IAvatarProps {
  contact: IContact,
  viewStyle?: StyleProp<ViewStyle>,
  textStyle?: StyleProp<TextStyle>
}

export default function Avatar(props: IAvatarProps) {

  let initial = "?";
  if (props.contact.name.length > 0) {
    initial = props.contact.name[0]
  }


  return (
    <View style={props.viewStyle}>
      <Text style={props.textStyle}>{initial}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 10,
    width: 10,
    borderRadius: 25
  },
  text: {

  }
})