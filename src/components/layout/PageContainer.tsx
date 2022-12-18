import { HTMLProps } from "react";

function PageContainer(props: HTMLProps<HTMLDivElement>): JSX.Element {
  return <div {...props} className={`p-4 w-full lg:mr-auto lg:ml-auto lg:w-10/12 lg:pt-6 lg:pb-10 ${props.className ?? ""}`}/>;
}

export default PageContainer;