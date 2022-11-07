import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { Link } from "react-router-dom";
import deleteFileObjectMutation, { IDeleteFileObjectMutationData } from "../../../graphql/mutations/components/files/deleteFileObjectMutation";
import moveObjectMutation, { IMoveObjectMutationData } from "../../../graphql/mutations/components/files/moveObjectMutation";
import renameObjectMutation from "../../../graphql/mutations/components/files/renameObjectMutation";
import getDownloadFileObject, { IGetDownloadFileObjectData } from "../../../graphql/queries/components/files/getDownloadFileObject";
import getCurrentUser, { IGetCurrentUserData } from "../../../graphql/queries/users/getCurrentUser";
import IFileObject from "../../../types/IFileObject";
import IPlanet from "../../../types/IPlanet";
import permissions from "../../../util/permissions";
import { filesize } from "filesize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEdit, faFolder, faTrash } from "@fortawesome/free-solid-svg-icons";
import Divider from "../../../components/display/Divider";
import Dialog from "../../../components/dialog/Dialog";
import AlertBody from "../../../components/dialog/AlertBody";
import Intent from "../../../components/Intent";
import AlertControls from "../../../components/dialog/AlertControls";
import Button from "../../../components/controls/Button";
import Toasts from "../../../components/display/Toasts";
import Popover from "../../../components/overlays/Popover";
import PopperPlacement from "../../../components/PopperPlacement";
import ContextMenu from "../../../components/controls/ContextMenu";
import MenuItem from "../../../components/menu/MenuItem";
import Textbox from "../../../components/input/Textbox";
import getIconFromType from "../../../util/getIconFromType";

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
  const {refetch} = useQuery<IGetDownloadFileObjectData>(getDownloadFileObject, {variables: {fileId: props.object.id}, errorPolicy: 'all', fetchPolicy: "no-cache"});
  const [moveObject] = useMutation<IMoveObjectMutationData>(moveObjectMutation);
  const [deleteObject] = useMutation<IDeleteFileObjectMutationData>(deleteFileObjectMutation);
  const [renameObject] = useMutation<IDeleteFileObjectMutationData>(renameObjectMutation);
  const [renameText, setRenameText] = useState<string>("");
  const [rename, setRename] = useState<boolean>(false);
  const [showDelete, setDelete] = useState<boolean>(false);

  const date = props.object.createdAt ? new Date(Number(props.object.createdAt)) : new Date("2020-07-25T15:24:30+00:00");
  const fileDate = date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
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
              onClick={(e) => {
                setDelete(true);
              }}
            >Delete</MenuItem>}
            {hasWritePermission && !((props.selections?.length ?? 0) > 1 && props.selections?.includes(props.object.id)) && <MenuItem
              icon={faEdit}
              onClick={(e) => {
                setRename(true);
                setRenameText(props.object.name ?? "");
              }}
            >Rename</MenuItem>}
            {props.object.type === "file" && !((props.selections?.length ?? 0) > 1 && props.selections?.includes(props.object.id)) && <MenuItem
              icon={faDownload}
              onClick={(e) => {
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
          <div
            draggable={true}
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
            className={`flex px-4 py-2.5 border-b ${props.selections && props.selections.includes(props.object.id) ? "bg-blue-400 hover:bg-blue-300 dark:bg-blue-700 dark:hover:bg-blue-600 border-blue-300 dark:border-blue-600"  : "hover:bg-gray-200 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600"}`}
          >
            <div className="flex">
              <div className="w-4 mr-2 mt-0.5 inline-flex">
                <FontAwesomeIcon className="mx-auto" icon={props.object.type === "folder" ? faFolder : getIconFromType(props.object.fileType ?? "application/octet-stream")}/>
              </div>
              <Popover
                open={rename}
                onClose={() => setRename(false)}
                popoverTarget={<div className="inline-block">
                  {props.object.name}
                </div>}
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
            <div className="ml-auto flex">
              {props.object.size && <span>{filesize(props.object.size).toLocaleString()}</span>}
              {props.object.size && <Divider/>}
              <span>{fileDate}</span>
            </div>
          </div>
        </ContextMenu>
      </Link>
    </>
  );
}

export default FileListButton;
