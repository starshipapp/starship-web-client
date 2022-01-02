import { useMutation } from "@apollo/client";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Button from "../../components/controls/Button";
import Toasts from "../../components/display/Toasts";
import Textbox from "../../components/input/Textbox";
import Intent from "../../components/Intent";
import List from "../../components/list/List";
import ListItem from "../../components/list/ListItem";
import Popover from "../../components/overlays/Popover";
import PopperPlacement from "../../components/PopperPlacement";
import SubPageHeader from "../../components/subpage/SubPageHeader";
import removeComponentMutation, { IRemoveComponentMutationData } from "../../graphql/mutations/planets/removeComponentMutation";
import renameComponentMutation, { IRenameComponentMutationData } from "../../graphql/mutations/planets/renameComponentMutation";
import IPlanet from "../../types/IPlanet";
import ComponentIndex from "../ComponentIndex";

interface IAdminComponentProps {
  planet: IPlanet
}

function AdminComponent(props: IAdminComponentProps): JSX.Element {
  const [popoverId, setPopoverId] = useState<string>("");
  const [deletePopoverId, setDeleteId] = useState<string>("");
  const [renameComponent] = useMutation<IRenameComponentMutationData>(renameComponentMutation);
  const [deleteComponent] = useMutation<IRemoveComponentMutationData>(removeComponentMutation);
  const [nameTextbox, setNameTextbox] = useState<string>("");

  const doRename = function(id: string) {
    renameComponent({variables: {planetId: props.planet.id, componentId: id, name: nameTextbox}}).then(() => {
      Toasts.success(`Renamed component to ${nameTextbox} successfully.`);
      setPopoverId("");
    }).catch((err: Error) => {
      Toasts.danger(err.message);
    });
  };

  return (
    <div className="w-full">
      <SubPageHeader>Components</SubPageHeader>
      <List name={`${String(props.planet.components?.length) ?? "0"} components`}>
        {props.planet.components?.map((component) => (
          <ListItem
            icon={<div className="w-6 flex">
              <FontAwesomeIcon className="mx-auto" icon={ComponentIndex.ComponentDataTypes[component.type ?? "page"].icon}/>
            </div>}
            actions={<div className="flex">
              <Popover
                open={popoverId === component.componentId}
                onClose={() => setPopoverId("")}
                popoverTarget={<Button
                  small
                  icon={faEdit}
                  onClick={() => setPopoverId(component.componentId)}
                ></Button>}
              >
                <div className="flex">
                  <Textbox
                    placeholder="Name"
                    value={nameTextbox}
                    onChange={(e) => setNameTextbox(e.target.value)}
                  />
                  <Button
                    className="ml-2"
                    onClick={() => doRename(component.componentId)}
                  >Rename</Button>
                </div>
              </Popover>
              <Popover
                open={deletePopoverId === component.componentId}
                onClose={() => setDeleteId("")}
                popoverTarget={<Button
                  small
                  className="ml-2"
                  intent={Intent.DANGER}
                  icon={faTrash}
                  onClick={() => setDeleteId(component.componentId)}
                ></Button>}
                placement={PopperPlacement.bottomEnd}
              >
                <div className="flex">
                  <p className="my-auto mr-2 ml-2">Are you sure you want to delete this component?</p>
                  <Button
                    className="ml-2"
                    intent={Intent.DANGER}
                    onClick={() => {
                      deleteComponent({variables: {planetId: props.planet.id, componentId: component.componentId}}).then(() => {
                        Toasts.success(`Deleted component ${component.name} successfully.`);
                        setDeleteId("");
                      }).catch((err: Error) => {
                        Toasts.danger(err.message);
                      });
                    }}
                  >Delete</Button>
                </div>
              </Popover>
            </div>}
          >{component.name}</ListItem>
        ))}
      </List>
    </div>
  );
}

export default AdminComponent;
