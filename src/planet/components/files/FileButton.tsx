import { useMutation, useQuery } from "@apollo/client";
import { faDownload, faEdit, faFolder, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../components/controls/Button";
import ContextMenu from "../../../components/controls/ContextMenu";
import AlertBody from "../../../components/dialog/AlertBody";
import AlertControls from "../../../components/dialog/AlertControls";
import Dialog from "../../../components/dialog/Dialog";
import Toasts from "../../../components/display/Toasts";
import Tooltip from "../../../components/display/Tooltip";
import Textbox from "../../../components/input/Textbox";
import Intent from "../../../components/Intent";
import MenuItem from "../../../components/menu/MenuItem";
import Popover from "../../../components/overlays/Popover";
import PopperPlacement from "../../../components/PopperPlacement";
import deleteFileObjectMutation, { IDeleteFileObjectMutationData } from "../../../graphql/mutations/components/files/deleteFileObjectMutation";
import moveObjectMutation, { IMoveObjectMutationData } from "../../../graphql/mutations/components/files/moveObjectMutation";
import renameObjectMutation from "../../../graphql/mutations/components/files/renameObjectMutation";
import getDownloadFileObject, { IGetDownloadFileObjectData } from "../../../graphql/queries/components/files/getDownloadFileObject";
import getCurrentUser, { IGetCurrentUserData } from "../../../graphql/queries/users/getCurrentUser";
import IFileObject from "../../../types/IFileObject";
import IPlanet from "../../../types/IPlanet";
import getIconFromType from "../../../util/getIconFromType";
import permissions from "../../../util/permissions";

interface IFileButtonProps {
  planet: IPlanet
  object: IFileObject
  componentId: string
  refetch: () => void
  onClick?: (e?: React.MouseEvent<HTMLElement, MouseEvent>, id?: string) => void
  selections?: string[]
  resetSelection?: () => void
}

function FileButton(props: IFileButtonProps): JSX.Element {
  const {data: userData, client, refetch: refetchUser} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const {refetch} = useQuery<IGetDownloadFileObjectData>(getDownloadFileObject, {variables: {fileId: props.object.id}, errorPolicy: 'all', fetchPolicy: 'no-cache'});
  const [moveObject] = useMutation<IMoveObjectMutationData>(moveObjectMutation);
  const [deleteObject] = useMutation<IDeleteFileObjectMutationData>(deleteFileObjectMutation);
  const [renameObject] = useMutation<IDeleteFileObjectMutationData>(renameObjectMutation);
  const [renameText, setRenameText] = useState<string>("");
  const [rename, setRename] = useState<boolean>(false);
  const [showDelete, setDelete] = useState<boolean>(false);
  const hasWritePermission = userData?.currentUser && permissions.checkFullWritePermission(userData.currentUser, props.planet);

  return (
    <>
      <Dialog
        open={showDelete}
        onClose={() => setDelete(false)}
      >
        <AlertBody
          icon={faTrash}
          intent={Intent.DANGER}
        >
          Are you sure you want to delete {(props.selections?.length ?? 0) > 1 && props.selections?.includes(props.object.id) ? `these files?` : "this file?"}
          <br/>
          &apos;{props.object.name}&apos;{(props.selections?.length ?? 0) > 1 && props.selections?.includes(props.object.id) && ` and ${props.selections.length - 1} other${props.selections.length > 2 ? "s" : " file"}`} will be lost forever! (A long time!)
        </AlertBody>
        <AlertControls>
          <Button
            onClick={() => {
              setDelete(false);
            }}
            className="mr-2"
          >Cancel</Button>
          <Button
            intent={Intent.DANGER}
            onClick={(e) => {
              e?.stopPropagation();
              const deletionArray = (props.selections?.length ?? 0) > 1 && props.selections?.includes(props.object.id) ? props.selections : [props.object.id];
              deleteObject({variables: {objectIds: deletionArray}}).then(() => {
                Toasts.success(`Deleted ${deletionArray.length} file${deletionArray.length > 1 ? "s" : ""}`);
                props.refetch();
                props.resetSelection && props.resetSelection();
                void refetchUser();
              }).catch((err: Error) => {
                Toasts.danger(err.message);
              });
            }}
          >Delete</Button>
        </AlertControls>
      </Dialog>
      <Link 
        className="link-button" 
        to={`/planet/${props.planet.id}/${props.componentId}/${props.object.id}`}
        onDragStart={(e) => {
          e.stopPropagation();
          e.dataTransfer.clearData();
          if(props.selections && props.selections.includes(props.object.id)) {
            e.dataTransfer.setData("application/json", JSON.stringify(props.selections));
          } else {
            e.dataTransfer.setData("text/plain", props.object.id);
          }
        }}
        onClick={(e) => {
          if(props.onClick) {
            props.onClick(e, props.object.id);
          }
        }}
        id={props.object.id}
      >
        <ContextMenu
          menu={<>
            {hasWritePermission && <MenuItem
              icon={faTrash}
              onClick={(_e) => {
                setDelete(true);
              }}
            >Delete</MenuItem>}
            {hasWritePermission && !((props.selections?.length ?? 0) > 1 && props.selections?.includes(props.object.id)) && <MenuItem
              icon={faEdit}
              onClick={(_e) => {
                setRename(true);
                setRenameText(props.object.name ?? "");
              }}
            >Rename</MenuItem>}
            {props.object.type === "file" && !((props.selections?.length ?? 0) > 1 && props.selections?.includes(props.object.id)) && <MenuItem
              icon={faDownload}
              onClick={(_e) => {
                refetch().then((data) => {
                if(data.data) {
                  window.open(data.data.downloadFileObject, "_self");
                }
                }).catch((err: Error) => {
                  Toasts.danger(err.message);
                });
              }}
            >Download</MenuItem>}
          </>}
          fullWidth={true}
        >
          <Tooltip
            content={props.object.name ?? ""}
            fullWidth
          >
            <div
              draggable={true}
              onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                if(props.onClick) {
                  props.onClick(e, props.object.id);
                }
              }}
              className={`transition-all duration-200 flex ring-1 ring-gray-300 px-3.5 py-2.5 text-base rounded-sm m-2 overflow-hidden leading-tight outline-none focus:outline-none focus:ring-blue-300 
              focus:ring-1 dark:focus:ring-blue-600 shadow-md active:shadow-sm ${props.selections && props.selections.includes(props.object.id) ? `
                bg-blue-400 hover:bg-blue-300 dark:bg-blue-700 dark:ring-blue-600 dark:hover:bg-blue-600 active:bg-blue-500 dark:active:bg-blue-700
              ` : `
                bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:ring-gray-700 dark:hover:bg-gray-700 active:bg-gray-400 dark:active:bg-gray-900
              `}`}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if(e.dataTransfer.items[0] && e.dataTransfer.items[0].kind === "string") {
                  const type = e.dataTransfer.items[0].type;
                  e.dataTransfer.items[0].getAsString((stringValue) => {
                    if(type === "text/plain") {
                      if(stringValue !== props.object.id) {
                        moveObject({variables: {objectIds: [stringValue], parent: props.object.id}}).then(() => {
                          props.refetch();
                          void client.cache.gc();
                        }).catch((err: Error) => {
                          Toasts.danger(err.message);
                        });
                      }
                    } else if (type === "application/json") {
                      const idArray: string[] = JSON.parse(stringValue) as string[] ?? [];
                      if(idArray && idArray.length > 0 && !idArray.includes(props.object.id)) {
                        moveObject({variables: {objectIds: idArray, parent: props.object.id}}).then(() => {
                          props.refetch();
                          void client.cache.gc();
                        }).catch((err: Error) => {
                          Toasts.danger(err.message);
                        });
                      }
                    }
                  });
                }
              }}
              id={props.object.id}
            >
              <FontAwesomeIcon className="my-auto mr-2 text-gray-600 dark:text-gray-300" icon={props.object.type === "folder" ? faFolder : getIconFromType(props.object.fileType ?? "application/octet-stream")}/>
              <Popover
                open={rename}
                onClose={() => setRename(false)}
                popoverTarget={<div className="whitespace-nowrap overflow-hidden overflow-ellipsis mr-4">
                  {props.object.name}
                </div>}
                fullWidth
                placement={PopperPlacement.bottomStart}
              >
                <div
                  className="menu-form"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onKeyDown={(e) => e.stopPropagation()}
                  onKeyPress={(e) => e.stopPropagation()}
                  onKeyUp={(e) => e.stopPropagation()}
                >
                  <Textbox
                    value={renameText}
                    onClick={(e => e.stopPropagation())} 
                    onChange={(e) => setRenameText(e.target.value)}
                  />
                  <Button className="ml-2" onClick={() => {
                    renameObject({variables: {objectId: props.object.id, name: renameText}}).then(() => {
                      Toasts.success(`Renamed ${props.object.name ?? ""}.`);
                      setRename(false);
                    }).catch((err: Error) => {
                      Toasts.danger(err.message);
                    });
                  }}>Rename</Button>
                </div>
              </Popover>
            </div>
          </Tooltip>
        </ContextMenu>
      </Link>
    </>
  );
}

export default memo(FileButton, (next, prev) => {
  if(next.object !== prev.object) {
    return false;
  }
  if(next.selections !== prev.selections) {
    return false;
  }

  return true;
});
