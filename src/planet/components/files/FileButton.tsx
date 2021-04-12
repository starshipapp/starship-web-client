import { useMutation, useQuery } from "@apollo/client";
import { Alert, Button, Classes, ContextMenu, Intent, Menu, MenuItem, Popover, PopoverPosition, Tooltip } from "@blueprintjs/core";
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

interface IFileButtonProps {
  planet: IPlanet
  object: IFileObject
  componentId: string
  refetch: () => void
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
          deleteObject({variables: {objectId: props.object.id}}).then(() => {
            GlobalToaster.show({message: `Deleted ${props.object.name ?? ""}.`, intent: Intent.SUCCESS});
            props.refetch();
            void refetchUser();
          }).catch((err: Error) => {
            GlobalToaster.show({message: err.message, intent: Intent.DANGER});
          });
        }}
      >Are you sure you want to delete this file?<br/>&apos;{props.object.name}&apos; will be lost forever! (A long time!)</Alert>
      <Tooltip content={props.object.name} inheritDarkTheme={true}>
        <Link className="link-button" to={`/planet/${props.planet.id}/${props.componentId}/${props.object.id}`}>
          <Button
            draggable={true}
            alignText="left"
            onContextMenu={(e) => {
              const hasWritePermission = userData?.currentUser && permissions.checkFullWritePermission(userData.currentUser, props.planet); 
              e.preventDefault();
              ContextMenu.show(<Menu>
                {hasWritePermission && <MenuItem text="Delete" icon="delete" onClick={() => setDelete(true)}/>}
                {hasWritePermission && <MenuItem text="Rename" icon="edit" onClick={() => {setRename(true); setRenameText(props.object.name ?? "");}}/>}
                {props.object.type === "file" && <MenuItem text="Download" icon="download" onClick={() => {
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
            large={true}
            className={"FilesComponent-filebutton"}
            icon={props.object.type === "folder" ? "folder-close" : "document"}
            text={props.object.name}
            onDragStart={(e) => {
              e.stopPropagation();
              e.dataTransfer.setData("text/plain", props.object.id);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if(e.dataTransfer.items[0].kind === "string") {
                e.dataTransfer.items[0].getAsString((stringValue) => {
                  if(stringValue !== props.object.id) {
                    moveObject({variables: {objectId: stringValue, parent: props.object.id}}).then(() => {
                      props.refetch();
                      void client.cache.gc();
                    }).catch((err: Error) => {
                      GlobalToaster.show({message: err.message, intent: Intent.DANGER});
                    });
                  }
                });
              }
            }}
          >
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
          </Button>
        </Link>
      </Tooltip>
    </div>
  );
}

export default FileButton;