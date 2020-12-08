import { gql } from "@apollo/client";
import IWiki from "../../../../types/IWiki";

export interface IGetWikiData {
  wiki: IWiki
}

const getWiki = gql`
  query getWiki($id: ID!) {
    wiki(id: $id) {
      id
      createdAt
      pages {
        id
        name
        createdAt
      }
    }
  }
`;

export default getWiki;