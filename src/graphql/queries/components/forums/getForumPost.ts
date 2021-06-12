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
        customEmojis {
          id
          name
          url
        }
      }
      reactions {
        emoji
        reactors
      }
      content
      planet {
        id
      }
      component {
        id
      }
      tags
      replyCount
      stickied
      locked
      createdAt
      mentions {
        id
      }
      replies(limit: $count, cursor: $cursor) {
        forumReplies {
          id
          content
          owner {
            id
            username
            profilePicture
            admin
            banned
            createdAt
            customEmojis {
              id
              name
              url
            }
          }
          reactions {
            emoji
            reactors
          }
          stickied
          createdAt
          updatedAt
          mentions {
            id
          }
        }
      }
    }
  }
`;

export default getForumPost;