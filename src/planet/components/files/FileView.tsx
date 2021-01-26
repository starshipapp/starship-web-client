import { useQuery } from "@apollo/client";
import { Button, Icon, Intent } from "@blueprintjs/core";
import React from "react";
import getDownloadFileObject, { IGetDownloadFileObjectData } from "../../../graphql/queries/components/files/getDownloadFileObject";
import getObjectPreview, { IGetObjectPreview } from "../../../graphql/queries/components/files/getObjectPreview";
import IFileObject from "../../../types/IFileObject";
import { GlobalToaster } from "../../../util/GlobalToaster";
import MimeTypes from "../../../util/validMimes";
import "./css/FileView.css";

interface IFileViewProps {
  file: IFileObject
}

function FileView(props: IFileViewProps): JSX.Element {
  const {refetch} = useQuery<IGetDownloadFileObjectData>(getDownloadFileObject, {variables: {fileId: props.file.id}, errorPolicy: 'all', fetchPolicy: "standby"});
  const {data} = useQuery<IGetObjectPreview>(getObjectPreview, {variables: {fileId: props.file.id}});
  const date = props.file.createdAt ? new Date(Number(props.file.createdAt)) : new Date("2020-07-25T15:24:30+00:00");
  const fileDate = date.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="FileView">
      {MimeTypes.previewTypes.includes(props.file.fileType ?? "dummy/file") ? <div className="FileView-container">
        {props.file.owner && <div className="FileView-upload-info">Uploaded at {fileDate} by {props.file.owner.username}</div>}
        {MimeTypes.audioTypes.includes(props.file.fileType ?? "dummy/file") && data && <audio preload="auto" className="FileView-preview-audio" controls src={data.getObjectPreview}/>}
        {MimeTypes.imageTypes.includes(props.file.fileType ?? "dummy/file") && data && <img className="FileView-preview" src={data.getObjectPreview} alt="File preview"/>}
        {MimeTypes.videoTypes.includes(props.file.fileType ?? "dummy/file") && data && <video preload="auto" className="FileView-preview" controls src={data.getObjectPreview}/>}
      </div> : <div className="FileView-container">
        <Icon className="FileView-icon" icon="document" iconSize={128}/>
        <div className="FileView-name">{props.file.name}</div>
        {props.file.owner && <div className="FileView-upload-info">Uploaded at {fileDate} by {props.file.owner.username}</div>}
        <Button icon="download" className="FileView-button" text="Download" onClick={() => {
          refetch().then((data) => {
            if(data.data) {
              window.open(data.data.downloadFileObject, "_self");
            }
          }).catch((err: Error) => {
            GlobalToaster.show({message: err.message, intent: Intent.DANGER});
          });
        }}/>
      </div>}
    </div>
  );
}

export default FileView;