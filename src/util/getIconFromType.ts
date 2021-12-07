import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faArchive, faCode, faFile, faFileCode, faFilePdf, faHdd, faImage, faMusic, faVideo } from "@fortawesome/free-solid-svg-icons";
import MimeTypes from "./validMimes";

function getIconFromType(type: string): IconProp {
  console.log(type);
  if(MimeTypes.audioTypes.includes(type)) return faMusic;
  if(MimeTypes.videoTypes.includes(type)) return faVideo;
  if(MimeTypes.imageTypes.includes(type)) return faImage;
  if(MimeTypes.codeTypes.includes(type)) return faCode;
  if(MimeTypes.archiveTypes.includes(type)) return faArchive;
  if(MimeTypes.executableTypes.includes(type)) return faFileCode;
  if(MimeTypes.diskTypes.includes(type)) return faHdd;
  if(type === "application/pdf") return faFilePdf;
  return faFile;
}

export default getIconFromType;
