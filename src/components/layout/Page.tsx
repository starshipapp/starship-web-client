import { HTMLProps } from "react";

function Page(props: HTMLProps<HTMLDivElement>): JSX.Element {
  return <div className="bg-gray-50 dark:bg-gray-900 text-black dark:text-white h-max-content overflow-y-auto overflow-x-hidden w-full flex scrollbar scrollbar-track-white scrollbar-thumb-gray-400 dark:scrollbar-track-gray-900 dark:scrollbar-thumb-gray-600 scrollbar-thumb-rounded-full" {...props}/>;
}

export default Page;
