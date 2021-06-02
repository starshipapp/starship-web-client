import { useMutation, useQuery } from "@apollo/client";
import { Button, Intent } from "@blueprintjs/core";
import React, { useState } from "react";
import disableTFAMutation, { IDisableTFAMutation } from "../graphql/mutations/users/disableTFAMutation";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import IUser from "../types/IUser";
import { GlobalToaster } from "../util/GlobalToaster";
import TFAPrompt from "../util/TFAPrompt";
import "./css/Settings.css";
import TFAWizard from "./TFAWizard";

interface ISecuritySettingsProps {
  user: IUser
  refetch: () => void
}

function SecuritySettings(props: ISecuritySettingsProps): JSX.Element {
  const [disableTFA] = useMutation<IDisableTFAMutation>(disableTFAMutation);
  const [isTFAOpen, setTFAOpen] = useState<boolean>(false);
  const [isTFAPromptOpen, setTFAPromptOpen] = useState<boolean>(false);

  return (
    <div className="Settings bp3-dark">
      <div className="Settings-container">
        <div className="Settings-page-header">
          Security
        </div>
        <h1>Two Factor Authentication</h1>
        <div className="Settings-tfa">
          <p>Two Factor Authentication <b>is{props.user.tfaEnabled && " not"}</b> enabled</p>
          {props.user.tfaEnabled && <Button onClick={() => setTFAOpen(true)}>Enable 2FA</Button>}
          {props.user.tfaEnabled && <Button onClick={() => setTFAPromptOpen(true)}>Disable 2FA</Button>}
          <TFAPrompt 
            onSubmit={(key) => {
              disableTFA({variables: {token: key}}).then(() => {
                GlobalToaster.show({message: "Disabled two factor authentication.", intent: Intent.SUCCESS});
                props.refetch();
                setTFAPromptOpen(false);
              }).catch((err: Error) => {
                GlobalToaster.show({message: err.message, intent: Intent.DANGER});
              });
            }}
            onClose={() => {setTFAPromptOpen(false);}}
            isOpen={isTFAPromptOpen}
          />
          <TFAWizard isOpen={isTFAOpen} onClose={() => setTFAOpen(false)} onComplete={() => props.refetch()}/>
        </div>
      </div>
    </div>
  );
}

export default SecuritySettings;