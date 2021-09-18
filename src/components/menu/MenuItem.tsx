import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HTMLProps } from "react";

interface IMenuItemProps extends HTMLProps<HTMLDivElement> {
  icon?: IconProp;
  rightElement?: JSX.Element;
  description?: string;
}

function MenuItem(props: IMenuItemProps): JSX.Element {
  return (
    <div className="px-3 py-1.5 w-full flex flex-row justify-between cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700" {...props}>
      <div className="flex items-center w-full">
        {props.icon && (
          <FontAwesomeIcon
          className="mr-1.5 text-gray-600 dark:text-gray-300"
          icon={props.icon}
          size="lg"
          />
        )}
        <div className="flex-grow">
          <div className="font-semibold text-black dark:text-white">{props.children}</div>
          {props.description && (
            <div className="text-gray-600 dark:text-gray-300">{props.description}</div>
          )}
        </div>
        {props.rightElement && (
          <div className="ml-auto text-black dark:text-white">{props.rightElement}</div>
        )}
      </div>
    </div>
  );
}

export default MenuItem;