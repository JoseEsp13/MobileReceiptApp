export interface IUser {
  uid: string,
  name: string,
  email: string,
  contacts: IContact[],
  groups: IGroup[]
}

export interface IContact {
  id: number,
  name: string,
  email: string,
}

export interface IGroup {
  id: number,
  name: string,
  contacts: IContact[]
}
