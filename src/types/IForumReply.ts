/* eslint-disable semi */
import IForumItem from "./IForumItem";
import IForumPost from "./IForumPost";

export default interface IForumReply extends IForumItem {
  post?: IForumPost
}