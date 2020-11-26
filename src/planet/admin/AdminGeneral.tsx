import IPlanet from "../../types/IPlanet";
import React, { useState } from "react";
import { Button, Classes, ControlGroup, Intent, Label } from "@blueprintjs/core";
import "./css/AdminGeneral.css";
import { useMutation } from "@apollo/client";
import updateNameMutation, { IUpdateNameMutationData } from "../../graphql/mutations/planets/updateNameMutation";
import { GlobalToaster } from "../../util/GlobalToaster";
import togglePrivateMutation, { ITogglePrivateMutationData } from "../../graphql/mutations/planets/togglePrivateMutation";

interface IAdminGeneralProps {
  planet: IPlanet
}

function AdminGeneral(props: IAdminGeneralProps): JSX.Element {
  const [nameTextboxContents, updateNameTextbox] = useState<string>(props.planet.name);
  const [setName] = useMutation<IUpdateNameMutationData>(updateNameMutation);
  const [togglePrivate] = useMutation<ITogglePrivateMutationData>(togglePrivateMutation);

  return (
    <div className="Admin bp3-dark">
      <div>
        <h2>General</h2>
        <div className="AdminGeneral-container">
          <Label>
            Name
            <ControlGroup className="dumb-workaround-fcg-padding">
              <input className={Classes.INPUT + " dumb-workaround-for-control-group"} value={nameTextboxContents} onChange={(e) => updateNameTextbox(e.target.value)} placeholder="Placeholder text" />
              <Button text="Save" onClick={() => {
                setName({variables: {planetId: props.planet.id, name: nameTextboxContents}}).then(() => {
                  GlobalToaster.show({message: "Succesfully changed name.", intent: Intent.SUCCESS});
                }).catch((err: Error) => {
                  GlobalToaster.show({message: err.message, intent: Intent.DANGER});
                });
              }}/>
            </ControlGroup>
          </Label>
          <Button 
            text={props.planet.private ? "Make this planet public" : "Make this planet private"} 
            intent={Intent.DANGER}
            className="AdminGeneral-margin-button"
            onClick={() => {
              togglePrivate({variables: {planetId: props.planet.id}}).then((data) => {
                GlobalToaster.show({message: `${props.planet.name} is now ${data.data?.togglePrivate.private ? "private" : "public"}.`, intent: Intent.SUCCESS});
              }).catch((err: Error) => {
                GlobalToaster.show({message: err.message, intent: Intent.DANGER});
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminGeneral;