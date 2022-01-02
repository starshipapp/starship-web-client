import { useMutation } from "@apollo/client";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/controls/Button";
import Dialog from "../components/dialog/Dialog";
import DialogBody from "../components/dialog/DialogBody";
import DialogHeader from "../components/dialog/DialogHeader";
import Toasts from "../components/display/Toasts";
import Intent from "../components/Intent";
import solveReportMutation, { ISolveReportMutationData } from "../graphql/mutations/admin/solveReportMutation";
import IReport from "../types/IReport";
import fixPFP from "../util/fixPFP";
import { reportObjectType, reportTypeStrings } from "../util/reportTypes";
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
    <Dialog
      onClose={() => props.onClose()}
      open={props.open}
    >
      <DialogBody className="relative">
        <DialogHeader>{reportTypeStrings[props.report.reportType ?? 0]}</DialogHeader>
        <div className="text-gray-600 dark:text-gray-300">{props.date}</div>
        <div className="absolute top-6 right-6">
          <Button
            icon={faCheckCircle}
            intent={Intent.SUCCESS}
            onClick={() => {
              solve({variables: {reportId: props.report.id}}).then(() => {
                Toasts.success("Report solved");
              }).catch((error: Error) => {
                Toasts.danger(error.message);
              });
            }}
          >{props.report.solved ? "Solved" : "Solve"}</Button>
        </div>
        <div>
          <h3>Reporter</h3>
          <div className="flex mt-2">
            <div className="h-6 w-6 mr-2 overflow-hidden rounded">
              {props.report.owner?.profilePicture && <img alt="pfp" src={`${fixPFP(props.report.owner.profilePicture)}?t=${Number(Date.now())}`}/>}
            </div>
            <div className="font-bold text-document my-auto mr-2 leading-none">
              {props.report.owner?.username}
            </div>
            <div className="text-gray-600 dark:text-gray-300 my-auto leading-none">
              {new Date(Number(props.report.owner?.createdAt)).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
        </div>
        <div className="mt-2">
          <h3>Reportee</h3>
          <div className="flex mt-2">
            <div className="h-6 w-6 mr-2 overflow-hidden rounded">
              {props.report.user?.profilePicture && <img alt="pfp" src={`${fixPFP(props.report.user.profilePicture)}?t=${Number(Date.now())}`}/>}
            </div>
            <div className="font-bold text-document my-auto mr-2 leading-none">
              {props.report.user?.username}
            </div>
            <div className="text-gray-600 dark:text-gray-300 my-auto leading-none">
              {new Date(Number(props.report.user?.createdAt)).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
        </div>
        <div className="mt-2 mb-2">
          <h3>Details</h3> 
          <div className="mt-2">
            {props.report.details}
          </div>
        </div>
        {props.report.objectType === reportObjectType.FORUMPOST && <ForumPostObject id={props.report.objectId ?? ""}/>}
        {props.report.objectType === reportObjectType.FILE && <FileObject id={props.report.objectId ?? ""}/>}
        {props.report.objectType === reportObjectType.PLANET && <PlanetObject id={props.report.objectId ?? ""}/>}
        {props.report.objectType === reportObjectType.FORUMREPLY && <ForumReplyObject id={props.report.objectId ?? ""}/>}
      </DialogBody>
    </Dialog>
  );
}

export default Report;
