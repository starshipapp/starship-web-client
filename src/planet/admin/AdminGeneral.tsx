import IPlanet from "../../types/IPlanet";
import React, { useState } from "react";
import { Button, Classes, ControlGroup, Intent, Label } from "@blueprintjs/core";
import "./css/AdminGeneral.css";

interface IAdminGeneralProps {
  planet: IPlanet
}

function AdminGeneral(props: IAdminGeneralProps): JSX.Element {
  const [nameTextboxContents, updateNameTextbox] = useState<string>(props.planet.name);

  return (
    <div className="Admin bp3-dark">
      <div>
        <h2>General</h2>
        <div className="AdminGeneral-container">
          <Label>
            Name
            <ControlGroup className="dumb-workaround-fcg-padding">
              <input className={Classes.INPUT + " dumb-workaround-for-control-group"} value={nameTextboxContents} onChange={(e) => updateNameTextbox(e.target.value)} placeholder="Placeholder text" />
              <Button text="Save"/>
            </ControlGroup>
          </Label>
          <Button text={props.planet.private ? "Make this planet public" : "Make this planet private"} intent={Intent.DANGER} className="AdminGeneral-margin-button"/>
        </div>
      </div>
    </div>
  );
}

export default AdminGeneral;