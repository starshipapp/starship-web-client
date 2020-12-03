import IUser from "./IUser";

/* eslint-disable semi */
export default interface IReport {
  id: string,
  owner?: IUser,
  createdAt?: Date,
  objectType?: number,
  objectId?: string,
  reportType?: number,
  details?: string,
  user?: IUser,
  solved?: boolean
}