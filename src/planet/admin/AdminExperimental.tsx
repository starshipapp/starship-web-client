import IPlanet from "../../types/IPlanet";
import React, { useState } from "react";
import "./css/AdminGeneral.css";
import "./css/AdminExperimental.css";
import { Button, Callout, Classes, Intent, TextArea } from "@blueprintjs/core";
import { useMutation } from "@apollo/client";
import setCSSMutation, { ISetCSSMutationData } from "../../graphql/mutations/planets/setCSSMutation";
import { GlobalToaster } from "../../util/GlobalToaster";

interface IAdminExperimentalProps {
  planet: IPlanet,
  forceStyling: boolean,
  enableStyling: (value: boolean) => void
}

function AdminExperimental(props: IAdminExperimentalProps): JSX.Element {
  const [cssTextboxContents, updateCSSTextbox] = useState<string>(props.planet.css as string);
  const [setCSS] = useMutation<ISetCSSMutationData>(setCSSMutation);

  return (
    <div className="Admin bp3-dark">
      <div>
        <h2>Experimental</h2>
        <div className="AdminGeneral-container">
          <Callout intent={Intent.DANGER} className="AdminExperimental-callout">
            <span>CSS support is currently experimental and you will not receive support if you break your planet using it.
            Make sure you know what you're doing.</span>
          </Callout>
          {!props.forceStyling && <Callout intent={Intent.WARNING} className="AdminExperimental-callout">
            <span>CSS is disabled on the admin panel by default, so that if you break the planet you can repair your stylesheet.</span>
            <Button small={true} minimal={true} className="AdminExperimental-callout-button" intent={Intent.WARNING} text="Enable admin styles" onClick={() => props.enableStyling(true)}/>
          </Callout>}
          <Callout intent={Intent.WARNING} className="AdminExperimental-callout">
            Neither our stylesheet or our UI framework's are meant to do this: you may need to use !important very often.
          </Callout>
          <TextArea className={Classes.FILL + " AdminExperimental-textarea"} value={cssTextboxContents} onChange={(e) => updateCSSTextbox(e.target.value)}/>
          <Button text="Save" className="AdminExperimental-css-save" onClick={() => {
            setCSS({variables: {planetId: props.planet.id, css: cssTextboxContents}}).then(() => console.log("b")).catch((e: Error) => {
              GlobalToaster.show({message: e.message, intent: Intent.DANGER});
            });
          }}/>
        </div>
      </div>
    </div>
  );
}

export default AdminExperimental;