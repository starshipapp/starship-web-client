import { useMutation } from "@apollo/client";
import { Button, Classes, Icon, Intent, Popover } from "@blueprintjs/core";
import React, { useState } from "react";
import removeComponentMutation, { IRemoveComponentMutationData } from "../../graphql/mutations/planets/removeComponentMutation";
import renameComponentMutation, { IRenameComponentMutationData } from "../../graphql/mutations/planets/renameComponentMutation";
import IPlanet from "../../types/IPlanet";
import { GlobalToaster } from "../../util/GlobalToaster";
import ComponentIndex from "../ComponentIndex";
import "./css/AdminComponents.css";

interface IAdminComponentProps {
  planet: IPlanet
}

function AdminComponent(props: IAdminComponentProps): JSX.Element {
  const [popoverId, setPopoverId] = useState<string>("");
  const [renameComponent] = useMutation<IRenameComponentMutationData>(renameComponentMutation);
  const [deleteComponent] = useMutation<IRemoveComponentMutationData>(removeComponentMutation);
  const [nameTextbox, setNameTextbox] = useState<string>("");

  const doRename = function(id: string) {
    renameComponent({variables: {planetId: props.planet.id, componentId: id, name: nameTextbox}}).then(() => {
      setPopoverId("");
    }).catch((err: Error) => {
      GlobalToaster.show({message: err.message, intent: Intent.DANGER});
    });
  };

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
                    <Icon className="AdminComponents-table-name-icon" icon="edit" onClick={() => {
                      setPopoverId(value.componentId);
                      setNameTextbox(value.name);
                    }}/>
                    <div className="menu-form">
                      <input
                        className={Classes.INPUT + " menu-input"}
                        onKeyDown={(e) => {e.key === "Enter" && doRename(value.componentId);}}
                        onChange={(e) => setNameTextbox(e.target.value)}
                        value={nameTextbox}
                      />
                      <Button text="Rename" className="menu-button" onClick={() => doRename(value.componentId)}/>
                    </div>
                  </Popover></td>
                  <td className="AdminComponents-table-action">
                    <Button intent="danger" className="AdminComponents-action-button" small={true} icon="trash" onClick={() => {
                      deleteComponent({variables: {planetId: props.planet.id, componentId: value.componentId}}).then(() => {
                        GlobalToaster.show({message: `Sucessfully deleted ${value.name}.`, intent: Intent.SUCCESS});
                      }).catch((err: Error) => {
                        GlobalToaster.show({message: err.message, intent: Intent.DANGER});
                      });
                    }}/>
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