import gql from "graphql-tag";
import IUser from "../../../types/IUser";

export interface IUpdateProfileBioMutationData {
  updateProfileBio: IUser
}

const updateProfileBioMutation = gql`
  mutation UpdateProfileBio($bio: String!) {
    updateProfileBio(bio: $bio) {
      id
      profileBio
    }
  }
`;

export default updateProfileBioMutation;