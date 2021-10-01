import { HTMLProps } from "react";

function PageContainer(props: HTMLProps<HTMLDivElement>): JSX.Element {
  return <div className="mr-auto ml-auto w-10/12 mt-6 mb-10" {...props}/>;
}

export default PageContainer;