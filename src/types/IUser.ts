import IPlanet from "./IPlanet";

/* eslint-disable semi */
export default interface IUser {
  id: string,
  services: {password: {bcrypt: string}},
  username: string,
  createdAt: Date,
  profilePicture: string,
  emails: [{address: string, verified: boolean}],
  following: [IPlanet],
  memberOf: [IPlanet],
  banned: boolean,
  admin: boolean,
}
