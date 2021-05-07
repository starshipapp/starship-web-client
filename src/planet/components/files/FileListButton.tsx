import { useMutation, useQuery } from "@apollo/client";
import { Alert, Button, Classes, ContextMenu, Divider, Icon, Intent, Menu, MenuItem, Popover, PopoverPosition } from "@blueprintjs/core";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import deleteFileObjectMutation, { IDeleteFileObjectMutationData } from "../../../graphql/mutations/components/files/deleteFileObjectMutation";
import moveObjectMutation, { IMoveObjectMutationData } from "../../../graphql/mutations/components/files/moveObjectMutation";
import renameObjectMutation from "../../../graphql/mutations/components/files/renameObjectMutation";
import getDownloadFileObject, { IGetDownloadFileObjectData } from "../../../graphql/queries/components/files/getDownloadFileObject";
import getCurrentUser, { IGetCurrentUserData } from "../../../graphql/queries/users/getCurrentUser";
import IFileObject from "../../../types/IFileObject";
import IPlanet from "../../../types/IPlanet";
import { GlobalToaster } from "../../../util/GlobalToaster";
import permissions from "../../../util/permissions";
import filesize from "filesize";
import "./css/FileListButton.css";

interface IFileButtonProps {
  planet: IPlanet
  object: IFileObject
  componentId: string
  refetch: () => void
  onClick?: (e?: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id?: string) => void
  selections?: string[]
  resetSelection?: () => void
}

function FileListButton(props: IFileButtonProps): JSX.Element {
  const {data: userData, client, refetch: refetchUser} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const {refetch} = useQuery<IGetDownloadFileObjectData>(getDownloadFileObject, {variables: {fileId: props.object.id}, errorPolicy: 'all', fetchPolicy: "standby"});
  const [moveObject] = useMutation<IMoveObjectMutationData>(moveObjectMutation);
  const [deleteObject] = useMutation<IDeleteFileObjectMutationData>(deleteFileObjectMutation);
  const [renameObject] = useMutation<IDeleteFileObjectMutationData>(renameObjectMutation);
  const [renameText, setRenameText] = useState<string>("");
  const [rename, setRename] = useState<boolean>(false);
  const [showDelete, setDelete] = useState<boolean>(false);

  const date = props.object.createdAt ? new Date(Number(props.object.createdAt)) : new Date("2020-07-25T15:24:30+00:00");
  const fileDate = date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <>
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
          className={`FileListButton ${props.selections && props.selections.includes(props.object.id) ? "FileListButton-selected" : ""}`}
        >
          <div><Icon className="FileListButton-icon" icon={props.object.type === "folder" ? "folder-close" : "document"}/>{props.object.name}</div>
          <div className="FileListButton-date">
            {props.object.size && <span>{filesize(props.object.size)}</span>}
            {props.object.size && <Divider/>}
            <span>{fileDate}</span>
          </div>
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
    </>
  );
}

export default FileListButton;