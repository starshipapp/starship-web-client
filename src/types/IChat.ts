/* eslint-disable semi */
import IChannel from "./IChannel";
import IPlanet from "./IPlanet";
import IUser from "./IUser";

export default interface IChat {
  id: string;
  createdAt?: string;
  owner?: IUser;
  planet?: IPlanet;
  channel?: [IChannel];
  unread?: boolean;
  mentioned?: boolean;
}