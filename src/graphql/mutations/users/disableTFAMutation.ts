import gql from "graphql-tag";

export interface IDisableTFAMutation {
  disableTFA: boolean
}

const disableTFAMutation = gql`
  mutation DisableTFA($token: Int!) {
    disableTFA(token: $token)
  } 
`;

export default disableTFAMutation;