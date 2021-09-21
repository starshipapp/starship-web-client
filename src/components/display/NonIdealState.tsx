import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HTMLProps } from "react";

interface INonIdealStateProps extends HTMLProps<HTMLDivElement> {
  icon: IconProp;
  title: string;
}

function NonIdealState(props: INonIdealStateProps): JSX.Element {
  return (
    <div className={`w-full h-full flex ${props.className ?? ""}`} {...props}>
      <div className="m-auto">
        <div className="flex items-center flex-col">
          <div className="text-gray-500 dark:text-gray-400 mb-3">
            <FontAwesomeIcon icon={props.icon} size={"4x"} />
          </div>
          <div className="text-lg dark:text-white text-black font-extrabold mb-3">
            <h3 className="text-center m-0">{props.title}</h3>
          </div>
          <div className="dark:text-white text-black">
            <p className="text-center m-0 max-w-xs">
              {props.children}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NonIdealState;
