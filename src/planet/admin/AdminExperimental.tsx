import IPlanet from "../../types/IPlanet";
import React, { useState } from "react";
import "./css/AdminGeneral.css";
import { Callout, Classes, Intent, TextArea } from "@blueprintjs/core";

interface IAdminExperimentalProps {
  planet: IPlanet
}

function AdminExperimental(props: IAdminExperimentalProps): JSX.Element {
  const [cssTextboxContents, updateCSSTextbox] = useState<string>(props.planet.name);

  return (
    <div className="Admin bp3-dark">
      <div>
        <h2>Experimental</h2>
        <div className="AdminGeneral-container">
          <Callout intent={Intent.DANGER}>
            CSS support is currently experimental and you will not receive support if you break your planet using it.
            Make sure you know what you're doing.
          </Callout>
          <Callout intent={Intent.WARNING}>
            CSS is disabled on the admin panel by default, so that if you break the planet you can repair your stylesheet.
          </Callout>
          <Callout intent={Intent.WARNING}>
            Neither our stylesheet or our UI's are meant to do this: you may need to use !important very often.
          </Callout>
          <TextArea className={Classes.FILL} value={cssTextboxContents} onChange={(e) => updateCSSTextbox(e.target.value)}/>
        </div>
      </div>
    </div>
  );
}

export default AdminExperimental;