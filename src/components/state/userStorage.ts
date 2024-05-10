import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { IFirestoreUser, INewUser, IUpdateUser } from './IFirebase';

const createUserAsync = async (newUser: INewUser) => {
  return await auth()
  .createUserWithEmailAndPassword(newUser.username, newUser.password)
  .then(async credential => {
    console.log('User account created & signed in!');

    const newUserObject: IFirestoreUser = {
      uid: credential.user.uid,
      contacts: [],
      groups: [],
      ...newUser
    };

    // Attempt to create a document for this user.
    try {
      await firestore()
        .collection('users')
        .add(newUserObject);
      console.log(`User ${newUserObject.name}`);
      return true;
    } catch {
      return false;
    }
  })
  .catch(error => {
    if (error.code === 'auth/email-already-in-use') {
      console.log('That email address is already in use!');
    }

    if (error.code === 'auth/invalid-email') {
      console.log('That email address is invalid!');
    }

    console.error(error);
    return false;
  });
}

const getUserAsync = async (uid: string) => {
  return firestore()
    .collection('users')
    .doc(uid)
    .get();
}

const updateUserAsync = async (uid: string, updateObject: IUpdateUser) => {
  try {
    firestore()
      .collection('users')
      .doc(uid)
      .update({
        ...updateObject
      })
    return true;
  } catch {
    return false;
  }
}

const createGroup = (uid: string, groupName: string) => {
  const usersCollection = firestore().collection('users');
  usersCollection.doc(uid);
}
