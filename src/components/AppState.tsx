import { ReactNode, createContext, useEffect, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import LoginScreen from '../screens/LoginScreen';

export interface IContact {
    id: number,
    name: string,
    email?: string,
    phoneNumber?: string
}

export interface IGroup {
    id: number,
    name: string,
    contacts: IContact[]
}

export type IAppContext = {
  user: FirebaseAuthTypes.User | null,
  activeGroupId: number | null,
  setActiveGroupId: React.Dispatch<React.SetStateAction<number | null>>,
  groups: IGroup[],
  setGroups: React.Dispatch<React.SetStateAction<IGroup[]>>,
  contacts: IContact[],
  setContacts: React.Dispatch<React.SetStateAction<IContact[]>>
}

export const AppContext = createContext<IAppContext>({
    user: null,
    activeGroupId: null,
    setActiveGroupId: () => {},
    groups: [],
    setGroups: () => {},
    contacts: [],
    setContacts: () => {}
});

interface IAppState {
    children?: ReactNode | ReactNode[]
}

export default function AppState(props: IAppState) {

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const [activeGroupId, setActiveGroupdId] = useState<number | null>(null);
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [contacts, setContacts] = useState<IContact[]>([]);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(userState => {
      setUser(userState);
      if (initializing) setInitializing(false);
    });
    return subscriber; // unsubscribe on unmount
  }, []);
  
  return (
    <AppContext.Provider value={{
      user: user,
      activeGroupId: activeGroupId,
      setActiveGroupId: setActiveGroupdId,
      groups: groups,
      setGroups: setGroups,
      contacts: contacts,
      setContacts: setContacts
    }}>
      {props.children}
    </AppContext.Provider>
  )
}