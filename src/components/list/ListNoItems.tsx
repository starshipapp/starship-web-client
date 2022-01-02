import { HTMLProps } from "react";

interface IListItemProps extends HTMLProps<HTMLDivElement> {
  icon?: JSX.Element
  actions?: JSX.Element
}

function ListItem(props: IListItemProps): JSX.Element {
  return (
    <div className="flex w-full h-10 border-b border-gray-300 dark:border-gray-600">
      <div className="mx-auto flex">
        {props.icon && <div className="my-auto mr-2">
          {props.icon}
        </div>}
        <div className="my-auto">
          {props.children}
        </div>
        {props.actions && <div className="my-auto ml-2">
          {props.actions}
        </div>}
      </div>
    </div>
  );
}

export default ListItem;
