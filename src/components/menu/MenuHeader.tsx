import { HTMLProps } from "react";

function MenuHeader(props: HTMLProps<HTMLDivElement>) {
  return (
    <div {...props} className={`mt-1 mb-1 font-extrabold ml-3 uppercase text-black dark:text-white ${props.className ?? ""}`}/>
  );
}

export default MenuHeader;