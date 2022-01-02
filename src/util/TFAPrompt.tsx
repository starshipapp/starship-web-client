import { useState } from "react";
import Dialog from "../components/dialog/Dialog";
import Textbox from "../components/input/Textbox";

interface ITFAPromptProps {
  onSubmit: (key: number) => void
  isOpen: boolean
  onClose: () => void
}

function TFAPrompt(props: ITFAPromptProps): JSX.Element {
  const [keyTextbox, setTextbox] = useState<string>("");

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}
    >
      <div className="p-4 w-72">
        <div className="font-bold text-center">Enter the 6-digit code from your authenticator app or a 9-digit backup code.</div>
        <Textbox
          placeholder="000000"
          className="font-mono text-center mt-2 w-full"
          large
          onChange={(e) => setTextbox(e.target.value)}
          onKeyDown={(e) => {
            if(e.key === "Enter") {
              console.log(keyTextbox);
              console.log(Number(keyTextbox));
              props.onSubmit(Number(keyTextbox));
            }
          }}
        />
      </div>
    </Dialog>
  );
}

export default TFAPrompt;
