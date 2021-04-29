import { useMutation, useQuery } from "@apollo/client";
import { Button, ButtonGroup, Classes, Divider, H2, Icon, InputGroup, Intent, Menu, MenuItem, NonIdealState, Popover, ProgressBar, Text } from "@blueprintjs/core";
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
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import FileBreadcrumbs from "./FileBreadcrumbs";
import FileButton from "./FileButton";
import "./css/FilesComponent.css";
import FileListButton from "./FileListButton";
import FileView from "./FileView";
import isMobile from "../../../util/isMobile";
import FileSearch from "./FileSearch";
import ReadmeWrapper from "./ReadmeWrapper";
import fileSize from "filesize";
import cancelUploadMutation, { ICancelUploadMutationData } from "../../../graphql/mutations/components/files/cancelUploadMutation";

const uploading: Record<string, {name: string, progress: number, documentId: string, cancelToken: CancelTokenSource}> = {};

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
  const [cancelUpload] = useMutation<ICancelUploadMutationData>(cancelUploadMutation);
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
  const [total, setTotal] = useState<number>(0);
  const [completed, setCompleted] = useState<number>(0);

  const date = objectData?.fileObject.createdAt ? new Date(Number(objectData?.fileObject.createdAt)) : new Date("2020-07-25T15:24:30+00:00");
  const fileDate = date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });

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
          progress: 0,
          documentId: data.data.uploadFileObject.documentId ?? "",
          cancelToken: axios.CancelToken.source()
        };
        const options: AxiosRequestConfig = {headers: {"Content-Type": file.type}, onUploadProgress: (progressEvent: {loaded: number, total: number}) => {
          uploading[currentIndex].progress = progressEvent.loaded / progressEvent.total;
          if(uploading[currentIndex].progress === 1) {
            delete uploading[currentIndex];
            setTotal(Object.keys(uploading).length);
          }
          let completed = 0;
          Object.values(uploading).map((value) => {return completed += value.progress;});
          setCompleted(completed);
          setUploadUpdateCounter(Math.random() * 300000000);
          console.log(completed / total);
        }, cancelToken: uploading[currentIndex].cancelToken.token};
        setTotal(Object.keys(uploading).length);
        axios.put(data.data.uploadFileObject.uploadUrl, file, options).then(() => {
          completeUpload({variables: {objectId: data.data?.uploadFileObject.documentId}}).then(() => {
            GlobalToaster.show({message: `Finished uploading ${file.name}.`, intent: Intent.SUCCESS});
            void filesRefetch();
            void refetchUser();
          }).catch((err: Error) => {
            GlobalToaster.show({message: err.message, intent: Intent.DANGER});
          });
        }).catch((err: Error) => {
          if(err.message) {
            GlobalToaster.show({message: err.message, intent: Intent.DANGER});
          }
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
    console.log(e);
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
            if(objectData?.fileObject.id) {
              const parent = toParent ? (objectData?.fileObject.parent?.id ?? "root") : objectData.fileObject.id;
              if(e.dataTransfer.items[0].type === "text/plain") {
                moveObject({variables: {objectIds: [stringValue], parent}}).then(() => {
                  void client.cache.gc();
                  void foldersRefetch();
                  void filesRefetch();
                }).catch((err: Error) => {
                  GlobalToaster.show({message: err.message, intent: Intent.DANGER});
                });
              } else if (e.dataTransfer.items[0].type === "application/json") {
                const idArray: string[] = JSON.parse(stringValue) as string[] ?? [];
                if(idArray && idArray.length > 0) {
                  moveObject({variables: {objectIds: idArray, parent}}).then(() => {
                    void client.cache.gc();
                  void foldersRefetch();
                  void filesRefetch();
                    void client.cache.gc();
                  }).catch((err: Error) => {
                    GlobalToaster.show({message: err.message, intent: Intent.DANGER});
                  });
                }
              }
            }
          });
        }
      }
    }
  };

  const clickHandler = function(e?: React.MouseEvent<HTMLElement, MouseEvent>, id?: string) {
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
    } else if(e?.shiftKey) {
      e.preventDefault();
      if(selected.length !== 0) {
        if(selected.length === 1 && selected[0] === id) {
          return;
        } else {
          if(filesData?.files && foldersData?.folders) {
            const newSelection: string[] = [];
            const cObjectArray = foldersData.folders.concat(filesData.files);
            const positionSelected = cObjectArray.findIndex((value) => value.id === selected[selected.length - 1]);
            const positionNewSelector = cObjectArray.findIndex((value) => value.id === id);
            const arrayToSearch = positionNewSelector > positionSelected ? 
              cObjectArray.slice(positionSelected, positionNewSelector + 1) : 
              cObjectArray.slice(positionNewSelector, positionSelected + 1) ;
            arrayToSearch.map((value) => newSelection.push(value.id));
            setSelected(newSelection);
          }
        }
      }
    } else if(selected.length !== 0) {
      setSelected([]);
    }
  };

  const determineReadmeComponent = function(): (JSX.Element | undefined) {
    const filtered = filesData?.files.filter((value) => {
      const lowerCase = value.name?.toLowerCase();
      if(lowerCase) {
        if(lowerCase === "readme.txt" || lowerCase === "readme" || lowerCase === "readme.md") {
          return true;
        }
      }
      return false;
    });
    
    if(filtered && filtered.length > 0) {
      return <ReadmeWrapper file={filtered[0]}/>;
    }
  };

  useEffect(() => {
    document.onclick = (e) => {
      if(document.getElementsByClassName("bp3-overlay-open").length > 0) {
        return;
      }
      if(!selected) {
        return;
      }
      if(!setSelected) {
        return;
      }
      if(!(selected.length === 0)) {
        const closestElement = document.elementFromPoint(e.clientX, e.clientY);
        if(!closestElement?.className) {
          return;
        }
        if(!closestElement?.className.includes("selected")) {
          if(!closestElement?.className.includes("FileButton") || !closestElement.className.includes("FileListButton") || (!e.ctrlKey && !e.shiftKey)) {
            setSelected([]);
          }
        }
      }
    };
  });

  const resetSelection = function() {
    setSelected([]);
  };

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
      className={`bp3-dark FilesComponent`}
      onDragOver={(e) => {
        e.preventDefault();
        if(e.dataTransfer.items[0] && e.dataTransfer.items[0].kind === "file") {
          setDragging(true);
        }
      }}
    >
      {objectData?.fileObject && <ReportDialog isOpen={showReport} onClose={() => setReport(false)} objectId={objectData.fileObject.id} objectType={reportObjectType.FILE} userId={objectData.fileObject.owner?.id ?? ""}/>}
      {isDragging && <div className="FilesComponent-drop-bg"
        onDrop={(e) => onDrop(e, false)}
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
      />}
      {isDragging && <div className="FilesComponent-drop-icon"
        onDrop={(e) => onDrop(e, false)}
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
        <Icon intent={Intent.SUCCESS} icon="cloud-upload" iconSize={200}/>
        <H2>Drop file to upload.</H2>
      </div>}
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
        {foldersData?.folders.map((value) => (<FileButton
          planet={props.planet}
          key={value.id}
          object={value}
          componentId={props.id}
          refetch={() => {void filesRefetch(); void foldersRefetch();}}
          onClick={clickHandler}
          selections={selected}
          resetSelection={resetSelection}
        />))}
        {filesData?.files.map((value) => (<FileButton
          planet={props.planet}
          key={value.id}
          object={value}
          componentId={props.id}
          refetch={() => {void filesRefetch(); void foldersRefetch();}}
          onClick={clickHandler}
          selections={selected}
          resetSelection={resetSelection}
        />))}
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
          resetSelection={resetSelection}
        />))}
        {filesData?.files.map((value) => (<FileListButton 
          planet={props.planet} 
          key={value.id}
          object={value}
          componentId={props.id}
          refetch={() => {void filesRefetch(); void foldersRefetch();}}
          onClick={clickHandler}
          selections={selected}
          resetSelection={resetSelection}
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
      <div className="FilesComponent-readme">
        {((objectData && objectData.fileObject.type === "folder") || !props.subId) && determineReadmeComponent()}
      </div>
      {((objectData && objectData.fileObject.type === "folder") || !props.subId) && <div className="FileComponent-status-spacer"/>}
      <div className="FilesComponent-statusbar">
        {((objectData && objectData.fileObject.type === "folder") || !props.subId) && <div className="FilesComponent-statusbar-count">
          {foldersData?.folders.length ?? 0} folders, {filesData?.files.length ?? 0} files
        </div>}
        {objectData && objectData.fileObject.type === "folder" && <Divider/>}
        {objectData && <div className="FilesComponent-statusbar-objectinfo">
          <Icon icon="user"/>
          <span>{objectData.fileObject.owner?.username}</span>
          <Icon icon="time"/>
          <span>{fileDate}</span>
          {objectData.fileObject.size && <>
            <Icon icon="folder-open"/>
            <span>{fileSize(objectData.fileObject.size ?? 0)}</span>
          </>}
        </div>}
        <div className="FilesComponent-uploading">
          {Object.values(uploading).length !== 0 && <div className="FilesComponent-uploading-container">
            <Icon className="FilesComponent-uploading-icon FilesComponent-uploading-icon-first" iconSize={16} icon="upload"/>
            <ProgressBar className="FilesComponent-uploading-progress" intent={Intent.PRIMARY} value={completed / total}/>
            <Popover>
              <Icon className="FilesComponent-uploading-icon" iconSize={16} icon="chevron-up"/>
              <div className="FilesComponent-uploading-info-container">
                {Object.values(uploading).map((value, index) => (<div key={index} className="FilesComponent-uploading-info">
                  <div className="FilesComponent-uploading-info-top">
                    <Text className="FilesComponent-uploading-info-name">{value.name}</Text>
                    <Icon className="FilesComponent-uploading-info-cancel" icon="cross" onClick={() => {
                      value.cancelToken.cancel();
                      cancelUpload({variables: {objectId: value.documentId}}).then(() => {
                        console.log(value.documentId);
                        GlobalToaster.show({message: `Upload of ${value.name} canceled.`, intent: Intent.SUCCESS});
                        delete uploading[Object.keys(uploading)[index]];
                        setTotal(Object.keys(uploading).length);
                        setUploadUpdateCounter(Math.random() * 300000000);
                      }).catch((err: Error) => {
                        GlobalToaster.show({message: err.message, intent: Intent.DANGER});
                      });
                    }}/>
                  </div>
                  <ProgressBar className="FilesComponent-uploading-info" value={value.progress} intent={Intent.PRIMARY}/>
                </div>))}
              </div>
            </Popover>
          </div>}
        </div>
      </div>
    </div> 
  );
}

export default FilesComponent;