import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HTMLProps } from "react";

interface IBreadcrumbProps extends HTMLProps<HTMLDivElement> {
  icon?: IconProp;
  active?: boolean;
}

function Breadcrumb(props: IBreadcrumbProps): JSX.Element {
  return (
    <div {...props} className={`flex h-full ${props.active ? "text-black dark:text-white" : "text-gray-600 dark:text-gray-400"} ${props.className ?? ""}`}>
      <div className="mr-2 flex hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer flex-grow-0 h-full">
        <div className="mt-1">
          {props.icon && <FontAwesomeIcon icon={props.icon}/>}
        </div>
        <div className={`ml-2 mt-1 overflow-hidden max-w-xs overflow-ellipsis whitespace-nowrap ${props.active ? "font-extrabold" : "font-bold"}`}>{props.children}</div>
      </div>
      {!props.active && <div className="mt-1 mr-2.5 text-gray-600 dark:text-gray-400">
        <FontAwesomeIcon icon={faAngleRight}/>
      </div>}
    </div>
  );
}

export default Breadcrumb;
