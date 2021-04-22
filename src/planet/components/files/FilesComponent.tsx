import { useMutation, useQuery } from "@apollo/client";
import { Button, ButtonGroup, Classes, Divider, Icon, InputGroup, Intent, Menu, MenuItem, NonIdealState, Popover, ProgressBar, Text } from "@blueprintjs/core";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import completeUploadMutation, { ICompleteUploadMutationData } from "../../../graphql/mutations/components/files/completeUploadMutation";
import createFolderMutation, { ICreateFolderMutationData } from "../../../graphql/mutations/components/files/createFolderMutation";
import moveObjectMutation, { IMoveObjectMutationData } from "../../../graphql/mutations/components/files/moveObjectMutation";
import uploadFileObjectMutation, { IUploadFileObjectMutationData } from "../../../graphql/mutations/components/files/uploadFileObjectMutation";
import getDownloadFileObject, { IGetDownloadFileObjectData } from "../../../graphql/queries/components/files/getDownloadFileObject";
import getFileObject, { IGetFileObjectData } from "../../../graphql/queries/components/files/getFileObject";
import getFiles, { IGetFilesData } from "../../../graphql/queries/components/files/getFiles";
import getFolders, { IGetFoldersData } from "../../../graphql/queries/components/files/getFolders";
import getCurrentUser, { IGetCurrentUserData } from "../../../graphql/queries/users/getCurrentUser";
import { GlobalToaster } from "../../../util/GlobalToaster";
import permissions from "../../../util/permissions";
import { reportObjectType } from "../../../util/reportTypes";
import ReportDialog from "../../ReportDialog";
import IComponentProps from "../IComponentProps";
import { v4 } from "uuid";
import axios, { AxiosRequestConfig } from "axios";
import FileBreadcrumbs from "./FileBreadcrumbs";
import FileButton from "./FileButton";
import "./css/FilesComponent.css";
import FileListButton from "./FileListButton";
import FileView from "./FileView";
import isMobile from "../../../util/isMobile";
import FileSearch from "./FileSearch";

const uploading: Record<string, {name: string, progress: number}> = {};
let hasSetup = false;

