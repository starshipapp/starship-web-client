/* eslint-disable semi */
import IForumItem from "./IForumItem";
import IForumReply from "./IForumReply";

export default interface IForumPost extends IForumItem {
  tags?: [string]
  replyCount?: number
  locked?: boolean
  replies?: {cursor: string, forumReplies: IForumReply[]}
}