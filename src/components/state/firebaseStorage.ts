import auth from '@react-native-firebase/auth';
import storage, { FirebaseStorageTypes } from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { IUser } from './IFirebaseDocument';
import utility from '../util/utility';

// Creates a new authenticated login
// Also creates a new user data entry in the Firestore Database
const createAuthenticatedUserAsync = async (email: string, password: string, name: string) => {
  return await auth()
    .createUserWithEmailAndPassword(email, password)
    .then(async credential => {

      // Authentication created. 
      // Attempt to add a user data entry
      const newUser: IUser = {
        uid: credential.user.uid,
        contacts: [],
        groups: [],
        name,
        email
      };

      await setUserDataAsync(newUser);
      return newUser;
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use');
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid');
      }

      console.error(error);
      return null;
    });
}

// Login
const loginAsync = async (email: string, password: string) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log('User signed in!');
    })
    .catch(error => {console.error(error);});
}

// Logout
const logoutAsync = async () => {
  await auth().signOut();
}


// Sets user data in Firestore Database
const setUserDataAsync = async (user: IUser) => {
  try {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .set(user);
    console.log(`User: ${user.name} saved correctly.`);
    return true;
  } catch {
    console.log(`Failed to save to datastore: ${user.name}`);
    return false;
  }
}

// Gets user data from firebase
const getUserDataAsync = async (uid: string) => {
  return firestore().collection('users').doc(uid).get()
    .then(result => {
      return utility.mapDocumentDataToUser(result.data());
    })
    .catch((ex) => {
      console.log(ex);
      return utility.createEmptyUserObject();
    })
}

/*
  The returned Promise<task> can be used to measure upload progress, pause, and resume
  task.on('state_changed', taskSnapshot => {
    console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
  });

  task.then(() => {
    console.log('Image uploaded to the bucket!');
  });

  task.pause();

  task.resume();
*/
// Receipt functions
const addReceiptAsync = async (uid: string, path: string, newFileName: string) => {
  const reference = storage().ref(`/users/${uid}/receipts/${newFileName}`);
  return reference.putFile(path);
}

const listReceiptsAsync = async (uid: string) => {
  const reference = storage().ref(`/users/${uid}/receipts`);
  const result = await reference.list();
  return result.items.map(ref => ref.fullPath);
}

const downloadReceiptAsync = async (uid: string, fileName: string) => {
  const url = await storage().ref(`/users/${uid}/receipts/${fileName}`).getDownloadURL();
  return url;
}

const deleteReceiptAsync = async (uid: string, fileName: string) => {
  const reference = storage().ref(`/users/${uid}/receipts/${fileName}`);
  await reference.delete();
}

export interface IFirebaseWrapper {
  loginAsync: (email: string, password: string) => Promise<void>,
  logoutAsync: () => Promise<void>,
  createAuthenticatedUserAsync: (email: string, password: string, name: string) => Promise<IUser | null>,
  setUserDataAsync: (user: IUser) => Promise<Boolean>,
  getUserDataAsync: (uid: string) => Promise<IUser>,
  addReceiptAsync: (uid: string, path: string, newFileName: string) => Promise<FirebaseStorageTypes.TaskSnapshot>,
  listReceiptsAsync: (uid: string) => Promise<string[]>,
  downloadReceiptAsync: (uid: string, fileName: string) => Promise<string>,
  deleteReceiptAsync: (uid: string, fileName: string) => void,
}

const firebase: IFirebaseWrapper = {
  loginAsync,
  logoutAsync,
  createAuthenticatedUserAsync,
  setUserDataAsync,
  getUserDataAsync,
  addReceiptAsync,
  listReceiptsAsync,
  downloadReceiptAsync,
  deleteReceiptAsync,
}

export default firebase;