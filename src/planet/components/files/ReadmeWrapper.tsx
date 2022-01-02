import { useQuery } from "@apollo/client";
import getObjectPreview, { IGetObjectPreview } from "../../../graphql/queries/components/files/getObjectPreview";
import IFileObject from "../../../types/IFileObject";
import TextPreview from "./TextPreview";

interface IReadmeWrapperProps {
  file: IFileObject
}

function ReadmeWrapper(props: IReadmeWrapperProps): JSX.Element {
  const {data} = useQuery<IGetObjectPreview>(getObjectPreview, {variables: {fileId: props.file.id}, fetchPolicy: "no-cache"});

  return (
    <>
      {data && <div className="mb-4"><TextPreview isMarkdown={props.file.name?.endsWith(".md") ?? false} fileURL={data.getObjectPreview} name={props.file.name ?? ""}/></div>}
    </>
  );
}

export default ReadmeWrapper;
