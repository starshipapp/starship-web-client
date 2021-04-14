import IPlanet from "../../types/IPlanet";
import React, { useState } from "react";
import { Button, Callout, Classes, ControlGroup, Intent, Label, TextArea } from "@blueprintjs/core";
import "./css/AdminGeneral.css";
import { useMutation } from "@apollo/client";
import updateNameMutation, { IUpdateNameMutationData } from "../../graphql/mutations/planets/updateNameMutation";
import { GlobalToaster } from "../../util/GlobalToaster";
import togglePrivateMutation, { ITogglePrivateMutationData } from "../../graphql/mutations/planets/togglePrivateMutation";
import setDescriptionMutation, { ISetDescriptionMutationData } from "../../graphql/mutations/planets/setDescriptionMutation";

interface IAdminGeneralProps {
  planet: IPlanet
}

function AdminGeneral(props: IAdminGeneralProps): JSX.Element {
  const [nameTextboxContents, updateNameTextbox] = useState<string>(props.planet.name ?? "");
  const [descTextboxContents, updateDescTextbox] = useState<string>(props.planet.description ?? "");
  const [setName] = useMutation<IUpdateNameMutationData>(updateNameMutation);
  const [setDescription] = useMutation<ISetDescriptionMutationData>(setDescriptionMutation);
  const [togglePrivate] = useMutation<ITogglePrivateMutationData>(togglePrivateMutation);

  return (
    <div className="Admin bp3-dark">
      <div>
        <h2>General</h2>
        <div className="AdminGeneral-container">
          <Label>
            Name
            <input value={nameTextboxContents} className={Classes.INPUT + " AdminGeneral-label"} onChange={(e) => updateNameTextbox(e.target.value)} placeholder="Name" />
          </Label>
          <Button text="Save" className="AdminGeneral-margin-button" onClick={() => {
            setName({variables: {planetId: props.planet.id, name: nameTextboxContents}}).then(() => {
              GlobalToaster.show({message: "Succesfully changed name.", intent: Intent.SUCCESS});
            }).catch((err: Error) => {
              GlobalToaster.show({message: err.message, intent: Intent.DANGER});
            });
          }}/>
          <Label>
            Description
            <TextArea className={"AdminGeneral-description AdminGeneral-label"} value={descTextboxContents} onChange={(e) => updateDescTextbox(e.target.value)}/>
          </Label>
          <Button text="Save" className="AdminGeneral-margin-button" onClick={() => {
            setDescription({variables: {planetId: props.planet.id, description: descTextboxContents}}).then(() => {
              GlobalToaster.show({message: "Succesfully changed description.", intent: Intent.SUCCESS});
            }).catch((err: Error) => {
              GlobalToaster.show({message: err.message, intent: Intent.DANGER});
            });
          }}/>
          <Callout title="Danger Zone" intent={Intent.DANGER}>
            <div>
              These buttons make important changes to your planet. Make sure you know what you're doing before using them.
            </div>
            <Button 
              text={props.planet.private ? "Make this planet public" : "Make this planet private"} 
              intent={Intent.DANGER}
              className="AdminGeneral-upper-margin"
              onClick={() => {
                togglePrivate({variables: {planetId: props.planet.id}}).then((data) => {
                  GlobalToaster.show({message: `${props.planet.name as unknown as string} is now ${data.data?.togglePrivate.private ? "private" : "public"}.`, intent: Intent.SUCCESS});
                }).catch((err: Error) => {
                  GlobalToaster.show({message: err.message, intent: Intent.DANGER});
                });
              }}
            />
          </Callout>
        </div>
      </div>
    </div>
  );
}

export default AdminGeneral;