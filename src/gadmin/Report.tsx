import { Button, Dialog, H2, Intent } from "@blueprintjs/core";
import { report } from "process";
import React from "react";
import IReport from "../types/IReport";
import { reportObjectType, reportTypeStrings } from "../util/reportTypes";
import "./css/Report.css";
import ForumPostObject from "./objects/ForumPostObject";
interface IReportProps {
  open: boolean
  report: IReport
  date: string
  onClose: () => void
}

function Report(props: IReportProps): JSX.Element {
  return (
    <Dialog className="bp3-dark" title={`Report (${props.date})`} onClose={() => props.onClose()} isOpen={props.open}>
      <div className="Report-header">
        <div className="Report-header-text">
          {reportTypeStrings[props.report.reportType ?? 0]}
        </div>
        <div className="Report-header-date">
          {props.date}
        </div>
        <Button intent={Intent.SUCCESS} text="Solve" icon="tick"/>
      </div>
      <div className="Report-user">
        <div className="Report-user-label">
          Reportee
        </div>
        <div className="Report-user-content">
          <div className="Report-profilepic">
            {props.report.user?.profilePicture && <img alt="pfp" src={`${props.report.user?.profilePicture}?t=${Number(Date.now())}`}/>}
          </div>
          <div className="Report-username">
            {props.report.user?.username}
          </div>
          <div className="Report-userdate">
            {new Date(Number(props.report.user?.createdAt)).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>
      <div className="Report-user">
        <div className="Report-user-label">
          Reporter
        </div>
        <div className="Report-user-content">
          <div className="Report-profilepic">
            {props.report.owner?.profilePicture && <img alt="pfp" src={`${props.report.owner.profilePicture}?t=${Number(Date.now())}`}/>}
          </div>
          <div className="Report-username">
            {props.report.owner?.username}
          </div>
          <div className="Report-userdate">
            {new Date(Number(props.report.owner?.createdAt)).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>
      <div className="Report-user">
        <div className="Report-user-label">
          Details
        </div>
        <div className="Report-user-content">
          {props.report.details}
        </div>
      </div>
      {props.report.objectType === reportObjectType.FORUMPOST && <ForumPostObject id={props.report.objectId ?? ""}/>}
    </Dialog>
  );
}

export default Report;