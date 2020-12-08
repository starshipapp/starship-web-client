import { gql } from "@apollo/client";
import IWikiPage from "../../../../types/IWikiPage";

export interface IGetWikiPageData {
  wikiPage: IWikiPage
}

const getWikiPage = gql`
  query getWikiPage($id: ID!) {
    wikiPage(id: $id) {
      id
      wiki {
        id
      }
      content
      createdAt
      name
    }
  }
`;

export default getWikiPage;