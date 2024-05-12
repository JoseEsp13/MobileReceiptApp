import { ReactNode, createContext, useCallback, useEffect, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { IContact, IGroup, IUser} from './IFirebaseDocument';
import utility from '../util/utility';
import firebase from './firebaseStorage';


export type IAppContext = {
  authenticated: FirebaseAuthTypes.User | null,
  user: IUser,
  addGroup: (name: string) => void,
  saveToCloud: () => Promise<Boolean>,
  createAuthenticatedUserAsync: (email: string, password: string, name: string,) => Promise<Boolean>,
  fetchUserCloudData: () => void,
  login: (email: string, password: string) => Promise<void>,
  logout: () => Promise<void>
}

export const AppContext = createContext<IAppContext>({
  authenticated: null,
  user: utility.createEmptyUserObject(),
  addGroup: () => {},
  saveToCloud: async () => false,
  createAuthenticatedUserAsync: async () => false,
  fetchUserCloudData: () => {},
  login: async () => {},
  logout: async () => {}
});

interface IAppState {
  children?: ReactNode | ReactNode[],
}

export default function AppState(props: IAppState) {

  // Set an initializing state while Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [authenticated, setAuthenticated] = useState<FirebaseAuthTypes.User | null>(null);
  const [user, setUser] = useState<IUser>(utility.createEmptyUserObject())

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async authState => {
      setAuthenticated(authState);
      if (authState !== null) {
        const cloudData = await firebase.getUserAsync(authState.uid)
        setUser(cloudData);
      }
      if (initializing) setInitializing(false);
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  const getNextGroupId = () => Math.max(...user.groups.map(x => x.id)) + 1

  const getNextContactId = () => Math.max(...user.contacts.map(x => x.id)) + 1

  const fetchUserCloudData = async () => {
    const response = await firebase.getUserAsync(authenticated?.uid ?? "");
    setUser(response);
  }

  const addGroup = useCallback((name: string) => {
    const newGroup: IGroup = {
      id: getNextGroupId(),
      name,
      contacts: []
    }

    setUser(prevState => ({
      ...prevState,
      groups: [...prevState.groups, newGroup]
    }))
  }, [setUser])

  const editGroup = useCallback((groupArrayIndex: number, name: string) => {

  }, [setUser])

  const addContactToGroup = (contactId: number, groupId: number) => {
    const contact = user.contacts.find(x => x.id === contactId);
    if (!contact) {
      console.log(`Contact Id: ${contactId} not found.`);
      return false;
    }

    const group = user.groups.find(x => x.id === groupId);
    if (!group) {
      console.log(`Group Id: ${groupId} not found.`);
      return false;
    }

    if (group.contacts.find(x => x.id === contact.id)) {
      console.log(`Contact Id ${contactId} already exists in group ${groupId}`);
      return false;
    }

    group.contacts.push(contact)

    setUser(prevState => ({
      ...prevState,
      groups: prevState.groups.map(x => x.id === groupId ? group : x)
    }))

    return true;
  }

  const addContact = useCallback((name: string, email: string) => {
    const newContact: IContact = {id: getNextContactId(), name, email}
    setUser(prevState => ({
      ...prevState,
      contacts: [...prevState.contacts, newContact]
    }))
  }, [setUser])

  const createAuthenticatedUserAsync = async (email: string, password: string, name: string) => {
    const user = await firebase.createAuthenticatedAsync(email, password, name);
    if (user != null) {
      setUser(user);
      return true;
    }
    return false;
  }

  const saveToCloud = async () => {
    return await firebase.saveUserAsync(user)
  }

  const login = async (email: string, password: string) => {
    await firebase.loginAsync(email, password)
  }

  const logout = async () => {
    await firebase.logoutAsync()
  }

  return (
    <AppContext.Provider value={{
      authenticated: authenticated,
      user: user,
      addGroup,
      saveToCloud,
      createAuthenticatedUserAsync,
      fetchUserCloudData,
      login,
      logout
    }}>
      {props.children}
    </AppContext.Provider>
  )
}