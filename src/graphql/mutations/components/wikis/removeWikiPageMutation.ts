import { gql } from "@apollo/client";
import IWikiPage from "../../../../types/IWikiPage";

export interface IRemoveWikiPageData {
  removeWikiPage: IWikiPage
}

const removeWikiPageMutation = gql`
  mutation RemoveWikiPage($pageId: ID!) {
    removeWikiPage(pageId: $pageId) {
      id
      pages {
        id
        name
        createdAt
      }
    }
  }
`;

export default removeWikiPageMutation;