import { HTMLProps } from "react";

interface IListItemProps extends HTMLProps<HTMLDivElement> {
  icon?: JSX.Element
  actions?: JSX.Element
}

function ListItem(props: IListItemProps): JSX.Element {
  return (
    <div {...props} className={`flex h-10 border-b border-gray-300 dark:border-gray-600 ${props.className ?? ""}`}>
      {props.icon && <div className="my-auto mr-2">
        {props.icon}
      </div>}
      <div className="my-auto mr-auto max-w-full overflow-hidden flex-shrink">
        {props.children}
      </div>
      <div className="my-auto ml-2">
        {props.actions}
      </div>
    </div>
  );
}

export default ListItem;
