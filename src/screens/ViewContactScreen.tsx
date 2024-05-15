import { Button, SafeAreaView, ScrollView, TextInput, View } from "react-native";
import { IContact } from "../components/state/IFirebaseDocument";
import routes, { IViewContactScreenProps } from "../routes";
import { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from "react-native-gesture-handler";
import useAppContext from "../components/hooks/useAppContext";


export default function ViewContactScreen(props: IViewContactScreenProps) {

  const ctx = useAppContext();
  const [contact, setContact] = useState<IContact>(props.route.params.contact);

  const handleClose = () => {
    ctx.editContact(contact);
    props.navigation.navigate(routes.CONTACTS_SCREEN);
  }

  const handleDelete = (contact: IContact) => {
    ctx.deleteContact(contact);
    props.navigation.navigate(routes.CONTACTS_SCREEN);
  }

  return(
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <View style={{flexDirection: "row", justifyContent: "space-around", marginTop: 25}}>
          <View style={{width: 70, justifyContent: "center", alignItems: "center"}}>
            
          </View>
          <View style={{borderRadius: 100, backgroundColor: "white", justifyContent: "center", alignItems: "center", height: 110, width: 110}}>
            <Icon name="person-add" size={65}></Icon>
          </View>
          <View style={{width: 70, justifyContent: "center", alignItems: "center"}}>
            <TouchableOpacity onPress={() => handleDelete(contact)}>
              <Icon name="trash" size={35} color="red"/>
            </TouchableOpacity>
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
            <Button title="Close" color="steelblue" onPress={handleClose} />
          </View>
          
        </View>  
      </ScrollView>
    </SafeAreaView>
  )
}