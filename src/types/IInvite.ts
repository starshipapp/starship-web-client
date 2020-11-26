/* eslint-disable semi */
import IPlanet from "./IPlanet";
import IUser from "./IUser";

export default interface IInvite {
  id: string,
  planet?: IPlanet,
  owner?: IUser,
  createdAt?: Date
}
