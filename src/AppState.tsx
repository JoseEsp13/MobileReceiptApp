import { ReactNode, createContext, useEffect, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { INewUser } from './components/state/IFirebase';



export type IAppContext = {
  authUser: FirebaseAuthTypes.User | null,
  createUser: (newUser: INewUser) => void,
}

export const AppContext = createContext<IAppContext>({
  authUser: null,
  createUser: () => {},
});

interface IAppState {
    children?: ReactNode | ReactNode[]
}

export default function AppState(props: IAppState) {

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [authUser, setAuthUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(userState => {
      setAuthUser(userState);
      if (initializing) setInitializing(false);
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <AppContext.Provider value={{
      authUser: authUser,
      createUser: createUser,
    }}>
      {props.children}
    </AppContext.Provider>
  )
}