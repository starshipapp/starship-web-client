import { useMutation, useQuery } from "@apollo/client";
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
import permissions from "../../../util/permissions";
import { reportObjectType } from "../../../util/reportTypes";
import ReportDialog from "../../ReportDialog";
import IComponentProps from "../IComponentProps";
import { v4 } from "uuid";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import FileBreadcrumbs from "./FileBreadcrumbs";
import FileButton from "./FileButton";
import FileListButton from "./FileListButton";
import FileView from "./FileView";
import FileSearch from "./FileSearch";
import ReadmeWrapper from "./ReadmeWrapper";
import fileSize from "filesize";
import cancelUploadMutation, { ICancelUploadMutationData } from "../../../graphql/mutations/components/files/cancelUploadMutation";
import createMultiObjectDownloadTicketMutation, { ICreateMultiObjectDownloadTicketMutationData } from "../../../graphql/mutations/components/files/createMultiObjectDownloadTicketMutation";
import Toasts from "../../../components/display/Toasts";
import NonIdealState from "../../../components/display/NonIdealState";
import { faArrowUp, faCalendar, faChevronUp, faCloudUploadAlt, faDownload, faExclamationCircle, faFile, faFlag, faFolderPlus, faTimes, faUpload, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Textbox from "../../../components/input/Textbox";
import Divider from "../../../components/display/Divider";
import Button from "../../../components/controls/Button";
import Popover from "../../../components/overlays/Popover";
import ProgressBar from "../../../components/display/ProgressBar";
import Intent from "../../../components/Intent";
import PopperPlacement from "../../../components/PopperPlacement";

const uploading: Record<string, {name: string, progress: number, documentId: string, cancelToken: CancelTokenSource}> = {};

let hasTimedOut = true;

function FilesComponent(props: IComponentProps): JSX.Element {
  // Queries
  const {data: userData, client, refetch: refetchUser} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const {data: objectData, loading: objectLoading} = useQuery<IGetFileObjectData>(getFileObject, {variables: {id: props.subId}, errorPolicy: 'all'});
  const {data: foldersData, refetch: foldersRefetch} = useQuery<IGetFoldersData>(getFolders, {variables: {componentId: props.id, parent: (props.subId ?? "root")}, errorPolicy: 'all', fetchPolicy: "cache-and-network"});
  const {data: filesData, refetch: filesRefetch} = useQuery<IGetFilesData>(getFiles, {variables: {componentId: props.id, parent: (props.subId ?? "root")}, errorPolicy: 'all', fetchPolicy: "cache-and-network"});
  const {refetch} = useQuery<IGetDownloadFileObjectData>(getDownloadFileObject, {variables: {fileId: props.subId}, errorPolicy: 'all', fetchPolicy: "no-cache"});
  
  // Mutations
  const [uploadFileM] = useMutation<IUploadFileObjectMutationData>(uploadFileObjectMutation);
  const [completeUpload] = useMutation<ICompleteUploadMutationData>(completeUploadMutation);
  const [moveObject] = useMutation<IMoveObjectMutationData>(moveObjectMutation);
  const [createFolder] = useMutation<ICreateFolderMutationData>(createFolderMutation);
  const [cancelUpload] = useMutation<ICancelUploadMutationData>(cancelUploadMutation);
  const [createTicket] = useMutation<ICreateMultiObjectDownloadTicketMutationData>(createMultiObjectDownloadTicketMutation);

  // Refs
  const fileInput = useRef<HTMLInputElement>(null);

  // State
  const [showReport, setReport] = useState<boolean>(false);
  const [newFolderTextbox, setNewFolderTextbox] = useState<string>("");
  const [, setUploadUpdateCounter] = useState<number>(0); // Used to force a re-render when uploading
  const [createFolderPrompt, setCreateFolderPrompt] = useState<boolean>(false);
  const [listView] = useState<boolean>(window.localStorage.getItem("files.listView") === "true" ? true : false);
  const [isDragging, setDragging] = useState<boolean>(false);
  const [searchTextbox, setSearchTextbox] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [selected, setSelected] = useState<string[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [completed, setCompleted] = useState<number>(0);
  const [showUploading, setShowUploading] = useState<boolean>(false);

  console.log(selected);

  const date = objectData?.fileObject?.createdAt ? new Date(Number(objectData?.fileObject.createdAt)) : new Date("2020-07-25T15:24:30+00:00");
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
        }, cancelToken: uploading[currentIndex].cancelToken.token};
        setTotal(Object.keys(uploading).length);
        axios.put(data.data.uploadFileObject.uploadUrl, file, options).then(() => {
          completeUpload({variables: {objectId: data.data?.uploadFileObject.documentId}}).then(() => {
            Toasts.success(`${file.name} uploaded successfully.`);
            void filesRefetch();
            void refetchUser();
          }).catch((err: Error) => {
            Toasts.danger(err.message);
          });
        }).catch((err: Error) => {
          if(err.message) {
            Toasts.danger(err.message);
          }
        });
      }
    }).catch((err: Error) => {
      Toasts.danger(err.message);
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
        } else if(e.dataTransfer.items[0] && e.dataTransfer.items[0].kind === "string") {
          const type = e.dataTransfer.items[0].type;
          e.dataTransfer.items[i].getAsString((stringValue) => {
            if(objectData?.fileObject.id) {
              const parent = toParent ? (objectData?.fileObject.parent?.id ?? "root") : objectData.fileObject.id;
              if(type === "text/plain") {
                moveObject({variables: {objectIds: [stringValue], parent}}).then(() => {
                  void client.cache.gc();
                  void foldersRefetch();
                  void filesRefetch();
                }).catch((err: Error) => {
                  Toasts.danger(err.message);
                });
              } else if (type === "application/json") {
                const idArray: string[] = JSON.parse(stringValue) as string[] ?? [];
                if(idArray && idArray.length > 0) {
                  moveObject({variables: {objectIds: idArray, parent}}).then(() => {
                    void client.cache.gc();
                  void foldersRefetch();
                  void filesRefetch();
                    void client.cache.gc();
                  }).catch((err: Error) => {
                    Toasts.danger(err.message);
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
    if(e?.ctrlKey && id && hasTimedOut) {
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
    } else if(e?.shiftKey && hasTimedOut) {
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
    } else if(selected.length !== 0 && hasTimedOut) {
      setSelected([]);
    }
  
    hasTimedOut = false;
    setTimeout(() => {
      hasTimedOut = true;
    }, 500);
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

  const createFolderButton = function() {
    const parent = objectData?.fileObject ? objectData.fileObject.id : "root";
    createFolder({variables: {componentId: props.id, parent, name: newFolderTextbox}}).then(() => {
      void foldersRefetch();
      Toasts.success(`Folder ${newFolderTextbox} created successfully.`);
      setNewFolderTextbox("");
      setCreateFolderPrompt(false);
    }).catch((err: Error) => {
      Toasts.danger(err.message);
    });
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
      if(!(selected.length === 0) && hasTimedOut) {
        const closestElement = document.elementFromPoint(e.clientX, e.clientY);
        if(!closestElement?.className) {
          return;
        }
        if(!closestElement?.className.includes("selected")) {
          if((!e.ctrlKey && !e.shiftKey)) {
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
        className="w-full h-full flex"
      >
        <NonIdealState
          icon={faExclamationCircle}
          title="404"
        >The requested file/folder could not be found.</NonIdealState>
      </div>
    );
  }

  return (
    <div 
      className={`bp3-dark w-full h-full flex flex-col text-black dark:text-white`}
      onDragOver={(e) => {
        e.preventDefault();
        if(e.dataTransfer.items[0] && e.dataTransfer.items[0].kind === "file") {
          setDragging(true);
        }
      }}
      onDrop={(e) => e.preventDefault()}
    >
      {objectData?.fileObject && <ReportDialog isOpen={showReport} onClose={() => setReport(false)} objectId={objectData.fileObject.id} objectType={reportObjectType.FILE} userId={objectData.fileObject.owner?.id ?? ""}/>}
      {isDragging && <div className="block absolute top-0 left-0 w-screen h-screen z-50 bg-gray-600 bg-opacity-50"
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
      {isDragging && <div className="block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-50 pointer-events-none"
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
        <FontAwesomeIcon icon={faCloudUploadAlt} size="10x" className="text-black dark:text-green-600"/>
        <h2>Drop file to upload.</h2>
      </div>}
      <div className="w-full flex p-2 border-b border-gray-300 dark:border-gray-600 sticky top-0 bg-gray-900">
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
        {(objectData?.fileObject || !props.subId) && <FileBreadcrumbs name={props.name} path={objectData?.fileObject.path ? objectData.fileObject.path.concat([objectData.fileObject.id]) : ["root"]} componentId={props.id} planetId={props.planet.id} resetSearch={resetSearch}/>}
        {(objectData?.fileObject || !props.subId) && <Textbox
          placeholder="Search"
          className="flex-grow-0 mr-1.5 my-auto"
          small
          value={searchTextbox}
          onKeyDown={(e) => {
            if(e.key === "Enter") {
              if(searchTextbox.length < 3 && searchTextbox !== "") {
                Toasts.danger("Search term must be at least 3 characters long.");
              } else if(searchTextbox.length === 0) {
                resetSearch();
              } else {
                setSearchText(searchTextbox);
              }
            }
          }}
          onChange={(e) => {
            setSearchTextbox(e.target.value);
          }}
        />}
        <Divider/>
        {objectData?.fileObject && objectData?.fileObject.type === "file" && <div>
          <Button
            icon={faDownload}
            minimal
            onClick={() => {
              refetch().then((data) => {
                if(data.data) {
                  window.open(data.data.downloadFileObject, "_self");
                }
              }).catch((err: Error) => {
                Toasts.danger(err.message);
              });
            }}
          >Download</Button>
          {userData?.currentUser && <Button icon={faFlag} minimal onClick={() => setReport(true)}>Report</Button>}
        </div>}
        {objectData?.fileObject && objectData?.fileObject.type === "folder" && filesData?.files && <Button
          icon={faDownload}
          minimal
          onClick={() => {
            const files: string[] = filesData.files.map((value) => value.id);

            createTicket({variables: {objectIds: files, zipName: objectData.fileObject.name}}).then((data) => {
              if(data.data) {
                window.open(`http://localhost:4000/files/download/${data.data.createMultiObjectDownloadTicket}`, "_self");
              } 
            }).catch((e: Error) => {
              Toasts.danger(e.message);
            });
          }}
        >Download Folder</Button>}
        {userData?.currentUser && permissions.checkFullWritePermission(userData?.currentUser, props.planet) && ((objectData?.fileObject && objectData.fileObject.type === "folder") || !props.subId) && <>
          <Button 
            icon={faUpload}
            minimal
            onClick={() => {
              if(fileInput) {
                fileInput.current?.click();
              }
            }}
          >Upload</Button>
          <Popover
            open={createFolderPrompt}
            onClose={() => setCreateFolderPrompt(false)}
            className="h-full" 
            popoverTarget={<Button icon={faFolderPlus} minimal onClick={() => setCreateFolderPrompt(true)}>Create Folder</Button>}
          >
            <div className="flex">
              <Textbox
                placeholder="Folder name"
                value={newFolderTextbox}
                onChange={(e) => setNewFolderTextbox(e.target.value)}
                onKeyDown={(e) => {
                  if(e.key === "Enter") {
                    createFolderButton(); 
                  }
                }}
              />
              <Button
                icon={faFolderPlus}
                className="ml-2"
                onClick={() => {
                  createFolderButton();
                }}
              >Create</Button>
            </div>
          </Popover>
        </>}
      </div>
      {((objectData && objectData.fileObject.type === "folder") || !props.subId) && searchText === "" && !listView && <div
        className="grid grid-cols-auto-xs w-full p-2"
      >
        {props.subId && objectData && <Link className="link-button" to={`/planet/${props.planet.id}/${props.id}/${objectData.fileObject.parent?.id ?? ""}`}>
          <div
            className={`transition-all duration-200 flex bg-gray-200 ring-1 ring-gray-300 hover:bg-gray-300 dark:bg-gray-700 dark:ring-gray-600 dark:hover:bg-gray-600 
            active:bg-gray-400 dark:active:bg-gray-800 px-3 py-2 text-base rounded-sm m-2 overflow-hidden leading-tight outline-none focus:outline-none focus:ring-blue-300 
            focus:ring-1 dark:focus:ring-blue-600 shadow-md active:shadow-sm`}
            onDrop={(e) => onDrop(e, true)}
          >
            <FontAwesomeIcon className="my-auto mr-2 text-gray-600 dark:text-gray-300" icon={faArrowUp}/>
            <div className="whitespace-nowrap overflow-hidden overflow-ellipsis">../</div>
          </div>
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
      {((objectData && objectData.fileObject.type === "folder") || !props.subId) && searchText === "" && listView && <div>
        {props.subId && objectData && <Link className="link-button" to={`/planet/${props.planet.id}/${props.id}/${objectData.fileObject.parent?.id ?? ""}`}>
          <div className="flex px-4 py-2.5 border-b hover:bg-gray-200 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600" onDrop={(e) => onDrop(e, true)}>
            <div className="flex">
              <div className="w-4 mr-2 mt-0.5 inline-flex">
                <FontAwesomeIcon className="mx-auto" icon={faArrowUp}/>
              </div>
              <div className="inline-block">
                ../
              </div>
            </div>
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
      <div className={`mx-4 ${listView ? "mt-1" : "-mt-2"}`}>
        {((objectData && objectData.fileObject.type === "folder") || !props.subId) && determineReadmeComponent()}
      </div>
      {('netscape' in window) && <div id="firefox-sticky-spacer" className="p-5"/>}
      <div className={`flex sticky p-2 bottom-0 w-full bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-600 ${(objectData && objectData.fileObject.type === "folder") || !objectData ? "mt-auto" : ""}`}>
        {((objectData && objectData.fileObject.type === "folder") || !props.subId) && <div className="mr-1">
          {foldersData?.folders.length ?? 0} folders, {filesData?.files.length ?? 0} files
        </div>}
        {objectData && objectData.fileObject.type === "folder" && <Divider/>}
        {objectData && <div className="ml-1">
          <FontAwesomeIcon icon={faUser} className="mr-1"/>
          <span>{objectData.fileObject.owner?.username}</span>
          <FontAwesomeIcon icon={faCalendar} className="ml-2 mr-1"/>
          <span>{fileDate}</span>
          {objectData.fileObject.size && <>
            <FontAwesomeIcon icon={faFile} className="ml-2 mr-1"/>
            <span>{fileSize(objectData.fileObject.size ?? 0)}</span>
          </>}
        </div>}
        <div className="flex flex-col ml-auto">
          {Object.values(uploading).length !== 0 && <div className="flex mt-auto mb-auto flex-row">
            <FontAwesomeIcon icon={faUpload}/>
            <ProgressBar className="w-48 mx-2 flex-grow-0 h-2 my-auto cursor-pointer" intent={Intent.PRIMARY} progress={completed / total} onClick={() => setShowUploading(true)}/>
            <Popover
              popoverTarget={<FontAwesomeIcon icon={faChevronUp} className="cursor-pointer" onClick={() => setShowUploading(true)}/>}
              onClose={() => setShowUploading(false)}
              placement={PopperPlacement.topEnd}
              open={showUploading}
            >
              <div className="-mt-2">
                {Object.values(uploading).map((value, index) => (<div key={index} className="w-64">
                  <div className="flex overflow-hidden w-full mb-1 mt-2">
                    <div className="flex overflow-hidden whitespace-nowrap overflow-ellipsis">{value.name}</div>
                    <FontAwesomeIcon className="FilesComponent-uploading-info-cancel ml-1.5 my-auto cursor-pointer" icon={faTimes} onClick={() => {
                      value.cancelToken.cancel();
                      cancelUpload({variables: {objectId: value.documentId}}).then(() => {
                        Toasts.success(`Upload of ${value.name} cancelled.`);
                        delete uploading[Object.keys(uploading)[index]];
                        setTotal(Object.keys(uploading).length);
                        setUploadUpdateCounter(Math.random() * 300000000);
                      }).catch((err: Error) => {
                        Toasts.danger(err.message);
                      });
                    }}/>
                  </div>
                  <ProgressBar className="" progress={value.progress} intent={Intent.PRIMARY}/>
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
