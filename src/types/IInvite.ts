/* eslint-disable semi */
import IPlanet from "./IPlanet";
import IUser from "./IUser";

export default interface IInvite {
  _id: string,
  planet: IPlanet,
  owner: IUser,
  createdAt: Date
}
