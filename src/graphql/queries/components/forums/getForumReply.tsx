import gql from "graphql-tag";
import IForumReply from "../../../../types/IForumReply";

export interface IGetForumReplyData {
  forumReply: IForumReply
}

const getForumReply = gql`
  query GetForumReply($id: ID!) {
    forumReply(id: $id) {
      id
      createdAt
      content
      planet {
        id
      }
      component {
        id
      }
      post {
        id
      }
    }
  }
`;

export default getForumReply;