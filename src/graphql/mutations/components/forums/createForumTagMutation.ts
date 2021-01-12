import { gql } from "@apollo/client";
import IForum from "../../../../types/IForum";

export interface ICreateForumTagMutationData {
  createForumTag: IForum
}

const createForumTagMutation = gql`
  mutation CreateForumTag($forumId: ID!, $tag: String!) {
    createForumTag(forumId: $forumId, tag: $tag) {
      id
      tags
    }
  }
`;

export default createForumTagMutation;