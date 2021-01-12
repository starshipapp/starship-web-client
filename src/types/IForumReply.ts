/* eslint-disable semi */
import IForum from "./IForum";
import IForumPost from "./IForumPost";
import IPlanet from "./IPlanet";
import IUser from "./IUser";

export default interface IForumReply {
  id: string,
  post?: IForumPost,
  component?: IForum,
  content?: string,
  owner?: IUser,
  planet?: IPlanet,
  reactions?: [{emoji: string, reactors: string[]}],
  stickied?: boolean,
  createdAt?: string,
  updatedAt?: string
}