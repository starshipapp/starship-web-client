import { HTMLProps } from "react";

function Page(props: HTMLProps<HTMLDivElement>): JSX.Element {
  return <div className="bg-gray-50 dark:bg-gray-900 text-black dark:text-white h-max-content overflow-y-scroll w-full" {...props}/>;
}

export default Page;