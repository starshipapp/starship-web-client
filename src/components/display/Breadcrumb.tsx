import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HTMLProps } from "react";

interface IBreadcrumbProps extends HTMLProps<HTMLDivElement> {
  icon?: IconProp;
  active?: boolean;
}

function Breadcrumb(props: IBreadcrumbProps): JSX.Element {
  return (
    <div {...props} className={`flex ${props.className ?? ""}`}>
      <div className="mr-1.5 flex hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer">
        <div className="my-auto">
          {props.icon && <FontAwesomeIcon icon={props.icon} />}
        </div>
        <div className={`ml-1 mt-1.5 ${props.active ? "font-extrabold" : "font-bold"}`}>{props.children}</div>
      </div>
      {!props.active && <div className="my-auto mr-2">
        <FontAwesomeIcon icon={faChevronRight}/>
      </div>}
    </div>
  );
}

export default Breadcrumb;
