import { Image, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { IContact } from "./state/IFirebaseDocument";


interface IAvatarProps {
  contact: IContact,
  viewStyle?: StyleProp<ViewStyle>,
  textStyle?: StyleProp<TextStyle>
}

export default function Avatar(props: IAvatarProps) {

  const initial = props.contact.name.length > 0 ? props.contact.name[0] :"?";

  return (
    <View style={[props.viewStyle, {backgroundColor: props.contact.bgColor}]}>
      <Text style={[props.textStyle, {color: props.contact.color}]}>{initial}</Text>
    </View>
  )
}
