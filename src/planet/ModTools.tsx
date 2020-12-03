import React, { useState } from "react";
import { AnchorButton, Checkbox, Classes, Dialog, Intent, Label, TextArea } from "@blueprintjs/core";
import IPlanet from "../types/IPlanet";
import { useMutation } from "@apollo/client";
import applyModToolsMutation, { IApplyModToolsData } from "../graphql/mutations/planets/applyModToolsMutation";
import { GlobalToaster } from "../util/GlobalToaster";

interface IModToolsProps {
  planet: IPlanet
  onClose: () => void,
  isOpen: boolean
}

function ModTools(props: IModToolsProps): JSX.Element {
  const [featured, setFeatured] = useState<boolean>(props.planet.featured ?? false);
  const [verified, setVerified] = useState<boolean>(props.planet.verified ?? false);
  const [partnered, setPartnered] = useState<boolean>(props.planet.partnered ?? false);
  const [featuredText, setDescription] = useState<string>(props.planet.featuredDescription ?? "");
  const [applyModTools] = useMutation<IApplyModToolsData>(applyModToolsMutation);

  return (
    <Dialog className="bp3-dark" title={`Mod Tools for ${props.planet.name ?? "null"}`} onClose={props.onClose} isOpen={props.isOpen}>
      <div className={Classes.DIALOG_BODY}>
        <Checkbox checked={featured} label="Featured?" onChange={(e) => setFeatured(!featured)} />
        <Checkbox checked={verified} label="Verified?" onChange={(e) => setVerified(!verified)} />
        <Checkbox checked={partnered} label="Partnered?" onChange={(e) => setPartnered(!partnered)} />
        <Label>
          Feature Description
          <TextArea
            growVertically={true}
            className="ContentSpace-textarea"
            large={true}
            intent={Intent.PRIMARY}
            onChange={(e) => setDescription(e.target.value)}
            value={featuredText}
          />
        </Label>
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <AnchorButton text="Cancel" onClick={() => props.onClose()}/>
          <AnchorButton text="Apply" intent={Intent.PRIMARY} onClick={() => {
            applyModTools({variables: {
              planetId: props.planet.id,
              featured,
              verified,
              partnered,
              featuredDescription: featuredText
            }}).then(() => {
              GlobalToaster.show({message: "Sucessfully applied changes.", intent: Intent.SUCCESS});
            }).catch((err: Error) => {
              GlobalToaster.show({message: err.message, intent: Intent.DANGER});
            });
          }}/>
        </div>
      </div>
    </Dialog>
  );
}

export default ModTools;