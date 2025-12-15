import { Image, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { IContact } from "./state/IFirebaseDocument";
import Icon from "react-native-vector-icons/Ionicons";

interface IAvatarProps {
  name: string,
  bgColor: string,
  color: string,
  viewStyle?: StyleProp<ViewStyle>,
  textStyle?: StyleProp<TextStyle>,
}

export default function Avatar(props: IAvatarProps) {

  const initial = props.name.length > 0 ? props.name[0] :"?";

  return (
    <View style={[props.viewStyle, {backgroundColor: props.bgColor}]}>
      <Text style={[props.textStyle, {color: props.color}]}>{initial}</Text>
    </View>
  )
}
