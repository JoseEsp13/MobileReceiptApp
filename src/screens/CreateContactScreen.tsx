import { Button, SafeAreaView, ScrollView, TextInput, View, Text } from "react-native";
import useAppContext from "../components/hooks/useAppContext";
import { IContact } from "../components/state/IFirebaseDocument";
import { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { ICreateContactScreenProps } from "../routes";
import { TriangleColorPicker, fromHsv } from "react-native-color-picker";


export default function CreateContactScreen(props: ICreateContactScreenProps) {

  const ctx = useAppContext();
  const [contact, setContact] = useState<IContact>({id: 0, name: "", email: "", color: ""})

  const handleSave = () => {
    if (contact.name && contact.email) {
      ctx.addContact(contact);
      props.navigation.goBack();
    } 
  }

  return(
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <View style={{justifyContent: "center", alignItems: "center", marginTop: 25}}>
          <View style={{borderRadius: 100, backgroundColor: "grey", justifyContent: "center", alignItems: "center", height: 110, width: 110}}>
            <Icon name="person-add" size={65}></Icon>
          </View>
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
              style={{borderWidth: 1, marginHorizontal: 5, padding: 10, paddingLeft: 15, marginRight: 15}}
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
              style={{borderWidth: 1, marginHorizontal: 5, padding: 10, paddingLeft: 15, marginRight: 15}}
            />
          </View>
        </View>

        <View style={{ marginTop: 25, alignItems: "center", flexDirection: "row" }}>
          <View style={{justifyContent: "center", alignItems: "center", width: 40}}>
            <Icon name="color-palette-outline" size={25}></Icon>
          </View>
          <View style={{justifyContent: "center", alignItems: "center", left: '20%'}}>
            <TriangleColorPicker
              defaultColor={contact.color}
              oldColor={contact.color}
              onColorSelected={color => setContact(prevState => ({...prevState, color: color}))}
              style={{ width: 200, height: 200 }}
            />
          </View>
        </View>

        <Text style={{fontSize: 12, marginTop: 20, textAlign: "center"}}>
          Press above button to select color 
        </Text>

        <View style={{marginTop: 30, alignItems: "center"}}>
          <View style={{width: "60%", borderRadius: 50}}>
            <Button title="Save" color="steelblue" onPress={handleSave} />
          </View>
        </View>  
      </ScrollView>
    </SafeAreaView>
  )
}