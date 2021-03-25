import { useMutation } from "@apollo/client";
import { Button, Dialog, Intent } from "@blueprintjs/core";
import React from "react";
import solveReportMutation, { ISolveReportMutationData } from "../graphql/mutations/admin/solveReportMutation";
import IReport from "../types/IReport";
import { GlobalToaster } from "../util/GlobalToaster";
import { reportObjectType, reportTypeStrings } from "../util/reportTypes";
import "./css/Report.css";
import FileObject from "./objects/FileObject";
import ForumPostObject from "./objects/ForumPostObject";
import ForumReplyObject from "./objects/ForumReplyObject";
import PlanetObject from "./objects/PlanetObject";
interface IReportProps {
  open: boolean
  report: IReport
  date: string
  onClose: () => void
}

function Report(props: IReportProps): JSX.Element {
  const [solve] = useMutation<ISolveReportMutationData>(solveReportMutation);
  return (
    <Dialog className="bp3-dark" title={`Report (${props.date})`} onClose={() => props.onClose()} isOpen={props.open}>
      <div className="Report-header">
        <div className="Report-header-text">
          {reportTypeStrings[props.report.reportType ?? 0]}
        </div>
        <div className="Report-header-date">
          {props.date}
        </div>
        <Button intent={Intent.SUCCESS} text={props.report.solved ? "Solved" : "Solve"} icon="tick" onClick={() => {
          solve({variables: {reportId: props.report.id}}).then(() => {
            GlobalToaster.show({message: "Marked report as solved.", intent: Intent.SUCCESS});
          }).catch((error: Error) => {
            GlobalToaster.show({message: error.message, intent: Intent.DANGER});
          });
        }}/>
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
      {props.report.objectType === reportObjectType.FILE && <FileObject id={props.report.objectId ?? ""}/>}
      {props.report.objectType === reportObjectType.PLANET && <PlanetObject id={props.report.objectId ?? ""}/>}
      {props.report.objectType === reportObjectType.FORUMREPLY && <ForumReplyObject id={props.report.objectId ?? ""}/>}
    </Dialog>
  );
}

export default Report;