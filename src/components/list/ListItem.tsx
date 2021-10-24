import { HTMLProps } from "react";

interface IListItemProps extends HTMLProps<HTMLDivElement> {
  icon?: JSX.Element
  actions?: JSX.Element
}

function ListItem(props: IListItemProps): JSX.Element {
  return (
    <div className="flex h-10 border-b border-gray-300 dark:border-gray-600">
      {props.icon && <div className="my-auto mr-2">
        {props.icon}
      </div>}
      <div className="my-auto mr-auto">
        {props.children}
      </div>
      <div className="my-auto">
        {props.actions}
      </div>
    </div>
  );
}

export default ListItem;
