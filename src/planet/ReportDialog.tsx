import { useMutation } from "@apollo/client";
import { useState } from "react";
import Button from "../components/controls/Button";
import Option from "../components/controls/Option";
import Dialog from "../components/dialog/Dialog";
import DialogBody from "../components/dialog/DialogBody";
import DialogHeader from "../components/dialog/DialogHeader";
import Toasts from "../components/display/Toasts";
import TextArea from "../components/input/TextArea";
import Label from "../components/text/Label";
import insertReportMutation, { IInsertReportMutationData } from "../graphql/mutations/reports/insertReportMutation";
import { reportObjectType, reportType } from "../util/reportTypes";

interface IReportDialogProps {
  objectType: reportObjectType,
  objectId: string,
  userId: string,
  onClose: () => void,
  isOpen: boolean
}

function ReportDialog(props: IReportDialogProps): JSX.Element {
  const [stateReportType, setReportType] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [insertReport] = useMutation<IInsertReportMutationData>(insertReportMutation);

  return (
    <Dialog
      onClose={props.onClose}
      open={props.isOpen}
    >
      <DialogBody>
        <DialogHeader>Report</DialogHeader>
        <Label>What are you reporting?</Label>
        <Option
          onClick={() => setReportType(reportType.HARASSMENT.toString())}
          checked={stateReportType === reportType.HARASSMENT.toString()}
        >Harassment</Option>
        <Option
          onClick={() => setReportType(reportType.COPYRIGHT.toString())}
          checked={stateReportType === reportType.COPYRIGHT.toString()}
        >Copyright Infringement</Option>
        <Option
          onClick={() => setReportType(reportType.ILLEGAL.toString())}
          checked={stateReportType === reportType.ILLEGAL.toString()}
        >Illegal Content</Option>
        <Option
          onClick={() => setReportType(reportType.SPAM.toString())}
          checked={stateReportType === reportType.SPAM.toString()}
        >Spam</Option>
        <Option
          onClick={() => setReportType(reportType.MALWARE.toString())}
          checked={stateReportType === reportType.MALWARE.toString()}
        >Malware</Option>
        <Option
          onClick={() => setReportType(reportType.NSFW.toString())}
          checked={stateReportType === reportType.NSFW.toString()}
        >NSFW</Option>
        <Label>What happened?</Label>
        <TextArea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
        <div className="flex mt-4">
          <Button
            className="ml-auto"
            onClick={() => {
              insertReport({variables: {
                objectType: props.objectType,
                objectId: props.objectId,
                reportType: Number(stateReportType),
                details,
                userId: props.userId
              }}).then(() => {
                Toasts.success("Thank you for your report. We will review it shortly.");
              }).catch((err: Error) => {
                Toasts.danger(err.message);
              });
              props.onClose();
            }}
          >Report</Button>
        </div>
      </DialogBody>
    </Dialog>
  );
}

export default ReportDialog;
