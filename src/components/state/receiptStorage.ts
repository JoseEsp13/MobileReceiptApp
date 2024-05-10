import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import storage, { FirebaseStorageTypes } from '@react-native-firebase/storage';
import useAppContext from '../hooks/useAppContext';


const addReceiptAsync = async (uid: string, path: string, newFileName: string) => {
  const reference = storage().ref(`/users/${uid}/receipts/${newFileName}`);
  return reference.putFile(path);
}

const getReceiptsAsync = async (uid: string) => {

  const listFilesAndDirectories = (reference: FirebaseStorageTypes.Reference, pageToken: FirebaseStorageTypes.ListOptions["pageToken"]) => {
    return reference.list({ pageToken }).then((result: FirebaseStorageTypes.ListResult) => {
      // Loop over each item
      result.items.forEach(ref => {
        console.log(ref.fullPath);
      });
  
      if (result.nextPageToken) {
        return listFilesAndDirectories(reference, result.nextPageToken);
      }
  
      return Promise.resolve();
    });
  }

  const reference = storage().ref(`/users/${uid}/receipts`);

  listFilesAndDirectories(reference).then(() => {
    console.log('Finished listing');
  });
}

const deleteReceiptAsync = (groupName: string) => {
  if (user) {
    const usersCollection = firestore().collection('users');
    usersCollection.doc(user.uid);
  }
}
