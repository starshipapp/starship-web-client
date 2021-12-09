import React, { useState } from "react";
import IPlanet from "../types/IPlanet";
import { useMutation } from "@apollo/client";
import applyModToolsMutation, { IApplyModToolsData } from "../graphql/mutations/planets/applyModToolsMutation";
import Dialog from "../components/dialog/Dialog";
import DialogBody from "../components/dialog/DialogBody";
import DialogHeader from "../components/dialog/DialogHeader";
import Option from "../components/controls/Option";
import Label from "../components/text/Label";
import TextArea from "../components/input/TextArea";
import Button from "../components/controls/Button";
import Toasts from "../components/display/Toasts";

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
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}
    >
      <DialogBody>
        <DialogHeader>
          Mod Tools
        </DialogHeader>
        <Option
          className="mt-2"
          checked={featured}
          description="Shows a planet on the featured list on the home page."
          onClick={() => setFeatured(!featured)}
        >Featured</Option>
        <Option
          checked={verified}
          description="Marks a planet as verified."
          onClick={() => setVerified(!verified)}
        >Verified</Option>
        <Option
          checked={partnered}
          description="Marks a planet as partnered."
          onClick={() => setPartnered(!partnered)}
        >Partnered</Option>
        <Label>Feature Description</Label>
        <TextArea
          value={featuredText}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full"
        />
        <Button
          className="ml-auto mt-4"
          onClick={() => {
            applyModTools({variables: {
              planetId: props.planet.id,
              featured,
              verified,
              partnered,
              featuredDescription: featuredText
            }}).then(() => {
              Toasts.success("Successfully applied changes.");
            }).catch((err: Error) => {
              Toasts.danger(err.message);
            });
          }}
        >Apply</Button>
      </DialogBody>
    </Dialog>
  );
}

export default ModTools;
