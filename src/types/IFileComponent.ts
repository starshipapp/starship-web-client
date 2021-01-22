/* eslint-disable semi */
import IPlanet from "./IPlanet";
import IUser from "./IUser";

export default interface IFileComponent {
  id: string,
  createdAt?: string,
  owner?: IUser,
  updatedAt?: string,
  planet?: IPlanet
}