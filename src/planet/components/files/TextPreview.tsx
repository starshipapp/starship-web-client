import { Icon, Intent } from "@blueprintjs/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { GlobalToaster } from "../../../util/GlobalToaster";
import Markdown from "../../../util/Markdown";
import "./css/TextPreview.css";

interface ITextPreviewProps {
  fileURL: string,
  isMarkdown: boolean,
  name: string
}

let lastEffected = "";

function TextPreview(props: ITextPreviewProps): JSX.Element {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    if(lastEffected !== props.fileURL) {
      lastEffected = props.fileURL;
      axios.get(props.fileURL, {responseType: "text", transformResponse: (res) => {return res as string;}}).then((data) => {
        console.log(data);
        setText((data.data as string).replace("\n", "\n\n"));
      }).catch((err: Error) => {
        GlobalToaster.show({message: err.message, intent: Intent.DANGER});
      });
    }
  }, [text, props.fileURL, props.name]);

  return (
    <div className="TextPreview">
      <div className="TextPreview-name">
        <Icon icon="document" className="TextPreview-name-icon"/>
        <div className="TextPreview-name-text">
          {props.name}
        </div>
      </div>
      <div className="TextPreview-content">
        {props.isMarkdown ? <Markdown>{text}</Markdown> : <div>{text}</div>}
      </div>
    </div>
  );
}

export default TextPreview;