/* eslint-disable semi */
import IPlanet from "./IPlanet";
import IUser from "./IUser";

export default interface IPage {
  id: string,
  createdAt?: Date,
  owner?: IUser,
  updatedAt?: Date,
  planet?: IPlanet,
  content: string
}