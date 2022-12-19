import { HTMLProps } from "react";

function DialogBody(props: HTMLProps<HTMLDivElement>): JSX.Element {
  return (
    <div className={`w-screen max-w-screen p-6 flex flex-col outline-none md:w-2xl md:max-w-2xl ${props.className ?? ""}`}>
      {props.children}
    </div>
  );
}

export default DialogBody;
