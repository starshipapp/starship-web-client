import { gql } from '@apollo/client';
import IPlanet from '../../../types/IPlanet';

export interface IGetFeaturedPlanetsData {
  featuredPlanets: IPlanet[]
}

const getFeaturedPlanets = gql`
  query getFeaturedPlanets {
    featuredPlanets {
      id
      name
      followerCount
      featuredDescription
    }
  }
`;

export default getFeaturedPlanets;