import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useAppContext from "../components/hooks/useAppContext";
import { useMemo, useState } from "react";
import { IGroup } from "../components/state/IFirebaseDocument";



export default function SplitScreen() {

  const ctx = useAppContext();
  const [groupSelected, setGroupSelected] = useState<IGroup>();

  const mapPoints = useMemo(() => {
    if (groupSelected !== undefined && groupSelected.contacts.length > 0) {
      const numContacts = groupSelected.contacts.length;
      const topContacts = (numContacts / 2) + (numContacts % 2);
      const bottomContacts = numContacts / 2;
      
      /*let angle = 
      if (numContacts == 1) {
        angle = 
      }
      const angle = (2 * Math.PI)/(numContacts + 2)
      console.log(angle)*/
    }
  }, [groupSelected])

  return (
    <View style={styles.container}>
      <View style={styles.containerLetters}>
        <View style={styles.container}>

        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backgroundImage: {
    resizeMode: 'cover',
    height: '100%',
    width: '100%'
  },
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
    bottom: 35,
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
  }
});