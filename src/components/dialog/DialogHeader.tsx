import { HTMLProps } from "react";

function DialogHeader(props: HTMLProps<HTMLDivElement>): JSX.Element {
  return (
    <div className={`text-4xl font-extrabold mb-2 ${props.className ?? ""}`}>
      {props.children}
    </div>
  );
}

export default DialogHeader;
