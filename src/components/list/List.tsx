import { HTMLProps } from "react";

interface IListProps extends HTMLProps<HTMLDivElement> {
  name?: string
  actions?: JSX.Element
}

function List(props: IListProps): JSX.Element {
  return (
    <div {...props}>
      <div className="flex h-10 items-center">
        {props.name && <div className="text-gray-600 dark:text-gray-300 font-extrabold uppercase m-auto ml-0">
          {props.name}
        </div>}
        {props.actions}
      </div>
      <div className="border-t border-gray-300 dark:border-gray-600">
        {props.children}
      </div>
    </div>
  );
}

export default List;
