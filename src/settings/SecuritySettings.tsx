import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import Option from "../components/controls/Option";
import Toasts from "../components/display/Toasts";
import Page from "../components/layout/Page";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import PageSubheader from "../components/layout/PageSubheader";
import disableTFAMutation, { IDisableTFAMutation } from "../graphql/mutations/users/disableTFAMutation";
import IUser from "../types/IUser";
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
    <Page>
      <PageContainer>
        <PageHeader>
          Security
        </PageHeader>
        <PageSubheader>Login</PageSubheader>
        <Option
          description="Use an authenticator app on your mobile device to confirm logins."
          onClick={() => {
            if(props.user.tfaEnabled) {
              setTFAPromptOpen(true);
            } else {
              setTFAOpen(true);
            }
          }}
          checked={props.user.tfaEnabled}
        >Two Factor Authentication</Option>
        <TFAPrompt 
          onSubmit={(key) => {
            console.log(key);
            disableTFA({variables: {token: key}}).then(() => {
              Toasts.success("Disabled two factor authentication.");
              props.refetch();
              setTFAPromptOpen(false);
            }).catch((err: Error) => {
              Toasts.danger(err.message);
            });
          }}
          onClose={() => {setTFAPromptOpen(false);}}
          isOpen={isTFAPromptOpen}
        />
        <TFAWizard isOpen={isTFAOpen} onClose={() => setTFAOpen(false)} onComplete={() => props.refetch()}/>
      </PageContainer>
    </Page>
  );
}

export default SecuritySettings;
