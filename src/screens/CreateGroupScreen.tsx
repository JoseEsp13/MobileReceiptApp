import { Button, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import useAppContext from "../components/hooks/useAppContext";
import { IGroup } from "../components/state/IFirebaseDocument";
import { useEffect, useState } from "react";
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Icon from "react-native-vector-icons/Ionicons";
import routes, { ICreateGroupScreenProps } from "../routes";
import ColorPicker, { OpacitySlider, Panel3, Preview, SaturationSlider, Swatches, colorKit, returnedResults } from "reanimated-color-picker";
import Avatar from "../components/Avatar";
import useIsDarkColorTheme from "../components/hooks/useIsDarkColorTheme";


export default function CreateGroupScreen(props: ICreateGroupScreenProps) {

  const ctx = useAppContext();
  const isDark = useIsDarkColorTheme();
  const [group, setGroup] = useState<IGroup>({id: 0, name: "", bgColor: isDark ? "#212121" : "#fafafa", color: "#9e9e9e", contacts: []});
  const [showPaletteModal, setShowPaletteModal] = useState(false);

  const customSwatches = new Array(6).fill('#fff').map(() => colorKit.randomRgbColor().hex());

  const selectedColor = useSharedValue(customSwatches[0]);
  const backgroundColorStyle = useAnimatedStyle(() => ({ backgroundColor: selectedColor.value }));

  useEffect(() => {
    if (props.route.params?.group) {
      setGroup(props.route.params.group)
    }
  }, [props.route.params?.group])

  const handleSave = () => {
    if (group.name) {
      ctx.addGroup(group);
      props.navigation.goBack();
    } 
  }

  const handleManageContacts = () => {
    props.navigation.navigate(routes.GROUP_CONTACT_MANAGER_SCREEN, {group: group, returnScreen: routes.CREATE_GROUP_SCREEN})
  }

  // Modal functions
  const onColorSelect = (color: returnedResults) => {
    'worklet';
    selectedColor.value = color.hex;
  };

  const handleModalSave = () => {
    const color = colorKit.isDark(selectedColor.value) ? "#fff" : "#1a1a1a";
    setGroup(prevState => ({
      ...prevState,
      color: color,
      bgColor: selectedColor.value
    }))
    setShowPaletteModal(false);
  }

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView>
          <View style={{flexDirection: "row", justifyContent: "space-around", marginTop: 25}}>
            <View style={{width: 70, justifyContent: "center", alignItems: "center"}}>
              <TouchableOpacity onPress={() => setShowPaletteModal(true)} style={{backgroundColor: isDark ? "#212121" : "white", borderRadius: 50, width: 60, height: 60, justifyContent: "center", alignItems: "center"}}>
                <Icon name="color-palette" size={35} color="#ffa726"/>
              </TouchableOpacity>
            </View>
            <View style={{borderRadius: 100, backgroundColor: group.bgColor, justifyContent: "center", alignItems: "center", height: 110, width: 110}}>
              {group.name?.length > 0 ?
                <Avatar name={group.name} bgColor={group.bgColor} color={group.color} viewStyle={styles.avatarView} textStyle={styles.avatarText}/>
                :
                <Icon name="people" size={65} color={group.color}></Icon>
              }
            </View>
            <View style={{width: 70, justifyContent: "center", alignItems: "center"}}>

            </View>
          </View>

          <View style={{marginTop: 30, backgroundColor: isDark ? "#212121" : "white", paddingTop: 15, paddingBottom: 30, paddingHorizontal: 10, borderRadius: 15, marginHorizontal: 10}}>
            <View>
              <Text style={{fontSize: 17, color: isDark ? "white" : "#424242"}}>Group info</Text>
            </View>

            <View style={{marginTop: 30, flexDirection: "row"}}>
              <View style={{justifyContent: "center", alignItems: "center", width: 40}}>
                <Icon name="person-outline" size={25}></Icon>
              </View>
              <View style={{flex: 1}}>
                <TextInput
                  placeholder="Name"
                  value={group.name}
                  onChangeText={(s: string) => setGroup(prevState => ({...prevState, name: s}))}
                  style={{borderWidth: 1, marginHorizontal: 5, padding: 10, paddingLeft: 15, marginRight: 15, borderRadius: 5}}
                />
              </View>
            </View>
          </View>

          <View style={{marginTop: 30, backgroundColor: isDark ? "#212121" : "white", paddingTop: 15, paddingBottom: 30, paddingHorizontal: 10, borderRadius: 15, marginHorizontal: 10}}>

            <View>
              <Text style={{fontSize: 17, color: isDark ? "white" : "#424242"}}>Attached Contacts</Text>
            </View>

            <View style={{marginTop: 10}}>
              {group.contacts.map((groupContact, i) => (
                <View key={i} style={styles.viewRow}>
                  <View style={{justifyContent: "center", alignItems: "center", height: "100%"}}>
                    <View style={styles.avatarContainer}>
                      <Avatar name={groupContact.name} bgColor={groupContact.bgColor} color={groupContact.color} viewStyle={styles.avatarView} textStyle={styles.contactAvatarText}/>
                    </View>
                  </View>
                  <View style={styles.nameContainer}>
                    <Text style={styles.nameText}>{groupContact.name}</Text>
                  </View> 
                </View>
              ))}

              <View style={{alignItems: "center", justifyContent: "center", marginTop: 20}}>
                <View style={{width: 150}}>
                  <Button title="Manage" color="steelblue" onPress={handleManageContacts} />
                </View>
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
      
      <Modal onRequestClose={() => setShowPaletteModal(false)} visible={showPaletteModal} animationType='slide'>
        <Animated.View style={[styles.container, backgroundColorStyle]}>
          <View style={styles.pickerContainer}>
            <ColorPicker
              value={group.bgColor}
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
            <Pressable style={styles.button} onPress={() => setShowPaletteModal(false)}>
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

    elevation: 5
  },
  viewRow: {
    flexDirection: "row",
    height: 55,
    borderRadius: 10,
    paddingHorizontal: 10
  },
  avatarContainer: {
    height: 55,
    width: 55,
    padding: 5,
  },
  avatarView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    borderRadius: 100,
  },
  avatarText: {
    fontSize: 55,
    textTransform: "uppercase"
  },
  contactAvatarText: {
    fontSize: 20,
    textTransform: "uppercase"
  },
  nameContainer: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 10
  },
  nameText: {
    fontSize: 18
  },
  addBtnAbsoluteContainer: {
    position: "absolute",
    borderRadius: 60,
    bottom: 25,
    right: 25,
    height: 50,
    width: 50,
    backgroundColor: "steelblue"
  },
  addBtn: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%"
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
    height: "100%"
  }
})
