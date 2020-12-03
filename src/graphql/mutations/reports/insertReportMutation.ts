import { gql } from "@apollo/client";
import IReport from "../../../types/IReport";

export interface IInsertReportMutationData {
  insertReport: IReport
}

const insertReportMutation = gql`
  mutation InsertReport($objectType: Int!, $objectId: ID!, $reportType: Int!, $details: String!, $userId: ID!) {
    insertReport(objectType: $objectType, objectId: $objectId, reportType: $reportType, details: $details, userId: $userId) {
      id
    }
  }
`;

export default insertReportMutation;