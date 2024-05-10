export interface IFirestoreUser {
  uid: string,
  name: string,
  email: string,
  contacts: IFirestoreContact[],
  groups: IFirestoreGroup[]
}

export interface IFirestoreContact {
    name: string,
    email: string,
}

export interface IFirestoreGroup {
    name: string,
    contacts: IFirestoreContact[]
}

export interface INewUser {
  username: string,
  password: string,
  name: string,
  email: string
}

export interface IUpdateUser {
  uid: string
  name?: string,
  email?: string,
  contacts?: IFirestoreContact[],
  groups?: IFirestoreGroup[]
}