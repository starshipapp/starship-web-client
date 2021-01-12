import { gql } from "@apollo/client";
import IForumPost from "../../../../types/IForumPost";

export interface IInsertForumPostMutationData {
  insertForumPost: IForumPost
}

const insertForumPostMutation = gql`
  mutation InsertForumPost($forumId: ID!, $name: String!, $content: String!, $tag: String) {
    insertForumPost(forumId: $forumId, name: $name, content: $content, tag: $tag) {
      id
      name
    }
  }
`;

export default insertForumPostMutation;