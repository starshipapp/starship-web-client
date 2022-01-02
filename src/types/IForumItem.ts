/* eslint-disable semi */
import IForum from "./IForum";
import IPlanet from "./IPlanet";
import IUser from "./IUser";

export default interface IForumItem {
  id: string
  name?: string
  component?: IForum
  content?: string
  owner?: IUser
  planet?: IPlanet
  stickied?: boolean
  reactions?: [{emoji: string, reactors: string[]}]
  createdAt?: string
  updatedAt?: string
  mentions?: IUser[]
}