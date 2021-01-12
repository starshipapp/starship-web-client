import { gql } from "@apollo/client";
import IForum from "../../../../types/IForum";

export interface IRemoveForumTagMutationData {
  removeForumTag: IForum
}

const removeForumTagMutation = gql`
  mutation RemoveForumTag($forumId: ID!, $tag: String!) {
    removeForumTag(forumId: $forumId, tag: $tag) {
      id
      tags
    }
  }
`;

export default removeForumTagMutation;