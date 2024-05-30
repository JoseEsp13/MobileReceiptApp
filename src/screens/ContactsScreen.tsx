/**
 * HomeScreen.tsx
 * 
 * Home screen component.
 */
import {SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons'
import useAppContext from '../components/hooks/useAppContext';
import Avatar from '../components/Avatar';
import routes, { IContactsScreenTabProps } from '../routes';
import { IContact } from '../components/state/IFirebaseDocument';


export default function ContactsScreen(props: IContactsScreenTabProps) {

  const ctx = useAppContext();

  const handleAddBtnOnPress = () => {
    props.navigation.navigate(routes.CREATE_CONTACT_SCREEN);
  }

  const handleEditContactOnPress = (contact: IContact) => {
    props.navigation.navigate(routes.EDIT_CONTACT_SCREEN, {contact});
  }

  return (
    <SafeAreaView style={styles.container}>
      {ctx.user.contacts.length > 0 ?
        <>
          <ScrollView style={{flex: 1}}>
          {
            ctx.user.contacts.map((x, i) => (
              <TouchableOpacity key={i} style={styles.viewRow} onPress={() => handleEditContactOnPress(x)}>
                <View style={styles.avatarContainer}>
                  <Avatar contact={x} viewStyle={styles.avatarView} textStyle={styles.avatarText}/>
                </View>
                <View style={styles.nameContainer}>
                  <Text style={styles.nameText}>{x.name}</Text>
                </View> 
              </TouchableOpacity>
          ))}
          </ScrollView>
          <TouchableOpacity style={styles.addBtnAbsoluteContainer} onPress={handleAddBtnOnPress}>
            <View style={styles.addBtn}>
              <Icon name="add" size={25} color="white"/>
            </View>
          </TouchableOpacity>
        </>
        
         :
        <View style={{flex: 1, alignItems: "center", marginTop: "50%"}}>
          <View>
            <Text style={{fontSize: 25}}>No contacts yet!</Text>
          </View>
          <View style={{flexDirection: "row", justifyContent: "center", marginTop: 40}}>
            <TouchableOpacity style={{backgroundColor: "steelblue", padding: 10, borderRadius: 10}} onPress={handleAddBtnOnPress}>
              <Text style={{color: "white", fontSize: 20}}>Add a contact</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      }   
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    paddingHorizontal: 10, 
    paddingTop: 15
  },
  viewRow: {
    flexDirection: "row",
    height: 55,
    backgroundColor: "white",
    marginBottom: 10,
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
    borderRadius: 25,
    backgroundColor: "green",
  },
  avatarText: {
    fontSize: 20,
    color: "white",
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
    height: "100%",
    color: "white"
  }
});