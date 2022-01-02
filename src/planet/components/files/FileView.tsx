import { useQuery } from "@apollo/client";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../../components/controls/Button";
import Toasts from "../../../components/display/Toasts";
import getDownloadFileObject, { IGetDownloadFileObjectData } from "../../../graphql/queries/components/files/getDownloadFileObject";
import getObjectPreview, { IGetObjectPreview } from "../../../graphql/queries/components/files/getObjectPreview";
import IFileObject from "../../../types/IFileObject";
import getIconFromType from "../../../util/getIconFromType";
import MimeTypes from "../../../util/validMimes";
import TextPreview from "./TextPreview";

interface IFileViewProps {
  file: IFileObject
}

function FileView(props: IFileViewProps): JSX.Element {
  const {refetch} = useQuery<IGetDownloadFileObjectData>(getDownloadFileObject, {variables: {fileId: props.file.id}, errorPolicy: 'all', fetchPolicy: "standby"});
  const {data} = useQuery<IGetObjectPreview>(getObjectPreview, {variables: {fileId: props.file.id}, fetchPolicy: "no-cache"});

  return (
    <div className="flex h-full max-h-full w-full max-w-full overflow-hidden">
      {MimeTypes.previewTypes.includes(props.file.fileType ?? "application/octet-stream") ? <div className="m-auto flex flex-col h-full max-h-full w-full max-w-full">
        {MimeTypes.audioTypes.includes(props.file.fileType ?? "application/octet-stream") && data && <audio preload="auto" className="w-lg m-auto" controls src={data.getObjectPreview}/>}
        {MimeTypes.imageTypes.includes(props.file.fileType ?? "application/octet-stream") && data && <img className="max-w-full max-h-full object-scale-down m-auto" src={data.getObjectPreview} alt="File preview"/>}
        {MimeTypes.videoTypes.includes(props.file.fileType ?? "application/octet-stream") && data && <video preload="auto" className="max-w-full max-h-full m-auto" controls src={data.getObjectPreview}/>}
        {MimeTypes.textTypes.includes(props.file.fileType ?? "application/octet-stream") && data && <div className=" overflow-auto px-4 pt-2"><TextPreview
          isMarkdown={props.file.name?.endsWith(".md") ?? false}
          fileURL={data.getObjectPreview}
          name={props.file.name ?? ""}
          isCode={MimeTypes.codeTypes.includes(props.file.fileType ?? "application/octet-stream")}
        /></div>}
        {props.file.fileType === "application/pdf" && data && <object height="100%" width="100%" type="application/pdf" data={data.getObjectPreview}>Failed to load PDF.</object>}
      </div> : <div className="m-auto items-center text-center">
        <FontAwesomeIcon icon={getIconFromType(props.file.fileType ?? "application/octet-stream")} size="8x"/>
        <div className="my-2 font-bold text-2xl">{props.file.name}</div>
        <Button icon={faDownload} onClick={() => {
          refetch().then((data) => {
            if(data.data) {
              window.open(data.data.downloadFileObject, "_self");
            }
          }).catch((err: Error) => {
            Toasts.danger(err.message);
          });
        }}>Download</Button>
      </div>}
    </div>
  );
}

export default FileView;
