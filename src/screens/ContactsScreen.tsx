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
import useIsDarkColorTheme from '../components/hooks/useIsDarkColorTheme';


export default function ContactsScreen(props: IContactsScreenTabProps) {

  const ctx = useAppContext();
  const isDark = useIsDarkColorTheme();

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
            ctx.user.contacts.map((contact, i) => (
              <TouchableOpacity key={i} style={[styles.viewRow, {backgroundColor: isDark ? "#212121" : "white"}]} onPress={() => handleEditContactOnPress(contact)}>
                <View style={{justifyContent: "center", alignItems: "center", height: "100%"}}>
                  <View style={styles.avatarContainer}>
                    <Avatar name={contact.name} bgColor={contact.bgColor} color={contact.color} viewStyle={styles.avatarView} textStyle={styles.avatarText}/>
                  </View>
                </View>
                <View style={styles.nameContainer}>
                  <Text style={styles.nameText}>{contact.name}</Text>
                </View> 
              </TouchableOpacity>
          ))}
          </ScrollView>

          <TouchableOpacity style={styles.floatingActionBtnContainer} onPress={handleAddBtnOnPress}>
            <View style={styles.floatingActionBtn}>
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
    height: 70,
    marginBottom: 10,
    borderRadius: 10,
    paddingHorizontal: 10
  },
  avatarContainer: {
    height: 58,
    width: 58,
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
    fontSize: 20
  },
  floatingActionBtnContainer: {
    position: "absolute",
    borderRadius: 60,
    bottom: 25,
    right: 25,
    height: 70,
    width: 70,
    backgroundColor: "steelblue",
    elevation: 10
  },
  floatingActionBtn: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    color: "white"
  }
});