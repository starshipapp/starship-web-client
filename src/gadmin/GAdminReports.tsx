import { useQuery } from "@apollo/client";
import { Button, ButtonGroup, Classes, Popover } from "@blueprintjs/core";
import React, { useState } from "react";
import getAllReports, { IGetAllReportsData } from "../graphql/queries/admin/getAllReports";
import { reportObjectTypeStrings, reportTypeStrings } from "../util/reportTypes";
import "./css/GAdmin-page.css";
import "./css/GAdminReports.css";
import Report from "./Report";

function GAdminReports(): JSX.Element {
  const [pageNumber, setPage] = useState<number>(0);
  const {data} = useQuery<IGetAllReportsData>(getAllReports, {variables: {startNumber: pageNumber * 25, count: 25}});
  const [openReport, setReport] = useState<string>("");

  return (
    <div className="GAdmin-page bp3-dark">
      <div className="GAdmin-page-header">Reports</div>
      <ButtonGroup minimal={true} className="GAdminReports-buttongroup">
        <Popover>
          <Button rightIcon="caret-down">Set Page</Button>
          <div className="menu-form">
            <input className={Classes.INPUT + " menu-input"} onChange={(e) => setPage(Number(e.target.value))} value={pageNumber}/>
          </div>
        </Popover>
      </ButtonGroup>
      <div className="GAdmin-page-container">
        <table className={`${Classes.HTML_TABLE} GAdminReports-table`}>
          <thead>
            <tr>
              <td>
                Reporter
              </td>
              <td>
                Reportee
              </td>
              <td>
                Type
              </td>
              <td>
                Reason
              </td>
              <td>
                Date
              </td>
              <td>
                Status
              </td>
            </tr>
          </thead>
          {data?.allReports && <tbody>
          {data.allReports.map((value) => (<>
            <Report 
              open={openReport === value.id} 
              date={new Date(Number(value.createdAt)).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              report={value}
              onClose={() => setReport("")}
            />
            <tr onClick={() => setReport(value.id)}>
              <td>
                {value.owner?.username}
              </td>
              <td>
                {value.user?.username}
              </td>
              <td>
                {reportObjectTypeStrings[value.objectType ?? 0]}
              </td>
              <td>
                {reportTypeStrings[value.reportType ?? 0]}
              </td>
              <td>
                {new Date(Number(value.createdAt)).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </td>
              <td>
                {value.solved ? "Solved" : "Open"}
              </td>
            </tr>
          </>))}  
        </tbody>}
        </table>
      </div>
    </div>
  );
}

export default GAdminReports;