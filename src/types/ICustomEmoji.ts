/* eslint-disable semi */
import IPlanet from "./IPlanet";
import IUser from "./IUser";

export default interface ICustomEmoji {
  id: string,
  owner?: IUser,
  planet?: IPlanet,
  user?: IUser,
  name?: string,
  url?: string
}