function FilesComponent(props: IComponentProps): JSX.Element {
  const {data: userData, client, refetch: refetchUser} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const {data: objectData, loading: objectLoading} = useQuery<IGetFileObjectData>(getFileObject, {variables: {id: props.subId}, errorPolicy: 'all'});
  const {data: foldersData, refetch: foldersRefetch} = useQuery<IGetFoldersData>(getFolders, {variables: {componentId: props.id, parent: (props.subId ?? "root")}, errorPolicy: 'all', fetchPolicy: "cache-and-network"});
  const {data: filesData, refetch: filesRefetch} = useQuery<IGetFilesData>(getFiles, {variables: {componentId: props.id, parent: (props.subId ?? "root")}, errorPolicy: 'all', fetchPolicy: "cache-and-network"});
  const {refetch} = useQuery<IGetDownloadFileObjectData>(getDownloadFileObject, {variables: {fileId: props.subId}, errorPolicy: 'all', fetchPolicy: "no-cache"});
  const [uploadFileM] = useMutation<IUploadFileObjectMutationData>(uploadFileObjectMutation);
  const [completeUpload] = useMutation<ICompleteUploadMutationData>(completeUploadMutation);
  const [moveObject] = useMutation<IMoveObjectMutationData>(moveObjectMutation);
  const [createFolder] = useMutation<ICreateFolderMutationData>(createFolderMutation);
  const fileInput = useRef<HTMLInputElement>(null);
  const [showReport, setReport] = useState<boolean>(false);
  const [newFolderTextbox, setNewFolderTextbox] = useState<string>("");
  const [, setUploadUpdateCounter] = useState<number>(0);
  const [createFolderPrompt, setCreateFolderPrompt] = useState<boolean>(false);
  const [listView, setListView] = useState<boolean>(window.localStorage.getItem("files.listView") === "true" ? true : false);
  const [isDragging, setDragging] = useState<boolean>(false);
  const [searchTextbox, setSearchTextbox] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [selected, setSelected] = useState<string[]>([]);

  const resetSearch = function() {
    setSearchTextbox("");
    setSearchText("");
  };

  const uploadFile = function(file: File, folderId: string) {
    uploadFileM({variables: {folderId, type: file.type, name: file.name, filesId: props.id}}).then((data) => {
      if(data.data?.uploadFileObject) {
        const currentIndex = v4();
        uploading[currentIndex] = {
          name: file.name,
          progress: 0
        };
        const options: AxiosRequestConfig = {headers: {"Content-Type": file.type}, onUploadProgress: (progressEvent: {loaded: number, total: number}) => {
          uploading[currentIndex].progress = progressEvent.loaded / progressEvent.total;
          if(uploading[currentIndex].progress === 1) {
            delete uploading[currentIndex];
          }
          setUploadUpdateCounter(Math.random() * 300000000);
        }};
        axios.put(data.data.uploadFileObject.uploadUrl, file, options).then(() => {
          completeUpload({variables: {objectId: data.data?.uploadFileObject.documentId}}).then(() => {
            GlobalToaster.show({message: `Finished uploading ${file.name}.`, intent: Intent.SUCCESS});
            void filesRefetch();
            void refetchUser();
          }).catch((err: Error) => {
            GlobalToaster.show({message: err.message, intent: Intent.DANGER});
          });
        }).catch((err: Error) => {
          GlobalToaster.show({message: err.message, intent: Intent.DANGER});
        });
      }
    }).catch((err: Error) => {
      GlobalToaster.show({message: err.message, intent: Intent.DANGER});
    });
  };

  const onDrop = function(e: React.DragEvent<HTMLButtonElement | HTMLDivElement>, toParent: boolean) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.items) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        if (e.dataTransfer.items[i].kind === "file") {
          const file = e.dataTransfer.items[i].getAsFile();
          if(file) {
            uploadFile(file, objectData?.fileObject.id ?? "root");
          }
        } else if(e.dataTransfer.items[i].kind === "string") {
          e.dataTransfer.items[i].getAsString((stringValue) => {
            if(stringValue !== (objectData?.fileObject.parent ?? "") && objectData?.fileObject.id) {
              moveObject({variables: {objectId: stringValue, parent: toParent ? (objectData?.fileObject.parent?.id ?? "root") : objectData.fileObject.id}}).then(() => {
                void client.cache.gc();
                void foldersRefetch();
                void filesRefetch();
              }).catch((err: Error) => {
                GlobalToaster.show({message: err.message, intent: Intent.DANGER});
              });
            }
          });
        }
      }
    }
  };

  const clickHandler = function(e?: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id?: string) {
    if(e?.ctrlKey && id) {
      e.preventDefault();
      if(!selected.includes(id)) {
        const newSelections = [...selected];
        newSelections.push(id);
        setSelected(newSelections);
      } else {
        const newSelections = [...selected];
        newSelections.splice(newSelections.indexOf(id), 1);
        setSelected(newSelections);
      }
    } if(e?.shiftKey) {
      e.preventDefault();
      if(selected.length !== 0) {
        // TODO
      }

    } else if(selected.length !== 0) {
      setSelected([]);
    }
  };

  useEffect(() => {
    if(!hasSetup) {
      document.onclick = (e) => {
        // i don't know why but for some reason triple equals breaks this
        // eslint-disable-next-line eqeqeq
        if(selected.length != 0) {
          const closestElement = document.elementFromPoint(e.clientX, e.clientY);
          if(!closestElement?.className.includes("selected")) {
            if(!closestElement?.className.includes("FileButton") || !closestElement.className.includes("FileListButton") || (!e.ctrlKey && !e.shiftKey)) {
              setSelected([]);
            }
          }
        }
      };
      hasSetup = true;
    }
  });

  if(!objectData?.fileObject && !objectLoading && props.subId) {
    return (
      <div 
        className="bp3-dark FilesComponent"
      >
        <NonIdealState
          title="404"
          icon="error"
          description="The requested file/folder could not be found."
        />
      </div>
    );
  }

  return (
    <div 
      className={`bp3-dark FilesComponent ${isDragging ? "FilesComponent-dragging" : ""}`}
      onDrop={(e) => onDrop(e, false)}
      onDragOver={(e) => {
        e.preventDefault();
        if(e.dataTransfer.items[0].kind === "file") {
          setDragging(true);
        }
      }} 
      onDragLeave={(e) => {
        e.preventDefault();
        setDragging(false);
      }}
      onDragExit={(e) => {
        e.preventDefault();
        setDragging(false);
      }}
      onDragEnd={(e) => {
        e.preventDefault();
        setDragging(false);
      }}
    >
      {objectData?.fileObject && <ReportDialog isOpen={showReport} onClose={() => setReport(false)} objectId={objectData.fileObject.id} objectType={reportObjectType.FILE} userId={objectData.fileObject.owner?.id ?? ""}/>}
      <div className="FilesComponent-top">
        <input
          type="file"
          ref={fileInput}
          id="upload-button"
          style={{ display: "none" }}
          onChange={(e) => {
            if(e.target.files) {
              const folderId = props.subId ? props.subId: "root";
              for(let i = 0; i < e.target.files?.length; i++) {
                const file = e.target.files[i];
                uploadFile(file, folderId);
              }
            }
          }}
          multiple
        />
        {(objectData?.fileObject || !props.subId) && <FileBreadcrumbs path={objectData?.fileObject.path ? objectData.fileObject.path.concat([objectData.fileObject.id]) : ["root"]} componentId={props.id} planetId={props.planet.id} resetSearch={resetSearch}/>}
        {(objectData?.fileObject || !props.subId) && (objectData?.fileObject.type === "folder" || !props.subId) && <InputGroup 
          leftIcon="search"
          value={searchTextbox}
          placeholder="Search..."
          className={Classes.MINIMAL}
          onKeyDown={(e) => {
            if(e.key === "Enter") {
              if(searchTextbox.length < 3 && searchTextbox !== "") {
                GlobalToaster.show({message: "Search term must be at least 3 characters long.", intent: Intent.DANGER});
              } else {
                setSearchText(searchTextbox);
              }
            }
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTextbox(e.target.value);
          }}
          rightElement={searchText !== "" ? <Button minimal={true} small={true} icon="cross" onClick={() => {
            resetSearch();
          }}/> : undefined}
        />}
        <div className="FilesComponent-uploading">
          {Object.values(uploading).length !== 0 && <div className="FilesComponent-uploading-container">
            <Icon className="FilesComponent-uploading-icon FilesComponent-uploading-icon-first" iconSize={16} icon="upload"/>
            <ProgressBar className="FilesComponent-uploading-progress" intent={Intent.PRIMARY}/>
            <Popover>
              <Icon className="FilesComponent-uploading-icon" iconSize={16} icon="chevron-down"/>
              <div className="FilesComponent-uploading-info-container">
                {Object.values(uploading).map((value, index) => (<div key={index} className="FilesComponent-uploading-info">
                  <Text className="FilesComponent-uploading-info-name">{value.name}</Text>
                  <ProgressBar className="FilesComponent-uploading-info" value={value.progress} intent={Intent.PRIMARY}/>
                </div>))}
              </div>
            </Popover>
          </div>}
        </div>
        <Divider/>
        {objectData?.fileObject && objectData?.fileObject.type === "file" && <ButtonGroup minimal={true} className="FilesComponent-top-actions">
          <Button text="Download" icon="download" onClick={() => {
            refetch().then((data) => {
              if(data.data) {
                window.open(data.data.downloadFileObject, "_self");
              }
            }).catch((err: Error) => {
              GlobalToaster.show({message: err.message, intent: Intent.DANGER});
            });
          }}/>
          {userData?.currentUser && <Button text="Report" icon="flag" onClick={() => setReport(true)}/>}
        </ButtonGroup>}
        {userData?.currentUser && permissions.checkFullWritePermission(userData?.currentUser, props.planet) && ((objectData?.fileObject && objectData.fileObject.type === "folder") || !props.subId) && <ButtonGroup minimal={true} className="FilesComponent-top-actions">
          <Button text={!isMobile() ? "Upload Files": ""} icon="upload" onClick={() => {
            if(fileInput) {
              fileInput.current?.click();
            }
          }}/>
          <Popover isOpen={createFolderPrompt} onClose={() => setCreateFolderPrompt(false)}>
            <Button text={!isMobile() ? "New Folder": ""} icon="folder-new" onClick={() => setCreateFolderPrompt(true)}/>
            <div className="menu-form">
              <input className={Classes.INPUT + " menu-input"} value={newFolderTextbox} onChange={(e) => setNewFolderTextbox(e.target.value)}/>
              <Button text="Create" className="menu-button" onClick={() => {
                const parent = objectData?.fileObject ? objectData.fileObject.id : "root";
                createFolder({variables: {componentId: props.id, parent, name: newFolderTextbox}}).then(() => {
                  void foldersRefetch();
                  GlobalToaster.show({message: `Created folder "${newFolderTextbox}"`, intent: Intent.SUCCESS});
                  setNewFolderTextbox("");
                  setCreateFolderPrompt(false);
                }).catch((err: Error) => {
                  GlobalToaster.show({message: ``, intent: Intent.DANGER});
                });
              }}/>
            </div>
          </Popover>
          <Popover>
            <Button icon="settings"/>
            <Menu>
              <MenuItem icon={listView ? "tick" : "cross"} text="List View" onClick={() => {
                setListView(!listView);
                window.localStorage.setItem("files.listView", String(!listView));
              }}/>
            </Menu>
          </Popover>
          {props.subId && <Divider/>}
          {/* this.props.subId && <Button text="Download Folder" icon="download" onClick={this.downloadZip}/>*/}
        </ButtonGroup>}
      </div>
      {((objectData && objectData.fileObject.type === "folder") || !props.subId) && searchText === "" && !listView && <div className="FilesComponent-button-container">
        {props.subId && objectData && <Link to={`/planet/${props.planet.id}/${props.id}/${objectData.fileObject.parent?.id ?? ""}`}>
          <Button
            alignText="left"
            className="FilesComponent-filebutton"
            icon="arrow-up"
            text="../"
            large={true}
            onDrop={(e) => onDrop(e, true)}
          />
        </Link>}
        {foldersData?.folders.map((value) => (<FileButton planet={props.planet} key={value.id} object={value} componentId={props.id} refetch={() => {void filesRefetch(); void foldersRefetch();}}/>))}
        {filesData?.files.map((value) => (<FileButton planet={props.planet} key={value.id} object={value} componentId={props.id} refetch={() => {void filesRefetch(); void foldersRefetch();}}/>))}
      </div>}
      {((objectData && objectData.fileObject.type === "folder") || !props.subId) && searchText === "" && listView && <div className="FilesComponent-list-table">
        {props.subId && objectData && <Link className="link-button" to={`/planet/${props.planet.id}/${props.id}/${objectData.fileObject.parent?.id ?? ""}`}>
          <div className="FileListButton" onDrop={(e) => onDrop(e, true)}>
            <div><Icon className="FileListButton-icon" icon="arrow-up"/>../</div>
          </div>
        </Link>}
        {foldersData?.folders.map((value) => (<FileListButton 
          planet={props.planet}
          key={value.id}
          object={value}
          componentId={props.id}
          refetch={() => {void filesRefetch(); void foldersRefetch();}}
          onClick={clickHandler}
          selections={selected}
        />))}
        {filesData?.files.map((value) => (<FileListButton 
          planet={props.planet} 
          key={value.id}
          object={value}
          componentId={props.id}
          refetch={() => {void filesRefetch(); void foldersRefetch();}}
          onClick={clickHandler}
          selections={selected}
        />))}
      </div>}
      {((objectData && objectData.fileObject.type === "folder") || !props.subId) && searchText !== "" && <FileSearch
        id={props.id}
        searchText={searchText}
        parentId={props.subId ? props.subId : "root"}
        planet={props.planet}
        onClick={() => {
          resetSearch();
        }}
        useLists={listView}
      />}
      {objectData && objectData.fileObject.type === "file" && <FileView file={objectData.fileObject}/>}
    </div> 
  );
}

export default FilesComponent;