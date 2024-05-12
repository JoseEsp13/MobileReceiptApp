import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import storage, { FirebaseStorageTypes } from '@react-native-firebase/storage';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { IUser } from './IFirebaseDocument';
import utility from '../util/utility';

const loginAsync = async (email: string, password: string) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log('User signed in!');
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

const logoutAsync = async () => {
  await auth().signOut();
}


// Create a new authenticated login
const createAuthenticatedAsync = async (email: string, password: string, name: string) => {
  return await auth()
    .createUserWithEmailAndPassword(email, password)
    .then(async credential => {
      console.log('User authentication created');

      const newUser: IUser = {
        uid: credential.user.uid,
        contacts: [],
        groups: [],
        name,
        email
      };

      await createUserAsync(newUser);
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

// Create a user datastore
const createUserAsync = async (user: IUser) => {
  try {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .set(user);
    console.log(`User ${user.name} datastore created`);
    return true;
  } catch {
    console.log(`Failed to create datstore for ${user.name}`);
    return false;
  }
}

const getUserAsync = async (uid: string) => {
  console.log(`Uid: ${uid}`)
  return firestore().collection('users').doc(uid).get()
    .then(result => {
      return utility.mapDocumentDataToUser(result.data());
    })
    .catch((ex) => {
      console.log(ex);
      return utility.createEmptyUserObject();
    })
}

const saveUserAsync = async (user: IUser) => {
  try {
    firestore()
      .collection('users')
      .doc(user.uid)
      .update({
        ...user
      })
    return true;
  } catch {
    return false;
  }
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

export interface IFirebase {
  loginAsync: (email: string, password: string) => Promise<void>,
  logoutAsync: () => Promise<void>,
  createAuthenticatedAsync: (email: string, password: string, name: string) => Promise<IUser | null>,
  addReceiptAsync: (uid: string, path: string, newFileName: string) => Promise<FirebaseStorageTypes.TaskSnapshot>,
  listReceiptsAsync: (uid: string) => Promise<string[]>,
  downloadReceiptAsync: (uid: string, fileName: string) => Promise<string>,
  deleteReceiptAsync: (uid: string, fileName: string) => void,
  saveUserAsync: (user: IUser) => Promise<Boolean>,
  createUserAsync: (user: IUser) => Promise<Boolean>,
  getUserAsync: (uid: string) => Promise<IUser>,
}

const firebase: IFirebase = {
  loginAsync,
  logoutAsync,
  createAuthenticatedAsync,
  addReceiptAsync,
  listReceiptsAsync,
  downloadReceiptAsync,
  deleteReceiptAsync,
  saveUserAsync,
  createUserAsync,
  getUserAsync,
}

export default firebase;