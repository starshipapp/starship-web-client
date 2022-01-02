import { gql } from "@apollo/client";

export interface ICreateMultiObjectDownloadTicketMutationData {
  createMultiObjectDownloadTicket: string
}

const createMultiObjectDownloadTicketMutation = gql`
  mutation CreateMultiObjectDownloadTicket($objectIds: [ID]!, $zipName: String!) {
    createMultiObjectDownloadTicket(objectIds: $objectIds, zipName: $zipName)
  }
`;

export default createMultiObjectDownloadTicketMutation;
