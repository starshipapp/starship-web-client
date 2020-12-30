import { gql } from "@apollo/client";
import IWikiPage from "../../../../types/IWikiPage";

export interface IUpdateWikiPageData {
  updateWikiPage: IWikiPage
}

const updateWikiPageMutation = gql`
  mutation UpdateWikiPage($pageId: ID!, $newContent: String!) {
    updateWikiPage(pageId: $pageId, newContent: $newContent) {
      id
      content
    }
  }
`;

export default updateWikiPageMutation;