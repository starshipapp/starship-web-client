import { gql } from '@apollo/client';
import IPage from '../../../types/IPage';

export interface IGetPageData {
  page: IPage
}

const getPage = gql`
  query getPage($page: ID!) {
    page(id: $page) {
      id
      createdAt
      updatedAt
      content
      planet {
        id
      }
    }
  }
`;

export default getPage;