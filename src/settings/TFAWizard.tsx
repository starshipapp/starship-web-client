import { useMutation } from "@apollo/client";
import { Classes, Code, DialogStep, H1, H3, Intent, MultistepDialog, NonIdealState, Spinner } from "@blueprintjs/core";
import QRCode from "qrcode.react";
import React, { useState } from "react";
import confirmTFAMutation, { IConfirmTFAMutation } from "../graphql/mutations/users/confirmTFAMutation";
import generateTOTPSecretMutation, { IGenerateTOTPSecretMutationData } from "../graphql/mutations/users/generateTOTPSecretMutation";
import { GlobalToaster } from "../util/GlobalToaster";
import "./css/TFAWizard.css";

interface ITFAWizardProps {
  onComplete: () => void;
  onClose: () => void;
  isOpen: boolean
}

function TFAWizard(props: ITFAWizardProps): JSX.Element {
  const [page, setPage] = useState<string>("start");
  const [totpSecret, setSecret] = useState<string>("");
  const [backupCodes, setCodes] = useState<number[]>([]);
  const [codeTextbox, setTextbox] = useState<string>();
  const [generateTOTPSecret] = useMutation<IGenerateTOTPSecretMutationData>(generateTOTPSecretMutation);
  const [confirmTFA] = useMutation<IConfirmTFAMutation>(confirmTFAMutation);

  return (
    <MultistepDialog 
      title="2FA Setup" 
      className={Classes.DARK}
      isOpen={props.isOpen}
      onClose={() => {
        setSecret("");
        setPage("");
      }}
      onChange={(newStepId, prevStepId) => {
        setPage(newStepId.toString());
        if(newStepId.toString() === "qrCode" && prevStepId?.toString() === "start") {
          generateTOTPSecret().then((data) => {
            setSecret(data.data?.generateTOTPSecret ?? "");
          }).catch((err: Error) => {
            GlobalToaster.show({message: err.message, intent: Intent.DANGER});
            GlobalToaster.show({message: "Could not generate QR code. Closing dialog.", intent: Intent.DANGER});
          });
        }
        if(newStepId.toString() === "finished" && prevStepId?.toString() === "verify") {
          const codeNumber = Number(codeTextbox);
          if(codeNumber && !isNaN(codeNumber)) {
            confirmTFA({variables: {token: codeNumber}}).then((data) => {
              setCodes(data.data?.confirmTFA ?? []);
            }).catch((err: Error) => {
              GlobalToaster.show({message: err.message, intent: Intent.DANGER});
            });
          } else {
            GlobalToaster.show({message: "Invalid token.", intent: Intent.DANGER});
          }
        }
      }}
      backButtonProps={{disabled: page !== "verify"}}
    >
      <DialogStep
        id="start"
        title="Start"
        panel={<div className="TFAWizard-panel">
          {page !== "start" ? <TFAWizardStateWarning/> : <>
            <H1>2FA Setup</H1>
            <p>To begin enabling Two Factor Authentication, click the "Next" button.</p>
          </>}
        </div>}
      />
      <DialogStep 
        id="qrCode"
        title="Scan Code"
        panel={<div className="TFAWizard-panel">
          {page !== "qrCode" ? <TFAWizardStateWarning/> : <>
            {totpSecret !== "" ? <>
              <div className="TFAWizard-qrcode-container">
                <QRCode value={totpSecret} size={176}/>
                <div className="TFAWizard-qrcode-text">
                  <div className="TFAWizard-qrcode-header">Scan this QR code with your authenticator app.</div>
                  <div className="TFAWizard-qrcode-authenticator">
                    <span>Don't have one? We recommend </span>
                    <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2">Google Authenticator</a>
                    <span> or </span>
                    <a href="https://play.google.com/store/apps/details?id=org.shadowice.flocke.andotp">andOTP</a>
                    <span>.</span>
                  </div>
                  <div className="TFAWizard-qrcode-backuptext">
                    <span>If you can't scan the QR code, try using <a href={totpSecret}>this</a> URI.</span>
                  </div>
                  <div className="TFAWizard-qrcode-backuptext">
                    Click the next button when you're done.
                  </div>
                </div>
              </div>
            </> : <><Spinner/></>}
          </>}
        </div>}
      />
      <DialogStep
        id="verify"
        title="Verify"
        panel={<div className="TFAWizard-panel">
          {page !== "verify" ? <TFAWizardStateWarning/> : <>
            <div className="TFAWizard-qrcode-header">Enter the code from your authenticator app.</div>
            <div className="TFAWizard-qrcode-authenticator">To finish enabling two factor autentication, please type the code you see in your authenticator app.</div>
            <div className="TFAWizard-qrcode-backuptext">
              <input
                className={`${Classes.INPUT} ${Classes.LARGE} TFAWizard-verify-input`}
                placeholder="Authentication Code"
                onChange={(e) => setTextbox(e.target.value)}
                value={codeTextbox}
              />
            </div>
          </>}
        </div>}
      />
      <DialogStep
        id="finished"
        title="Backup Codes"
        panel={<div className="TFAWizard-panel">
          <div className="TFAWizard-qrcode-header">Two Factor Authentication is now enabled!</div>
          <div className="TFAWizard-qrcode-backuptext">
            If you lose your phone, or lose access to your authenticator app, you'll need these background codes:
          </div>
          <div className="TFAWizard-qrcode-backuptext">
            {backupCodes.map((value) => (<span>{value}, </span>))}
          </div>
        </div>}
      />
    </MultistepDialog>
  );
}


function TFAWizardStateWarning(): JSX.Element {
  return (
    <NonIdealState
      title="State error"
      description="The 2FA setup dialog has lost track of it's page state. Please reopen the dialog. If you see this error, you should submit a bug report to the offical Starship planet."
      icon="error"
    />
  );
}

export default TFAWizard;