import IPlanet from "../../types/IPlanet";
import React, { useState } from "react";
import { Alert, Button, Callout, Classes, Intent, Label, TextArea } from "@blueprintjs/core";
import "./css/AdminGeneral.css";
import { useMutation, useQuery } from "@apollo/client";
import updateNameMutation, { IUpdateNameMutationData } from "../../graphql/mutations/planets/updateNameMutation";
import { GlobalToaster } from "../../util/GlobalToaster";
import togglePrivateMutation, { ITogglePrivateMutationData } from "../../graphql/mutations/planets/togglePrivateMutation";
import setDescriptionMutation, { ISetDescriptionMutationData } from "../../graphql/mutations/planets/setDescriptionMutation";
import getCurrentUser, { IGetCurrentUserData } from "../../graphql/queries/users/getCurrentUser";
import deletePlanetMutation, { IDeletePlanetMutationData } from "../../graphql/mutations/planets/deletePlanetMutation";
import { useHistory } from "react-router";

interface IAdminGeneralProps {
  planet: IPlanet
}

function AdminGeneral(props: IAdminGeneralProps): JSX.Element {
  const history = useHistory();
  const {refetch} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const [nameTextboxContents, updateNameTextbox] = useState<string>(props.planet.name ?? "");
  const [descTextboxContents, updateDescTextbox] = useState<string>(props.planet.description ?? "");
  const [verifyTextboxContents, updateVerifyTextbox] = useState<string>("");
  const [isOpen, setOpen] = useState<boolean>(false);
  const [openType, setType] = useState<string>("");
  const [setName] = useMutation<IUpdateNameMutationData>(updateNameMutation);
  const [setDescription] = useMutation<ISetDescriptionMutationData>(setDescriptionMutation);
  const [togglePrivate] = useMutation<ITogglePrivateMutationData>(togglePrivateMutation);
  const [deletePlanet] = useMutation<IDeletePlanetMutationData>(deletePlanetMutation);

  const doVerify = function() {
    if(verifyTextboxContents === props.planet.name) {
      if(openType === "private") {
        togglePrivate({variables: {planetId: props.planet.id}}).then((data) => {
          GlobalToaster.show({message: `${props.planet.name ?? ""} is now ${data.data?.togglePrivate.private ? "private" : "public"}.`, intent: Intent.SUCCESS});
        }).catch((err: Error) => {
          GlobalToaster.show({message: err.message, intent: Intent.DANGER});
        });
      } else if(openType === "delete") {
        deletePlanet({variables: {planetId: props.planet.id}}).then(async () => {
          GlobalToaster.show({message: `Sucessfully deleted ${props.planet.name ?? ""}`, intent: Intent.DANGER});
          await refetch();
          history.push("/");
        }).catch((err: Error) => {
          GlobalToaster.show({message: err.message, intent: Intent.DANGER});
        });
      }
      updateVerifyTextbox("");
    } else {
      GlobalToaster.show({message: "Please enter your planet's name.", intent: Intent.DANGER});
    }
  };

  return (
    <div className="Admin-page bp3-dark">
      <Alert
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        className={Classes.DARK + " AdminGeneral-verify-dialog"}
        canOutsideClickCancel={true}
        cancelButtonText="Cancel"
        confirmButtonText="Confirm"
        intent={Intent.DANGER}
        onConfirm={() => doVerify()}
      >
        <Callout className="AdminGeneral-verify-text" intent={Intent.WARNING}>
          {openType === "delete" && <span>You are about to <b>delete</b> your planet.</span>}
          {openType === "private" && <span>You are about to <b>set the visibility</b> of your planet.</span>}
        </Callout>
        <div className="AdminGeneral-verify-text">
          Please type <b>{props.planet.name}</b> to confirm:
        </div>
        <input 
          className={Classes.INPUT + " AdminGeneral-verify-input"} 
          placeholder={props.planet.name} 
          value={verifyTextboxContents} 
          onChange={(e) => updateVerifyTextbox(e.target.value)}
          onKeyDown={(e) => {
            if(e.key === "Enter") {
              doVerify();
            }
          }}
        />
      </Alert>
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
              text={props.planet.private ? `Make ${props.planet.name ?? "this planet"} public` : `Make ${props.planet.name ?? "this planet"} private`} 
              intent={Intent.DANGER}
              className="AdminGeneral-upper-margin"
              onClick={() => {
                setOpen(true);
                setType("private");
              }}
            /><br/>
            <Button 
              text={`Delete ${props.planet.name ?? "this planet"}`} 
              intent={Intent.DANGER}
              className="AdminGeneral-upper-margin"
              onClick={() => {
                setOpen(true);
                setType("delete");
              }}
            />
          </Callout>
        </div>
      </div>
    </div>
  );
}

export default AdminGeneral;