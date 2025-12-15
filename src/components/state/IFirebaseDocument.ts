export interface IUser {
  uid: string,
  name: string,
  email: string,
  contacts: IContact[],
  groups: IGroup[]
}

export interface IGroup {
  id: number,
  name: string,
  bgColor: string,
  color: string,
  contacts: IContact[]
}

export interface IContact {
  id: number,
  name: string,
  email: string,
  phoneNumber: string,
  color: string,
  bgColor: string,
}
