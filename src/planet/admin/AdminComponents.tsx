import { Button, Classes, Icon, Popover } from "@blueprintjs/core";
import React, { useState } from "react";
import IPlanet from "../../types/IPlanet";
import ComponentIndex from "../ComponentIndex";
import "./css/AdminComponents.css";

interface IAdminComponentProps {
  planet: IPlanet
}

function AdminComponent(props: IAdminComponentProps): JSX.Element {
  const [popoverId, setPopoverId] = useState<string>("");

  return (
    <div className="Admin bp3-dark">
      <div>
        <h2>Components</h2>
        <div className="AdminComponents-container">
          <table className="AdminComponents-table">
            <tbody>
              {props.planet.components?.map((value) => (
                <tr key={value.componentId}>
                  <td className="AdminComponents-table-name"><Icon className="AdminComponents-table-name-icon" icon={ComponentIndex.ComponentDataTypes[value.type].icon}/> {value.name} <Popover isOpen={popoverId === value.componentId} onClose={() => setPopoverId("")}>
                    <Icon className="AdminComponents-table-name-icon" icon="edit" onClick={() => setPopoverId(value.componentId)}/>
                    <div className="menu-form">
                      <input className={Classes.INPUT + " menu-input"} onKeyDown={(e) => {e.key === "Enter" && setPopoverId("");}}/>
                      <Button text="Rename" className="menu-button"/>
                    </div>
                  </Popover></td>
                  <td className="AdminComponents-table-action">
                    <Button intent="danger" className="AdminComponents-action-button" small={true} icon="trash"/>
                    {/* ComponentIndex.ComponentDataTypes[value.type].settingsComponent? && <Button small={true} className="AdminComponents-action-button" icon="settings"/>*/}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminComponent;