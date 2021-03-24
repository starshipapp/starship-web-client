import gql from "graphql-tag";
import IReport from "../../../types/IReport";

export interface ISolveReportMutationData {
  solveReport: IReport
}

const solveReportMutation = gql`
  mutation SolveReport($reportId: ID!) {
    solveReport(reportId: $reportId) {
      id
      solved
    }
  }
`;
export default solveReportMutation;