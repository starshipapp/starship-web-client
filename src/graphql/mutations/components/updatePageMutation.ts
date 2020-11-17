import { gql } from "@apollo/client";
import IPage from "../../../types/IPage";

export interface IUpdatePageMutationData {
  updatePage: IPage
}

const updatePageMutation = gql`
  mutation UpdatePage($pageId: ID!, $content: String!) {
    updatePage(pageId: $pageId, content: $content) {
      id
      content
    }
  }
`;

export default updatePageMutation;