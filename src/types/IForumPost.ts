/* eslint-disable semi */
import IForum from "./IForum";
import IForumReply from "./IForumReply";
import IPlanet from "./IPlanet";
import IUser from "./IUser";

export default interface IForumPost {
  id: string,
  name?: string,
  component?: IForum,
  content?: string,
  owner?: IUser,
  planet?: IPlanet,
  tags?: [string],
  reactions?: [{emoji: string, reactors: string[]}],
  replyCount?: number,
  stickied?: boolean,
  locked?: boolean,
  createdAt?: string,
  updatedAt?: string,
  replies?: {cursor: string, forumReplies: IForumReply[]}
}