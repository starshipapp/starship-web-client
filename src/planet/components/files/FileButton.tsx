import { useMutation, useQuery } from "@apollo/client";
import { Alert, Button, Classes, ContextMenu, Intent, Menu, MenuItem, Popover, PopoverPosition } from "@blueprintjs/core";
import { faFile, faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import Tooltip from "../../../components/display/Tooltip";
import deleteFileObjectMutation, { IDeleteFileObjectMutationData } from "../../../graphql/mutations/components/files/deleteFileObjectMutation";
import moveObjectMutation, { IMoveObjectMutationData } from "../../../graphql/mutations/components/files/moveObjectMutation";
import renameObjectMutation from "../../../graphql/mutations/components/files/renameObjectMutation";
import getDownloadFileObject, { IGetDownloadFileObjectData } from "../../../graphql/queries/components/files/getDownloadFileObject";
import getCurrentUser, { IGetCurrentUserData } from "../../../graphql/queries/users/getCurrentUser";
import IFileObject from "../../../types/IFileObject";
import IPlanet from "../../../types/IPlanet";
import { GlobalToaster } from "../../../util/GlobalToaster";
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
  const {refetch} = useQuery<IGetDownloadFileObjectData>(getDownloadFileObject, {variables: {fileId: props.object.id}, errorPolicy: 'all'});
  const [moveObject] = useMutation<IMoveObjectMutationData>(moveObjectMutation);
  const [deleteObject] = useMutation<IDeleteFileObjectMutationData>(deleteFileObjectMutation);
  const [renameObject] = useMutation<IDeleteFileObjectMutationData>(renameObjectMutation);
  const [renameText, setRenameText] = useState<string>("");
  const [rename, setRename] = useState<boolean>(false);
  const [showDelete, setDelete] = useState<boolean>(false);

  return (
    <div>
      <Alert
        isOpen={showDelete}
        className="bp3-dark"
        icon="trash"
        intent={Intent.DANGER}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        canOutsideClickCancel={true}
        canEscapeKeyCancel={true}
        onCancel={() => setDelete(false)}
        onConfirm={(e) => {
          e?.stopPropagation();
          const deletionArray = (props.selections?.length ?? 0) > 1 && props.selections?.includes(props.object.id) ? props.selections : [props.object.id];
          deleteObject({variables: {objectIds: deletionArray}}).then(() => {
            GlobalToaster.show({message: `Deleted ${props.object.name ?? ""}${deletionArray.length > 1 ? ` and ${deletionArray.length - 1} ${deletionArray.length > 2 ? "others" : "other file"}` : ""}.`, intent: Intent.SUCCESS});
            props.refetch();
            props.resetSelection && props.resetSelection();
            void refetchUser();
          }).catch((err: Error) => {
            GlobalToaster.show({message: err.message, intent: Intent.DANGER});
          });
        }}
      >Are you sure you want to delete {(props.selections?.length ?? 0) > 1 && props.selections?.includes(props.object.id) ? `these files?` : "this file?"}
      <br/>
      &apos;{props.object.name}&apos;{(props.selections?.length ?? 0) > 1 && props.selections?.includes(props.object.id) && ` and ${props.selections.length - 1} other${props.selections.length > 2 ? "s" : " file"}`} will be lost forever! (A long time!)
      </Alert>
      <Tooltip content={props.object.name ?? "unknown"} fullWidth>
        <Link 
          className="link-button" to={`/planet/${props.planet.id}/${props.componentId}/${props.object.id}`}
          onDragStart={(e) => {
            e.stopPropagation();
            e.dataTransfer.clearData();
            if(props.selections && props.selections.includes(props.object.id)) {
              e.dataTransfer.setData("application/json", JSON.stringify(props.selections));
            } else {
              e.dataTransfer.setData("text/plain", props.object.id);
            }
          }}
        >
          <div
            draggable={true}
            onContextMenu={(e) => {
              const hasWritePermission = userData?.currentUser && permissions.checkFullWritePermission(userData.currentUser, props.planet); 
              e.preventDefault();
              ContextMenu.show(<Menu>
                {hasWritePermission && <MenuItem text="Delete" icon="delete" onClick={() => setDelete(true)}/>}
                {hasWritePermission && !((props.selections?.length ?? 0) > 1 && props.selections?.includes(props.object.id)) && <MenuItem text="Rename" icon="edit" onClick={() => {setRename(true); setRenameText(props.object.name ?? "");}}/>}
                {props.object.type === "file" && !((props.selections?.length ?? 0) > 1 && props.selections?.includes(props.object.id)) && <MenuItem text="Download" icon="download" onClick={() => {
                  refetch().then((data) => {
                    if(data.data) {
                      window.open(data.data.downloadFileObject, "_self");
                    }
                  }).catch((err: Error) => {
                    GlobalToaster.show({message: err.message, intent: Intent.DANGER});
                  });
                }}/>}
              </Menu>, { left: e.clientX, top: e.clientY }, () => {
                // menu was closed; callback optional
              }, true);
            }}
            onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
              if(props.onClick) {
                props.onClick(e, props.object.id);
              }
            }}
            className={`transition-all duration-200 flex ring-1 ring-gray-300 px-3 py-2 text-base rounded-sm m-2 overflow-hidden leading-tight outline-none focus:outline-none focus:ring-blue-300 
            focus:ring-1 dark:focus:ring-blue-600 shadow-md active:shadow-sm ${props.selections && props.selections.includes(props.object.id) ? `
              bg-blue-400 hover:bg-blue-300 dark:bg-blue-700 dark:ring-blue-600 dark:hover:bg-blue-600 active:bg-blue-500 dark:active:bg-blue-700
            ` : `
              bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:ring-gray-600 dark:hover:bg-gray-600 active:bg-gray-400 dark:active:bg-gray-800
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
                        GlobalToaster.show({message: err.message, intent: Intent.DANGER});
                      });
                    }
                  } else if (type === "application/json") {
                    const idArray: string[] = JSON.parse(stringValue) as string[] ?? [];
                    if(idArray && idArray.length > 0 && !idArray.includes(props.object.id)) {
                      moveObject({variables: {objectIds: idArray, parent: props.object.id}}).then(() => {
                        props.refetch();
                        void client.cache.gc();
                      }).catch((err: Error) => {
                        GlobalToaster.show({message: err.message, intent: Intent.DANGER});
                      });
                    }
                  }
                });
              }
            }}
            id={props.object.id}
          >
            <FontAwesomeIcon className="my-auto mr-2 text-gray-600 dark:text-gray-300" icon={props.object.type === "folder" ? faFolder : faFile}/>
            <div className="whitespace-nowrap overflow-hidden overflow-ellipsis">{props.object.name}</div>
            <Popover isOpen={rename} position={PopoverPosition.AUTO_START} onClose={() => setRename(false)}>
              <div className="FilesComponent-dummytarget"></div>
              <div className="menu-form" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()} onKeyPress={(e) => e.stopPropagation()} onKeyUp={(e) => e.stopPropagation()}>
                <input className={Classes.INPUT + " menu-input"} value={renameText} onChange={(e) => setRenameText(e.target.value)}/>
                <Button text="Rename" className="menu-button" onClick={() => {
                  renameObject({variables: {objectId: props.object.id, name: renameText}}).then(() => {
                    GlobalToaster.show({message: `Renamed ${props.object.name ?? ""}.`, intent: Intent.SUCCESS});
                    setRename(false);
                  }).catch((err: Error) => {
                    GlobalToaster.show({message: err.message, intent: Intent.DANGER});
                  });
                }}/>
              </div>
            </Popover>
          </div>
        </Link>
      </Tooltip>
    </div>
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
