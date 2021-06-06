import ICustomEmoji from "./ICustomEmoji";
import IPlanet from "./IPlanet";

/* eslint-disable semi */
export default interface IUser {
  id: string,
  username?: string,
  createdAt?: Date,
  profilePicture?: string,
  profileBanner?: string,
  profileBio?: string,
  emails?: [{address: string, verified: boolean}],
  following?: [IPlanet],
  memberOf?: [IPlanet],
  banned?: boolean,
  admin?: boolean,
  usedBytes?: number,
  capWaived?: boolean,
  tfaEnabled?: boolean,
  online?: boolean,
  customEmojis?: [ICustomEmoji]
}
