import { useQuery } from "@apollo/client";
import { useState } from "react";
import Button from "../components/controls/Button";
import Divider from "../components/display/Divider";
import Textbox from "../components/input/Textbox";
import Page from "../components/layout/Page";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import List from "../components/list/List";
import ListItem from "../components/list/ListItem";
import getAllReports, { IGetAllReportsData } from "../graphql/queries/admin/getAllReports";
import { reportTypeStrings } from "../util/reportTypes";
import Report from "./Report";

function GAdminReports(): JSX.Element {
  const [pageNumber, setPage] = useState<number>(0);
  const {data} = useQuery<IGetAllReportsData>(getAllReports, {variables: {startNumber: pageNumber * 25, count: 25}});
  const [openReport, setReport] = useState<string>("");

  return (
    <Page>
      <PageContainer>
        <PageHeader>Reports</PageHeader>
        <List
          name="List of reports"
          actions={<div className="space-x-1">
            <Button small onClick={() => setPage(pageNumber - 1)}>Previous</Button>
            <Textbox small value={pageNumber.toString()} onChange={(e) => setPage(!isNaN(parseInt(e.target.value, 10)) ? parseInt(e.target.value, 10) : 0)} />
            <Button small onClick={() => setPage(pageNumber + 1)}>Next</Button>
          </div>}
        >
          {data?.allReports && data?.allReports.map((report) => (
            <ListItem
              key={report.id} 
              onClick={() => setReport(report.id)}
              className="w-full overflow-hidden max-w-full cursor-pointer"
              actions={<div className="flex flex-shrink-0 flex-grow">
                <div className="overflow-ellipsis overflow-hidden whitespace-nowrap flex-shrink block w-full">
                  {report.owner?.username}
                </div>
                <Divider/>
                <div>
                  {report.solved ? "Solved" : "Open"}
                </div>
              </div>}
            >
              <Report 
                open={openReport === report.id} 
                date={new Date(Number(report.createdAt)).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                report={report}
                onClose={() => setReport("")}
              />
              <div className="overflow-ellipsis overflow-hidden whitespace-nowrap flex-shrink block w-full">{report.user?.username} - {new Date(Number(report.createdAt)).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })} - {reportTypeStrings[report.reportType ?? 0]}</div>
            </ListItem>
          ))}
        </List>
      </PageContainer>
    </Page>
  );
}

export default GAdminReports;
