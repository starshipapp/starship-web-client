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
import "./css/ReportDialog.css";

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

  console.log(stateReportType);
  console.log(reportType.HARASSMENT.toString());

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

  /* return (
    <Dialog className="bp3-dark" title="Report" onClose={props.onClose} isOpen={props.isOpen}>
      <div className={Classes.DIALOG_BODY}>
        <Callout intent={Intent.WARNING}>Abusing the report form may lead to a ban. Do not submit false reports.</Callout>
        <span className="ReportDialog-reasonlabel">Reason for report:</span>
        <RadioGroup selectedValue={stateReportType} onChange={(e) => setReportType(e.currentTarget.value)}>
            <Radio label="Harassment" value={String(reportType.HARASSMENT)}/>
            <Radio label="Copyright Infringement" value={String(reportType.COPYRIGHT)}/>
            <Radio label="Illegal Content" value={String(reportType.ILLEGAL)}/>
            <Radio label="Spam" value={String(reportType.SPAM)}/>
            <Radio label="Malware" value={String(reportType.MALWARE)}/>
            <Radio label="NSFW Content" value={String(reportType.NSFW)}/>
          </RadioGroup>
        <Label>
          Additional information:
          <TextArea className="ReportDialog-textarea" value={details} onChange={(e) => setDetails(e.target.value)}/>
        </Label>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <AnchorButton text="Report" intent={Intent.DANGER} onClick={() => {
            insertReport({variables: {
              objectType: props.objectType,
              objectId: props.objectId,
              reportType: Number(stateReportType),
              details,
              userId: props.userId
            }}).then(() => {
              GlobalToaster.show({message: "Your report has been received.", intent: Intent.SUCCESS});
            }).catch((err: Error) => {
              GlobalToaster.show({message: err.message, intent: Intent.DANGER});
            });
            props.onClose();
          }}/>
        </div>
      </div>
    </Dialog>
  );*/
}

export default ReportDialog;
