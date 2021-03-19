import { useQuery } from "@apollo/client";
import { Button, ButtonGroup, Classes } from "@blueprintjs/core";
import React from "react";
import getAllReports, { IGetAllReportsData } from "../graphql/queries/admin/getAllReports";
import { reportObjectTypeStrings, reportTypeStrings } from "../util/reportTypes";
import "./css/GAdmin-page.css";
import "./css/GAdminReports.css";

function GAdminReports(): JSX.Element {
  const {data} = useQuery<IGetAllReportsData>(getAllReports, {variables: {startNumber: 0, count: 25}});

  return (
    <div className="GAdmin-page bp3-dark">
      <div className="GAdmin-page-header">Reports</div>
      <ButtonGroup className="GAdminReports-buttongroup">
        <Button icon="tag" text="Types" minimal={true} rightIcon="caret-down"/>
        <Button icon="search" text="Search" minimal={true} rightIcon="caret-down"/>
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
            </tr>
          </thead>
          {data?.allReports && <tbody>
          {data.allReports.map((value) => (<tr>
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
          </tr>))}  
        </tbody>}
        </table>
      </div>
    </div>
  );
}

export default GAdminReports;