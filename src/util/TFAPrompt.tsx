import { Alert, Classes } from "@blueprintjs/core";
import React, { useState } from "react";
import "./css/TFAPrompt.css";

interface ITFAPromptProps {
  onSubmit: (key: number) => void
  isOpen: boolean
  onClose: () => void
}

function TFAPrompt(props: ITFAPromptProps): JSX.Element {
  const [keyTextbox, setTextbox] = useState<string>("");

  return (
    <Alert
      onClose={props.onClose}
      canOutsideClickCancel={true}
      onConfirm={() => {
        props.onSubmit(Number(keyTextbox));
        setTextbox("");
      }}
      className={`TFAPrompt ${Classes.DARK}`}
      isOpen={props.isOpen}
    >
      <div className="TFAPrompt-text">
        Enter 6-digit authenticator code or 9-digit backup code
      </div>
      <input
        className={`${Classes.INPUT} ${Classes.LARGE} TFAPrompt-textbox`}
        value={keyTextbox}
        onChange={(e) => setTextbox(e.target.value)}
        onKeyDown={(e) => {
          if(e.key === "Enter") {
            props.onSubmit(Number(keyTextbox));
            setTextbox("");
          }
        }}
      />
    </Alert>
  );
}

export default TFAPrompt;