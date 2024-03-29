import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HTMLProps, useState } from "react";
import MenuItem from "./MenuItem";

interface IMenuItemProps extends HTMLProps<HTMLDivElement> {
  icon?: IconProp;
  description?: string;
  title: string;
  open?: boolean;
  onOpen?: () => void;
}

function MenuCollapsed(props: IMenuItemProps): JSX.Element {
  const [open, setOpen] = useState(props.open ?? false);
  
  if((props.open === true || props.open === false) && props.open !== open) {
    setOpen(props.open);
  }

  return (
    <>
      <MenuItem 
        icon={props.icon} 
        rightElement={<FontAwesomeIcon icon={open ? faCaretDown : faCaretRight}/>} 
        description={props.description}
        onClick={() => {
          setOpen(!open);
          if(props.onOpen) {
            props.onOpen();
          }
        }}
      >
        {props.title}
      </MenuItem>
      <div className={`bg-gray-100 shadow-inner dark:bg-gray-900 ${!open ? "max-h-0 py-0 overflow-hidden" : "py-1"}`}>
        {props.children}
      </div>
    </>
  );
}

export default MenuCollapsed;