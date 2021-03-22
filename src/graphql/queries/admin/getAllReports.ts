import gql from "graphql-tag";
import IReport from "../../../types/IReport";

export interface IGetAllReportsData {
  allReports: IReport[]
}

const getAllReports = gql`
  query getAllReports($startNumber: Int!, $count: Int!) {
    allReports(startNumber: $startNumber, count: $count) {
      id
      owner {
        id
        username
        profilePicture
        createdAt
        banned
        admin
      }
      createdAt
      objectType
      reportType
      user {
        id
        username
        profilePicture
        createdAt
        banned
        admin
      }
      solved
      details
      objectId
    }
  }
`;

export default getAllReports;