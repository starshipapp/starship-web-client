import { useMutation, useQuery } from "@apollo/client";
import { Button, ButtonGroup, Classes, ContextMenu, Divider, Icon, Intent, Menu, MenuItem, Popover, ProgressBar, Text } from "@blueprintjs/core";
import React, { useRef, useState } from "react";
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

const uploading: Record<string, {name: string, progress: number}> = {};

function FilesComponent(props: IComponentProps): JSX.Element {
  const {data: userData, loading: userLoading, client} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const {data: objectData, loading: objectLoading} = useQuery<IGetFileObjectData>(getFileObject, {variables: {id: props.subId}, errorPolicy: 'all'});
  const {data: foldersData, loading: foldersLoading, refetch: foldersRefetch} = useQuery<IGetFoldersData>(getFolders, {variables: {componentId: props.id, parent: (props.subId ?? "root")}, errorPolicy: 'all', fetchPolicy: "cache-and-network"});
  const {data: filesData, loading: filesLoading, refetch: filesRefetch} = useQuery<IGetFilesData>(getFiles, {variables: {componentId: props.id, parent: (props.subId ?? "root")}, errorPolicy: 'all', fetchPolicy: "cache-and-network"});
  const {refetch} = useQuery<IGetDownloadFileObjectData>(getDownloadFileObject, {variables: {fileId: props.subId}, errorPolicy: 'all', fetchPolicy: "no-cache"});
  const [uploadFileM] = useMutation<IUploadFileObjectMutationData>(uploadFileObjectMutation);
  const [completeUpload] = useMutation<ICompleteUploadMutationData>(completeUploadMutation);
  const [moveObject] = useMutation<IMoveObjectMutationData>(moveObjectMutation);
  const [createFolder] = useMutation<ICreateFolderMutationData>(createFolderMutation);
  const fileInput = useRef<HTMLInputElement>(null);
  const [showReport, setReport] = useState<boolean>(false);
  const [newFolderTextbox, setNewFolderTextbox] = useState<string>("");
  const [uploadUpdateCounter, setUploadUpdateCounter] = useState<number>(0);
  const [createFolderPrompt, setCreateFolderPrompt] = useState<boolean>(false);
  const [listView, setListView] = useState<boolean>(window.localStorage.getItem("files.listView") === "true" ? true : false);

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
          setUploadUpdateCounter(uploadUpdateCounter + 1);
        }};
        axios.put(data.data.uploadFileObject.uploadUrl, file, options).then(() => {
          completeUpload({variables: {objectId: data.data?.uploadFileObject.documentId}}).then(() => {
            GlobalToaster.show({message: `Finished uploading ${file.name}.`, intent: Intent.SUCCESS});
            void filesRefetch();
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

  const onDrop = function(e: React.DragEvent<HTMLButtonElement | HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if(e.dataTransfer.items[0].kind === "string") {
      e.dataTransfer.items[0].getAsString((stringValue) => {
        if(stringValue !== (objectData?.fileObject.parent ?? "")) {
          moveObject({variables: {objectId: stringValue, parent: objectData?.fileObject.parent?.id}}).then(() => {
            void client.cache.gc();
            void foldersRefetch();
            void filesRefetch();
          }).catch((err: Error) => {
            GlobalToaster.show({message: err.message, intent: Intent.DANGER});
          });
        }
      });
    }
  };

  return (
    <div 
      className="bp3-dark FilesComponent" 
      onDrop={(e) => [onDrop]}
      onDragOver={(e) => {e.preventDefault();}} 
      onDragEnd={(e) => {e.preventDefault();}}
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
        <FileBreadcrumbs path={objectData?.fileObject.path ? objectData.fileObject.path.concat([objectData.fileObject.id]) : ["root"]} componentId={props.id} planetId={props.planet.id}/>
        <div className="FilesComponent-uploading">
          {Object.values(uploading).length !== 0 && <div className="FilesComponent-uploading-container">
            <Icon className="FilesComponent-uploading-icon" iconSize={16} icon="upload"/>
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
          <Button text="Upload Files" icon="upload" onClick={() => {
            if(fileInput) {
              fileInput.current?.click();
            }
          }}/>
          <Popover isOpen={createFolderPrompt} onClose={() => setCreateFolderPrompt(false)}>
            <Button text="New Folder" icon="folder-new" onClick={() => setCreateFolderPrompt(true)}/>
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
      {((objectData && objectData.fileObject.type === "folder") || !props.subId) && !listView && <div className="FilesComponent-button-container">
        {props.subId && objectData && <Link to={`/planet/${props.planet.id}/${props.id}/${objectData.fileObject.parent?.id ?? ""}`}>
          <Button
            alignText="left"
            className="FilesComponent-filebutton"
            icon="arrow-up"
            text="../"
            large={true}
            onDrop={onDrop}
          />
        </Link>}
        {foldersData?.folders.map((value) => (<FileButton planet={props.planet} key={value.id} object={value} componentId={props.id} refetch={() => {void filesRefetch(); void foldersRefetch();}}/>))}
        {filesData?.files.map((value) => (<FileButton planet={props.planet} key={value.id} object={value} componentId={props.id} refetch={() => {void filesRefetch(); void foldersRefetch();}}/>))}
      </div>}
      {((objectData && objectData.fileObject.type === "folder") || !props.subId) && listView && <div className="FilesComponent-list-table">
        {props.subId && objectData && <Link className="link-button" to={`/planet/${props.planet.id}/${props.id}/${objectData.fileObject.parent?.id ?? ""}`}>
          <div className="FileListButton" onDrop={onDrop}>
            <div><Icon className="FileListButton-icon" icon="arrow-up"/>../</div>
          </div>
        </Link>}
        {/* foldersData?.folders.map((value) => (<FileListButton planet={props.planet} key={value.id} object={value}/>))}
        {filesData?.files.map((value) => (<FileListButton planet={props.planet} key={value.id} object={value}/>))*/}
      </div>}
      {/* objectData && objectData.fileObject.type === "file" && <FileView file={objectData.fileObject}/>*/}
    </div> 
  );
}

export default FilesComponent;