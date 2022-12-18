import { HTMLProps } from "react";

function PageHeader(props: HTMLProps<HTMLDivElement>): JSX.Element {
  return <div>
    <div {...props} className={`absolute flex text-ellipsis top-0 left-0 p-4 h-13 border-b border-gray-300 whitespace-nowrap overflow-hidden dark:border-gray-600 bg-gray-50 dark:bg-gray-900 w-full z-10 font-extrabold md:whitespace-normal md:break-all md:text-clip md:z-auto md:w-auto md:border-b-0 md:p-0 md:bg-auto md:h-min md:static md:text-5xl md:font-extrabold md:mt-12 md:mb-3 ${props.className ?? ""}`}>
      {props.children}
      
    </div>
    <div className={`p-6 md:p-0`}/>
  </div>;
}

export default PageHeader;
