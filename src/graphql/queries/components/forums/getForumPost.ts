import { gql } from "@apollo/client";
import IForumPost from "../../../../types/IForumPost";

export interface IGetForumPostData {
  forumPost: IForumPost
}

const getForumPost = gql`
  query getForumPost($id: ID!, $count: Int!, $cursor: String!) {
    forumPost(id: $id) {
      id
      name
      owner {
        id
        username
        profilePicture
        admin
        banned
        createdAt
      }
      reactions {
        emoji
        reactors
      }
      content
      tags
      replyCount
      sticked
      locked
      createdAt
      replies(limit: $count, cursor: $cursor) {
        id
        content
        owner {
          id
          username
          profilePicture
          admin
          banned
          createdAt
        }
        reactions {
          emoji
          reactors
        }
        sticked
        createdAt
        updatedAt
      }
    }
  }
`;

export default getForumPost;