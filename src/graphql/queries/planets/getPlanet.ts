import { gql } from '@apollo/client';
import IPlanet from '../../../types/IPlanet';

export interface IGetPlanetData {
  planet: IPlanet
}

const getPlanet = gql`
  query getPlanet($planet: ID!) {
    planet(id: $planet) {
      id
      name
      createdAt
      owner {
        id
        username
      }
      private
      followerCount
      components {
        name
        componentId
        type
      }
      homeComponent {
        componentId
        type
      }
      verified
      partnered
      featured
      featuredDescription
      members {
        id
        username
      }
      banned {
        id
      }
      invites {
        id
      }
      css
      description
      customEmojis {
        id
        name
        url
      }
    }
  }
`;

export default getPlanet;
