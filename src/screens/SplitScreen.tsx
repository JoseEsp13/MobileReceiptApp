import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedGestureHandler } from 'react-native-reanimated'
import useAppContext from "../components/hooks/useAppContext";
import { useMemo, useState } from "react";
import { IContact, IGroup } from "../components/state/IFirebaseDocument";
import Avatar from "../components/Avatar";
import { useSharedValue } from 'react-native-reanimated';

interface IOption {
  contact: IContact,
  x: number,
  y: number
}

const amplitude = 110;
const offsetX = -25;
const offsetY = -25;

export default function SplitScreen() {

  const ctx = useAppContext();
  const [group] = useState<IGroup>(ctx.user.groups[0])

  // Add one for save button
  const contacts = group.contacts;
  if (contacts.length === 0) {
    console.error("No contacts");
    return;
  }
  const numOptions = contacts.length;
  const baseAngle = (2 * Math.PI)/(numOptions);

  const options: IOption[] = contacts.map((contact, i) => {
    const angle = baseAngle * i;
    const newOption: IOption = {
      contact,
      x: Math.cos(angle) * amplitude,
      y: Math.sin(angle) * amplitude
    };
    return newOption
  })

  return (
    <View style={{flex: 1}}>
      <View style={styles.containerLetters}>
        <View style={{position: "relative", height: "100%", width: "100%", justifyContent: "center", alignItems: "center"}}>
          <View style={{height: 5, width: 5, backgroundColor: "red"}}>
            {options.map((option, i) => (
              <Animated.View key={i} style={{width: 50, height: 50, position: "absolute", top: option.y + offsetY, left: option.x + offsetX, justifyContent: "center", alignItems: "center"}}>
                <View style={styles.avatarContainer}>
                  <Avatar name={option.contact.name} bgColor={option.contact.bgColor} color={option.contact.color} viewStyle={styles.avatarView} textStyle={styles.avatarText}/>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  containerLetters: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 160,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      height: 4,
      width: 0
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    width: 280,
    bottom: 30,
    height: 280,
  },
  containerLetter: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    position: 'absolute',
    width: 40
  },
  letter: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  avatarView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "green",
  },
  avatarText: {
    fontSize: 20,
    color: "white",
    textTransform: "uppercase"
  },
  avatarContainer: {
    height: 58,
    width: 58,
    padding: 5,
  },
});