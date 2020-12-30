import { gql } from "@apollo/client";
import IWikiPage from "../../../../types/IWikiPage";

export interface IRenameWikiPageData {
  renameWikiPage: IWikiPage
}

const renameWikiPageMutation = gql`
  mutation RenameWikiPage($pageId: ID!, $newName: String!) {
    renameWikiPage(pageId: $pageId, newName: $newName) {
      id
      name
    }
  }
`;

export default renameWikiPageMutation;