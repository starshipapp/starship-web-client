import { gql } from "@apollo/client";
import IForum from "../../../../types/IForum";

export interface IGetForumData {
  forum: IForum
}

const getForum = gql`
  query getForum($forumId: ID!, $cursor: String, $sortMethod: String, $count: Int) {
    forum(id: $forumId) {
      id
      owner {
        id
        username
      }
      planet {
        id
      }
      tags
      stickiedPosts {
        id
        name
        owner {
          id
          username
        }
        planet {
          id
        }
        tags
        replyCount
        stickied
        locked
        createdAt
        updatedAt
      }
      posts(cursor: $cursor, sortMethod: $sortMethod, limit: $count) {
        cursor
        forumPosts {
          id
          name
          owner {
            id
            username
          }
          planet {
            id
          }
          tags
          replyCount
          stickied
          locked
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export default getForum;