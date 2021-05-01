import { gql } from '@apollo/client';
import IPlanet from '../../../types/IPlanet';

export interface IGetSearchForPlanetsData {
  searchForPlanets: IPlanet[]
}

const getSearchForPlanets = gql`
  query getSearchForPlanets($searchText: String!) {
    searchForPlanets(searchText: $searchText) {
      id
      name
      followerCount
      description
    }
  }
`;

export default getSearchForPlanets;