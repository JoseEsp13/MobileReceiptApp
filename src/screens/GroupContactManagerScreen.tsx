import { Button, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import routes, { IGroupContactManagerScreenProps } from "../routes";
import useAppContext from "../components/hooks/useAppContext";
import { IContact, IGroup } from "../components/state/IFirebaseDocument";
import { useCallback, useMemo, useState } from "react";
import Avatar from "../components/Avatar";
import useIsDarkColorTheme from "../components/hooks/useIsDarkColorTheme";

interface IContactHash {
  [key: string] : boolean
}

export default function GroupContactManagerScreen(props: IGroupContactManagerScreenProps) {

  const ctx = useAppContext();
  const isDark = useIsDarkColorTheme();
  const [group, setGroup] = useState<IGroup>(props.route.params.group);

  const handleAddContactToGroup = (contact: IContact) => {
    setGroup(prevState => ({
      ...prevState,
      contacts: [...prevState.contacts, contact]
    }));
    contactHash[contact.name] = true;
  };

  const handleRemoveContactFromGroup = (contact: IContact) => {
    setGroup(prevState => ({
      ...prevState,
      contacts: prevState.contacts.filter(x => x.id !== contact.id)
    }));
    contactHash[contact.name] = false;
  };

  const handleClose = () => {
    props.navigation.navigate(props.route.params.returnScreen, {group: group});
  }

  const contactHash = useMemo(() => {
    const hash: IContactHash = {};
    ctx.user.contacts.forEach(contact => {
      hash[contact.name] = false;
    })
    group.contacts.forEach(contact => {
      if (Object.hasOwn(hash, contact.name)) {
        hash[contact.name] = true;
      }
    })
    return hash;
  }, [ctx.user.contacts.length]);

  const contacts = useMemo(()=> {
    return ctx.user.contacts.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    })
  }, [ctx.user.contacts.length]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{marginTop: 5, paddingBottom: 20}}>
        {contacts.map((contact, i) => {
          if (contactHash[contact.name]) {
            return (
              <TouchableOpacity key={i} style={[styles.viewRow, {borderWidth: 2, borderColor: "#03a9f4", backgroundColor: isDark ? "#212121" : "white"}]} onPress={() => handleRemoveContactFromGroup(contact)}>
                <View style={{justifyContent: "center", alignItems: "center", height: "100%"}}>
                  <View style={styles.avatarContainer}>
                    <Avatar name={contact.name} bgColor={contact.bgColor} color={contact.color} viewStyle={styles.avatarView} textStyle={styles.avatarText}/>
                  </View>
                </View>
                <View style={styles.nameContainer}>
                  <Text style={styles.nameText}>{contact.name}</Text>
                </View> 
              </TouchableOpacity>
            )
          }
          return (
            <TouchableOpacity key={i} style={[styles.viewRow, {backgroundColor: isDark ? "#212121" : "white"}]} onPress={() => handleAddContactToGroup(contact)}>
              <View style={{justifyContent: "center", alignItems: "center", height: "100%"}}>
                <View style={styles.avatarContainer}>
                  <Avatar name={contact.name} bgColor={contact.bgColor} color={contact.color} viewStyle={styles.avatarView} textStyle={styles.avatarText}/>
                </View>
              </View>
              <View style={styles.nameContainer}>
                <Text style={styles.nameText}>{contact.name}</Text>
              </View> 
            </TouchableOpacity>
          )
        })}
        {contacts.length === 0 &&
          <View style={{flex: 1, alignItems: "center", marginTop: "50%"}}>
            <View>
              <Text style={{fontSize: 20}}>Contacts needed!</Text>
            </View>
            <View style={{marginTop: 20}}>
              <Text style={{fontSize: 20}}>Use the Contacts action below</Text>
            </View>
          </View>
        }
      </ScrollView>

      {contacts.length > 0 &&
        <View style={{position: "absolute", bottom: 10, left: 10, right: 10, alignItems: "center"}}>
          <View style={{width: 180, borderRadius: 50}}>
            <Button title="Close" color="steelblue" onPress={handleClose} />
          </View>
        </View> 
      } 
    </SafeAreaView>
  )
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
    height: 55,
    width: 55,
    padding: 5,
  },
  avatarView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: "green",
  },
  avatarText: {
    fontSize: 20,
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
  }
});
