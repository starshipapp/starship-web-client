import { HTMLProps } from "react";

function PageContainer(props: HTMLProps<HTMLDivElement>): JSX.Element {
  return <div {...props} className={`mr-auto ml-auto w-10/12 pt-6 pb-10 ${props.className ?? ""}`}/>;
}

export default PageContainer;