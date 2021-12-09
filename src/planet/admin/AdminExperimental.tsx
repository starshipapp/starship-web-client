import IPlanet from "../../types/IPlanet";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import setCSSMutation, { ISetCSSMutationData } from "../../graphql/mutations/planets/setCSSMutation";
import Callout from "../../components/text/Callout";
import Intent from "../../components/Intent";
import Button from "../../components/controls/Button";
import TextArea from "../../components/input/TextArea";
import Toasts from "../../components/display/Toasts";

interface IAdminExperimentalProps {
  planet: IPlanet,
  forceStyling: boolean,
  enableStyling: (value: boolean) => void
}

function AdminExperimental(props: IAdminExperimentalProps): JSX.Element {
  const [cssTextboxContents, updateCSSTextbox] = useState<string>(props.planet.css as string);
  const [setCSS] = useMutation<ISetCSSMutationData>(setCSSMutation);

  return (
    <div className="Admin-page bp3-dark">
      <div>
        <h2>Experimental</h2>
        <div className="AdminGeneral-container">
          <Callout intent={Intent.DANGER} className="my-2">
            <span>CSS support is currently experimental and you will not receive support if you break your planet using it.
            Make sure you know what you're doing.</span>
          </Callout>
          {!props.forceStyling && <Callout intent={Intent.WARNING} className="mb-2 flex">
            <div>CSS is disabled on the admin panel.</div>
          </Callout>}
          <Callout intent={Intent.WARNING} className="mb-2">
            As of 0.9, the CSS editor is not fully functional. This will be fixed in a future minor release.
          </Callout>
          <TextArea
            className="w-full"
            value={cssTextboxContents}
            onChange={(e) => updateCSSTextbox(e.target.value)}
          />
          <Button className="mt-3" onClick={() => {
            setCSS({variables: {planetId: props.planet.id, css: cssTextboxContents}}).then(() => {
              Toasts.success("Successfully saved CSS stylesheet.");
            }).catch((e: Error) => {
              Toasts.danger(e.message);
            });
          }}>Save</Button>
        </div>
      </div>
    </div>
  );
}

export default AdminExperimental;
