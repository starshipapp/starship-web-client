import { useMutation } from "@apollo/client";
import { Intent, Spinner } from "@blueprintjs/core";
import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import activateEmailMutation, { IActivateEmailMutationData } from "../graphql/mutations/users/activateEmailMutation";
import { GlobalToaster } from "../util/GlobalToaster";

let activationStarted = false;

interface IActivationParams {
  activationdata: string
}

function Activate(): JSX.Element {
  const [activateEmail] = useMutation<IActivateEmailMutationData>(activateEmailMutation);
  const { activationdata } = useParams<IActivationParams>();
  const history = useHistory();

  useEffect(() => {
    if(!activationStarted) {
      activationStarted = true;
      const activationDataSplit = activationdata.split(":token:");
      if(activationDataSplit.length !== 2) {
        GlobalToaster.show({message: "Invalid activation token.", intent: Intent.DANGER});
        return;
      }
      activateEmail({variables: {userId: activationDataSplit[0], token: activationDataSplit[1]}}).then(() => {
        history.push("/login");
        GlobalToaster.show({message: "Sucessfully activated account. You may now login.", intent: Intent.SUCCESS});
      }).catch((error: Error) => {
        GlobalToaster.show({message: error.message, intent: Intent.DANGER});
      });
    }
  });

  return (
    <div className="Login">
      <div className="Login-container">
        <div className="Login-center">
          <Spinner/>
        </div>
      </div>
    </div>
  );
}

export default Activate;