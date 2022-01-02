import { HTMLProps } from "react";

function DialogBody(props: HTMLProps<HTMLDivElement>): JSX.Element {
  return (
    <div className={`w-2xl max-w-2xl p-6 flex flex-col outline-none ${props.className ?? ""}`}>
      {props.children}
    </div>
  );
}

export default DialogBody;
