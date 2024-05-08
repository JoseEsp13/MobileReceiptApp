import { ReactNode, createContext, useEffect, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import LoginScreen from '../screens/LoginScreen';
import storage from '@react-native-firebase/storage';

export interface IUser {
  uid: string,
  name: string,
  email: string
}

export interface INewUser {
  username: string,
  password: string,
  name: string,
  email: string
}

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
  createNewUser: (newUser: INewUser) => void,
  activeGroupId: number | null,
  setActiveGroupId: React.Dispatch<React.SetStateAction<number | null>>,
  groups: IGroup[],
  setGroups: React.Dispatch<React.SetStateAction<IGroup[]>>,
  contacts: IContact[],
  setContacts: React.Dispatch<React.SetStateAction<IContact[]>>
}

export const AppContext = createContext<IAppContext>({
    user: null,
    createNewUser: () => {},
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

  const createUserJson = async () => {
    if (user?.uid) {
      const newUserObject: IUser = {
        uid: user.uid,
        name: "Come",
        email: "on"
      };
      const url = `/users/${user.uid}/user.json`;
      console.log(`Url: ${url}`)
      const reference = storage().ref(url);
      const result = await reference.putString(JSON.stringify(newUserObject));
      
      console.log(result.state)
    }
  }

  createUserJson();
 


  const createNewUser = async (newUser: INewUser) => {
    auth()
    .createUserWithEmailAndPassword(newUser.username, newUser.password)
    .then(credential => {
      console.log('User account created & signed in!');
      const newUserObject: IUser = {
        uid: credential.user.uid,
        ...newUser
      };
      const reference = storage().ref(`/users/${user}/user.json`);
      reference.put(JSON.parse(JSON.stringify(newUserObject)));
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }
  
      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }
  
      console.error(error);
    });
  }

  return (
    <AppContext.Provider value={{
      user: user,
      createNewUser: createNewUser,
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