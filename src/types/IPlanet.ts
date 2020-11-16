import IUser from "./IUser";

/* eslint-disable semi */
export default interface IPlanet {
  id: string,
  name: string,
  createdAt: Date,
  owner: string,
  private: boolean,
  followerCount: number,
  components: [{name: string, componentId: string, type: string}],
  homeComponent: {componentId: string, type: string},
  featured: boolean,
  verified: boolean,
  partnered: boolean,
  featuredDescription: string,
  members: [IUser]
}