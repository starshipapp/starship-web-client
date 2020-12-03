import { useMutation } from "@apollo/client";
import { AnchorButton, Classes, Dialog, Intent, Label, Radio, RadioGroup, TextArea } from "@blueprintjs/core";
import React, { useState } from "react";
import insertReportMutation, { IInsertReportMutationData } from "../graphql/mutations/reports/insertReportMutation";
import { GlobalToaster } from "../util/GlobalToaster";
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

  return (
    <Dialog className="bp3-dark" title="Report" onClose={props.onClose} isOpen={props.isOpen}>
      <div className={Classes.DIALOG_BODY}>
        <b>Abusing the form *will* get you banned.</b>
        <Label>
          <span className="ReportDialog-reasonlabel">Reason for report:</span>
          <RadioGroup selectedValue={stateReportType} onChange={(e) => setReportType(e.currentTarget.value)}>
            <Radio label="Harassment" value={String(reportType.HARASSMENT)}/>
            <Radio label="Copyright Infringement" value={String(reportType.COPYRIGHT)}/>
            <Radio label="Illegal Content" value={String(reportType.ILLEGAL)}/>
            <Radio label="Spam" value={String(reportType.SPAM)}/>
            <Radio label="Malware" value={String(reportType.MALWARE)}/>
            <Radio label="NSFW Content" value={String(reportType.NSFW)}/>
          </RadioGroup>
        </Label>
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
          }}/>
        </div>
      </div>
    </Dialog>
  );
}

export default ReportDialog;