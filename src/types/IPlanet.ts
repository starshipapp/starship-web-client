import IInvite from "./IInvite";
import IUser from "./IUser";

/* eslint-disable semi */
export default interface IPlanet {
  id: string,
  name?: string,
  createdAt?: Date,
  owner?: IUser,
  private?: boolean,
  followerCount?: number,
  components?: [{name: string, componentId: string, type: string}],
  homeComponent?: {componentId: string, type: string},
  featured?: boolean,
  verified?: boolean,
  partnered?: boolean,
  featuredDescription?: string,
  members?: [IUser],
  banned?: [IUser],
  css?: string,
  invites?: [IInvite],
  description?: string
}