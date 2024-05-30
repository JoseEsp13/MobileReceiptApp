import { Button, SafeAreaView, ScrollView, TextInput, View } from "react-native";
import useAppContext from "../components/hooks/useAppContext";
import { IContact, IGroup } from "../components/state/IFirebaseDocument";
import { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { ICreateGroupScreenProps } from "../routes";


export default function CreateGroupScreen(props: ICreateGroupScreenProps) {

  const ctx = useAppContext();
  const [contact, setContact] = useState<IGroup>({id: 0, name: "", contacts: []})

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
          <View style={{borderRadius: 100, backgroundColor: "white", justifyContent: "center", alignItems: "center", height: 110, width: 110}}>
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

        <View style={{marginTop: 60, alignItems: "center"}}>
          <View style={{width: "60%", borderRadius: 50}}>
            <Button title="Save" color="steelblue" onPress={handleSave} />
          </View>
        </View>  
      </ScrollView>
    </SafeAreaView>
  )
}