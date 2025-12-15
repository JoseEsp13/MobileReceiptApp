import { Button, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from "react-native";
import useAppContext from "../components/hooks/useAppContext";
import { IContact } from "../components/state/IFirebaseDocument";
import { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { ICreateContactScreenProps } from "../routes";
import Avatar from "../components/Avatar";
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import ColorPicker, { Panel3, Swatches, OpacitySlider, colorKit, Preview, SaturationSlider } from 'reanimated-color-picker';
import type { returnedResults } from 'reanimated-color-picker';
import useIsDarkColorTheme from "../components/hooks/useIsDarkColorTheme";


export default function CreateContactScreen(props: ICreateContactScreenProps) {

  const ctx = useAppContext();
  const isDark = useIsDarkColorTheme();

  const [contact, setContact] = useState<IContact>({id: 0, name: "", email: "", phoneNumber: "", bgColor: isDark ? "#212121" : "white", color: "#9e9e9e"})
  const [showModal, setShowModal] = useState(false);

  const customSwatches = new Array(6).fill('#fff').map(() => colorKit.randomRgbColor().hex());

  const selectedColor = useSharedValue(customSwatches[0]);
  const backgroundColorStyle = useAnimatedStyle(() => ({ backgroundColor: selectedColor.value }));

  const handleSave = () => {
    if (contact.name && contact.email) {
      ctx.addContact(contact);
      props.navigation.goBack();
    } 
  }

  // Modal functions
  const onColorSelect = (color: returnedResults) => {
    'worklet';
    selectedColor.value = color.hex;
  };

  const handleModalSave = () => {
    const color = colorKit.isDark(selectedColor.value) ? "#fff" : "#1a1a1a";
    setContact(prevState => ({
      ...prevState,
      color: color,
      bgColor: selectedColor.value
    }))
    setShowModal(false);
  }
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView>
          <View style={{flexDirection: "row", justifyContent: "space-around", marginTop: 25}}>
            <View style={{width: 70, justifyContent: "center", alignItems: "center"}}>
              <TouchableOpacity onPress={() => setShowModal(true)} style={{backgroundColor: isDark ? "#212121" : "white", borderRadius: 50, width: 60, height: 60, justifyContent: "center", alignItems: "center"}}>
                <Icon name="color-palette" size={35} color="#ffa726"/>
              </TouchableOpacity>
            </View>
            <View style={{borderRadius: 100, backgroundColor: contact.bgColor, justifyContent: "center", alignItems: "center", height: 110, width: 110}}>
              {contact.name?.length > 0 ?
                <Avatar name={contact.name} bgColor={contact.bgColor} color={contact.color} viewStyle={styles.avatarView} textStyle={styles.avatarText}/>
                :
                <Icon name="person-add" size={65} color={contact.color}></Icon>
              }    
            </View>
            <View style={{width: 70, justifyContent: "center", alignItems: "center"}}>

            </View>
          </View>

          <View style={{marginTop: 30, backgroundColor: isDark ? "#212121" : "white", paddingTop: 15, paddingBottom: 30, paddingHorizontal: 10, borderRadius: 15, marginHorizontal: 10}}>
            <View style={{paddingLeft: 8}}>
              <Text style={{fontSize: 17, color: isDark? "white" :"#424242"}}>Contact info</Text>
            </View>

            <View style={{marginTop: 30, flexDirection: "row"}}>
              <View style={{justifyContent: "center", alignItems: "center", width: 40}}>
                <Icon name="person-outline" size={25}></Icon>
              </View>
              <View style={{flex: 1}}>
                <TextInput
                  placeholder="Name"
                  value={contact.name}
                  onChangeText={(s: string) => setContact(prevState => ({...prevState, name: s}))}
                  style={{borderWidth: 1, marginHorizontal: 5, padding: 10, paddingLeft: 15, marginRight: 15, borderRadius: 5}}
                />
              </View>
            </View>

            <View style={{marginTop: 25, flexDirection: "row"}}>
              <View style={{justifyContent: "center", alignItems: "center", width: 40}}>
                <Icon name="mail-outline" size={25}></Icon>
              </View>
              <View style={{flex: 1}}>
                <TextInput
                  placeholder="Email"
                  value={contact.email}
                  onChangeText={(s: string) => setContact(prevState => ({...prevState, email: s}))}
                  style={{borderWidth: 1, marginHorizontal: 5, padding: 10, paddingLeft: 15, marginRight: 15, borderRadius: 5}}
                />
              </View>
            </View>

            <View style={{marginTop: 25, flexDirection: "row"}}>
              <View style={{justifyContent: "center", alignItems: "center", width: 40}}>
                <Icon name="call-outline" size={25}></Icon>
              </View>
              <View style={{flex: 1}}>
                <TextInput
                  placeholder="Phone"
                  value={contact.phoneNumber}
                  onChangeText={(s: string) => setContact(prevState => ({...prevState, phoneNumber: s}))}
                  style={{borderWidth: 1, marginHorizontal: 5, padding: 10, paddingLeft: 15, marginRight: 15, borderRadius: 5}}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity style={[styles.floatingActionBtnContainer, {backgroundColor: isDark ? "#212121" : "white"}]} onPress={handleSave}>
          <View style={styles.floatingActionBtn}>
            <Icon name="save" size={38} color="green"/>
          </View>
        </TouchableOpacity>
      </SafeAreaView>

      <Modal onRequestClose={() => setShowModal(false)} visible={showModal} animationType='slide'>
        <Animated.View style={[styles.container, backgroundColorStyle]}>
          <View style={styles.pickerContainer}>
            <ColorPicker
              value={contact.bgColor}
              sliderThickness={25}
              thumbShape='circle'
              thumbSize={25}
              onChange={onColorSelect}
              adaptSpectrum
            >
              <View style={styles.previewContainer}>
                <Preview style={styles.previewStyle} />
              </View>

              <Panel3 style={styles.panelStyle} centerChannel='brightness' />

              <SaturationSlider style={styles.sliderStyle} />

              <OpacitySlider style={styles.sliderStyle} />

              <Swatches style={styles.swatchesContainer} swatchStyle={styles.swatchStyle} colors={customSwatches} />
            </ColorPicker>
          </View>

          <View style={styles.buttonWrapper}>
            <Pressable style={styles.button} onPress={() => setShowModal(false)}>
              <Text style={{ color: '#707070', fontWeight: 'bold' }}>Cancel</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={() => handleModalSave()}>
              <Text style={{ color: '#707070', fontWeight: 'bold' }}>Save</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Modal>
    </>  
  )
}

const styles = StyleSheet.create({
  avatarView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    borderRadius: 100,
    backgroundColor: "green",
  },
  avatarText: {
    fontSize: 55,
    color: "white",
    textTransform: "uppercase"
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: 'center',
  },
  pickerContainer: {
    alignSelf: 'center',
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  panelStyle: {
    borderRadius: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  sliderStyle: {
    borderRadius: 20,
    marginTop: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  previewContainer: {
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#bebdbe',
  },
  previewStyle: {
    height: 40,
    borderRadius: 14,
  },
  swatchesContainer: {
    borderTopWidth: 1,
    borderColor: '#bebdbe',
    marginTop: 20,
    paddingTop: 20,
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: 10,
  },
  swatchStyle: {
    borderRadius: 20,
    height: 30,
    width: 30,
    margin: 0,
    marginBottom: 0,
    marginHorizontal: 0,
    marginVertical: 0,
  },
  openButton: {
    width: '100%',
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 10,
    backgroundColor: '#fff',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  buttonWrapper: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  button: {
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 10,
    alignSelf: 'center',
    backgroundColor: '#fff',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  floatingActionBtnContainer: {
    position: "absolute",
    borderRadius: 60,
    bottom: 25,
    right: 25,
    height: 70,
    width: 70,
    elevation: 10
  },
  floatingActionBtn: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  }
})