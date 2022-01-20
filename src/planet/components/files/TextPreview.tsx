import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import Toasts from "../../../components/display/Toasts";
import Markdown from "../../../util/Markdown";

interface ITextPreviewProps {
  fileURL: string,
  isMarkdown?: boolean,
  isCode?: boolean,
  name: string
}

let lastEffected = "";

function TextPreview(props: ITextPreviewProps): JSX.Element {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    if(lastEffected !== props.fileURL) {
      lastEffected = props.fileURL;
      axios.get(props.fileURL, {responseType: "text", transformResponse: (res) => {return res as string;}}).then((data) => {
        setText((data.data as string).replace("\n", "\n\n"));
      }).catch((err: Error) => {
        Toasts.danger(err.message);
      });
    }
  }, [text, props.fileURL, props.name]);

  return (
    <div className="max-w-full min-w-full border shadow-sm border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 mb-4 mt-3 p-3 rounded">
      <div className="flex pb-3 mb-2 border-b px-0.5 border-gray-300 dark:border-gray-700">
        <FontAwesomeIcon icon={faFile} className="mr-1.5" />
        <div className="font-extrabold text-base leading-none">
          {props.name}
        </div>
      </div>
      <div className="TextPreview-content">
        {props.isMarkdown ? <Markdown longForm>{text}</Markdown> : <pre className="p-0 bg-transparent dark:bg-transparent rounded-none">{text}</pre>}
      </div>
    </div>
  );
}

export default TextPreview;
