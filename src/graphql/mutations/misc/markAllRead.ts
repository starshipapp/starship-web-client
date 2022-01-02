import gql from "graphql-tag";

export interface IMarkAllReadMutationData {
  markAllRead: boolean
}

const markAllReadMutation = gql`
  mutation MarkAllRead {
    markAllRead
  }
`;

export default markAllReadMutation;