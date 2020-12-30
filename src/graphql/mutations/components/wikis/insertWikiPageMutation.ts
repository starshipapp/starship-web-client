import { gql } from "@apollo/client";
import IWikiPage from "../../../../types/IWikiPage";

export interface IInsertWikiPageData {
  insertWikiPage: IWikiPage
}

const insertWikiPageMutation = gql`
  mutation InsertWikiPage($wikiId: ID!, $content: String!, $name: String!) {
    insertWikiPage(wikiId: $wikiId, content: $content, name: $name) {
      id
      name
    }
  }
`;

export default insertWikiPageMutation;