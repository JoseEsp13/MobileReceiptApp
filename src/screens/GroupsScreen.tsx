

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useAppContext from '../components/hooks/useAppContext';
import routes, { IGroupScreenProps } from '../routes';
import { IGroup } from '../components/state/IFirebaseDocument';
import Avatar from '../components/Avatar';
import useIsDarkColorTheme from '../components/hooks/useIsDarkColorTheme';


export default function GroupsScreen(props: IGroupScreenProps) {
  const ctx = useAppContext();
  const isDark = useIsDarkColorTheme();

  const handleAddBtnOnPress = () => {
    props.navigation.navigate(routes.CREATE_GROUP_SCREEN);
  }

  const handleEditGroupOnPress = (group: IGroup) => {
    props.navigation.navigate(routes.EDIT_GROUP_SCREEN, {group});
  }

  return (
    <SafeAreaView style={styles.container}>
      {ctx.user.groups.length > 0 ?
        <>
          <ScrollView>
            {ctx.user.groups.map((group, i) => (
              <TouchableOpacity key={i} style={[styles.viewRow, {backgroundColor: isDark ? "#212121" : "white"}]} onPress={() => handleEditGroupOnPress(group)}>
                <View style={{justifyContent: "center", alignItems: "center", height: "100%"}}>
                  <View style={styles.avatarContainer}>
                    <Avatar name={group.name} bgColor={group.bgColor} color={group.color} viewStyle={styles.avatarView} textStyle={styles.avatarText}/>
                  </View>
                </View>
                <View style={styles.nameContainer}>
                  <Text style={styles.nameText}>{group.name}</Text>
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
            <Text style={{fontSize: 24}}>No Groups yet!</Text>
          </View>
          <View style={{flexDirection: "row", justifyContent: "center", marginTop: 40}}>
            <TouchableOpacity style={{backgroundColor: "steelblue", padding: 10, borderRadius: 10}} onPress={handleAddBtnOnPress}>
              <Text style={{color: "white", fontSize: 20}}>Add a group</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  columnContainer: {
    marginBottom: 20,
  },
  columnTitleInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  deleteColumnButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  subGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  subGroupInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  deleteSubGroupButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 5,
  },
  addSubGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  addSubGroupButtonText: {
    marginLeft: 5,
  },
  addColumnButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 10,
  },
  addColumnButtonText: {
    marginLeft: 5,
  },
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
  addBtnAbsoluteContainer: {
    position: "absolute",
    borderRadius: 60,
    bottom: 25,
    right: 25,
    height: 70,
    width: 70,
    backgroundColor: "steelblue",
    elevation: 10
  },
  addBtn: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%"
  }
});
