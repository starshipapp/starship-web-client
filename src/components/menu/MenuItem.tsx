import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HTMLProps } from "react";
import Intent from "../Intent";

interface IMenuItemProps extends HTMLProps<HTMLDivElement> {
  icon?: IconProp;
  rightElement?: JSX.Element;
  description?: string;
  intent?: Intent;
}

function MenuItem(props: IMenuItemProps): JSX.Element {
  let mainTextClass = "";
  let descriptionClass = "";

  switch (props.intent) {
    case Intent.PRIMARY:
      mainTextClass = "text-blue-600 dark:text-blue-300";
      descriptionClass = "text-blue-600 dark:text-blue-300";
      break;
    case Intent.SUCCESS:
      mainTextClass = "text-green-600 dark:text-green-300";
      descriptionClass = "text-green-600 dark:text-green-300";
      break;
    case Intent.WARNING:
      mainTextClass = "text-yellow-600 dark:text-yellow-300";
      descriptionClass = "text-yellow-600 dark:text-yellow-300";
      break;
    case Intent.DANGER:
      mainTextClass = "text-red-600 dark:text-red-300";
      descriptionClass = "text-red-600 dark:text-red-300";
      break;
    default:
      mainTextClass = "text-black dark:text-white";
      descriptionClass = "text-gray-600 dark:text-gray-300";
  }

  return (
    <div className="px-3 py-1.5 w-full flex flex-row justify-between cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700" {...props}>
      <div className="flex items-center w-full">
        {props.icon && (
          <div className="mr-1.5 w-6 flex-shrink-0 text-center content-center">
            <FontAwesomeIcon
              className={`${descriptionClass}`}
              icon={props.icon}
              size="lg"
            />
          </div>
        )}
        <div className="w-full overflow-hidden">
          <div className={`font-semibold overflow-ellipsis overflow-hidden whitespace-nowrap w-full ${mainTextClass}`}>{props.children}</div>
          {props.description && (
            <div className={descriptionClass}>{props.description}</div>
          )}
        </div>
        {props.rightElement && (
          <div className={`ml-auto ${mainTextClass}`}>{props.rightElement}</div>
        )}
      </div>
    </div>
  );
}

export default MenuItem;
