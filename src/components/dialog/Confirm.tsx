import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { HTMLProps } from "react";
import Textbox from "../input/Textbox";
import Intent from "../Intent";
import Callout from "../text/Callout";
import Dialog from "./Dialog";

interface IConfirmProps extends HTMLProps<HTMLDivElement> {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  confirmString: string
}

function Confirm(props: IConfirmProps): JSX.Element {
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
    >
      <div className="p-4 w-screen md:w-96">
        <Callout icon={faExclamationTriangle} intent={Intent.WARNING}>{props.children}</Callout>
        <div className="mt-3 flex flex-col">
          <div className="mx-auto text-center">Please type <b>"{props.confirmString}"</b> to confirm.</div>
          <Textbox
            className="mt-3 w-full"
            intent={Intent.PRIMARY}
            onChange={(e) => {
              if (e.target.value === props.confirmString) {
                // Prevent stuttering during state change
                setTimeout(() => {
                  props.onConfirm();
                }, 100);
              }
            }}
          />
        </div>
      </div>
    </Dialog>
  );
}

export default Confirm;
