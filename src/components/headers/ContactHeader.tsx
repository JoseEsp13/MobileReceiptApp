import { Text, TouchableOpacity, View } from "react-native";
import { HeaderTitleProps } from '@react-navigation/elements';
import Icon from 'react-native-vector-icons/Ionicons';
import useAppContext from "../hooks/useAppContext";
import { useMemo, useState } from "react";
import { IContact } from "../state/IFirebaseDocument";

interface IViewContactHeaderProps extends HeaderTitleProps {

}

export default function ContactHeader(props: IViewContactHeaderProps) {

  const ctx = useAppContext();
  const [originalContacts, setOriginalContacts] = useState(JSON.stringify(ctx.user.contacts));

  const isChanged = useMemo(() => {
    const changed = JSON.stringify(ctx.user.contacts)
    return originalContacts !== changed;
  }, [originalContacts, ctx.user.contacts]);

  const handleCloudSave = () => {
    setOriginalContacts(JSON.stringify(ctx.user.contacts))
    ctx.saveToCloud();
  }

  return (
    <View style={{width: "100%", height: "100%", flexDirection: "row", justifyContent: "space-between"}}>
      <View style={{flex: 1, justifyContent: "center"}}>
        <Text style={{fontSize: 20, fontWeight: "500", color: "black"}}>View Contacts</Text>
      </View>
      
      <View style={{height: "100%", width: 55, justifyContent: "center", alignItems: "center"}}>
        {isChanged &&
          <TouchableOpacity onPress={handleCloudSave}>
            <Icon name="save" color="green" size={25}/>
          </TouchableOpacity>
        }
      </View> 
    </View>
  )
}