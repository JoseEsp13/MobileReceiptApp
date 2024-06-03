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
  login: (email: string, password: string) => Promise<void>,
  logout: () => Promise<void>,
  createAuthenticatedUserAsync: (email: string, password: string, name: string,) => Promise<Boolean>,
  fetchUserCloudData: () => void,
  addGroup: (group: IGroup) => void,
  editGroup: (group: IGroup) => void,
  deleteGroup: (group: IGroup) => void,
  addContact: (contact: IContact) => void,
  editContact: (contact: IContact) => void,
  deleteContact: (contact: IContact) => void
}

export const AppContext = createContext<IAppContext>({
  authenticated: null,
  user: utility.createEmptyUserObject(),
  login: async () => {},
  logout: async () => {},
  createAuthenticatedUserAsync: async () => false,
  fetchUserCloudData: () => {},
  addGroup: () => {},
  editGroup: () => {},
  deleteGroup: () => {},
  addContact: () => {},
  editContact: () => {},
  deleteContact: () => {},
  
});

interface IAppState {
  children?: ReactNode | ReactNode[],
}

export default function AppState(props: IAppState) {

  // Initializing state while Firebase connects
  const [initializing, setInitializing] = useState(true);
  // Holds the firebase authentication object. This is null if the user is not authenticated.
  const [authenticated, setAuthenticated] = useState<FirebaseAuthTypes.User | null>(null);
  // Holds our user data object. This corresponds to the "Firestore Database" resource in the Firebase Console
  const [user, setUser] = useState<IUser>(utility.createEmptyUserObject())

  // Runs on startup. Subscribe to firebase auth events.
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async authState => {
      setAuthenticated(authState);
      if (authState !== null) {
        const cloudData = await firebase.getUserDataAsync(authState.uid)
        setUser(cloudData);
      }
      if (initializing) setInitializing(false);
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  // Utility functions for determining next Id
  const getNextGroupId = () => {
    if (user.groups.length == 0) return 1;
    return Math.max(...user.groups.map(x => x.id)) + 1
  }

  const getNextContactId = () => {
    if (user.contacts.length == 0) return 1;
    return Math.max(...user.contacts.map(x => x.id)) + 1
  }

  // Authentication functions
  // Creates a new user
  const createAuthenticatedUserAsync = async (email: string, password: string, name: string) => {
    const user = await firebase.createAuthenticatedUserAsync(email, password, name);
    if (user != null) {
      setUser(user);
      return true;
    }
    return false;
  }

  const login = async (email: string, password: string) => {
    await firebase.loginAsync(email, password)
  }

  const logout = async () => {
    await firebase.logoutAsync()
  }

  // Fetches user cloud data from "Firestore Database"
  const fetchUserCloudData = async () => {
    const response = await firebase.getUserDataAsync(authenticated?.uid ?? "");
    setUser(response);
  }

  // Group functions
  const addGroup = useCallback((group: IGroup) => {
    const newGroup: IGroup = {
      ...group,
      id: getNextGroupId()
    }

    setUser(prevState => {
      const newState = {
        ...prevState,
        groups: [...prevState.groups, newGroup]
      }
      firebase.setUserDataAsync(newState);
      return newState;
    })
  }, [setUser])

  const editGroup = useCallback((group: IGroup) => {
    setUser(prevState => {
      const newState = {
        ...prevState,
        groups: prevState.groups.map(x => x.id === group.id ? group : x)
      }
      firebase.setUserDataAsync(newState);
      return newState;
    })
  }, [setUser])

  const deleteGroup = useCallback((group: IGroup) => {
    setUser(prevState => {
      const newState = {
        ...prevState,
        groups: prevState.groups.filter(x => x.id !== group.id)
      }
      firebase.setUserDataAsync(newState);
      return newState;
    })
  }, [setUser])

  // Contact functions
  const addContact = useCallback((contact: IContact) => {
    const newContact: IContact = {
      ...contact,
      id: getNextContactId()
    }
    
    setUser(prevState => {
      const newState = {
        ...prevState,
        contacts: [...prevState.contacts, newContact]
      }

      firebase.setUserDataAsync(newState)
      return newState;
    })
  }, [setUser, getNextContactId])

  const editContact = (contact: IContact) => {
    if (contact.id <= 0) console.error("Cannot edit empty contact");
    setUser(prevState => {
      const updatedUser = {
        ...prevState,
        contacts: prevState.contacts.map(x => x.id === contact.id ? contact : x)
      }
      firebase.setUserDataAsync(updatedUser);
      return updatedUser;
    });
    
  }

  const deleteContact = (contact: IContact) => {
    setUser(prevState => {
      const groups = [...prevState.groups];

      const newState = {
        ...prevState,
        contacts: prevState.contacts.filter(x => x.id !== contact.id),
        groups: groups.map(group => ({
          ...group,
          contacts: group.contacts.filter(groupContact => groupContact.id !== contact.id)
        }))
      }
      
      firebase.setUserDataAsync(newState);
      return newState;
    });
  }

  return (
    <AppContext.Provider value={{
      authenticated: authenticated,
      user: user,
      addGroup,
      editGroup,
      deleteGroup,
      createAuthenticatedUserAsync,
      fetchUserCloudData,
      login,
      logout,
      addContact,
      editContact,
      deleteContact
    }}>
      {props.children}
    </AppContext.Provider>
  )
}