/* eslint-disable semi */
import IForumPost from "./IForumPost";
import IPlanet from "./IPlanet";
import IUser from "./IUser";

export default interface IForum {
  id: string,
  createdAt?: string,
  owner?: IUser,
  updatedAt?: string,
  planet?: IPlanet,
  stickiedPosts?: IForumPost[],
  posts?: {cursor: string, forumPosts: IForumPost[]},
  tags?: string[]
}