import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { IUser } from "../state/IFirebaseDocument"

const createEmptyUserObject = () => ({
  uid: "",
  name: "",
  email: "",
  contacts: [],
  groups:[]
})

// Helper function to map Firestore document data to our internal IUser type
const mapDocumentDataToUser = (data: FirebaseFirestoreTypes.DocumentData | undefined): IUser => ({
  uid: data?.uid ?? "",
  name: data?.name ?? "",
  email: data?.email ?? "",
  contacts: data?.contacts ?? [],
  groups: data?.groups ?? []
})

interface IUtility {
  createEmptyUserObject: () => IUser
  mapDocumentDataToUser: (data: FirebaseFirestoreTypes.DocumentData | undefined) => IUser
}

const utility: IUtility = {
  createEmptyUserObject,
  mapDocumentDataToUser
}

export default utility;