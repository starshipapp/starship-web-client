import { useQuery } from "@apollo/client";
import React from "react";
import getObjectPreview, { IGetObjectPreview } from "../../../graphql/queries/components/files/getObjectPreview";
import IFileObject from "../../../types/IFileObject";
import MimeTypes from "../../../util/validMimes";
import TextPreview from "./TextPreview";

interface IReadmeWrapperProps {
  file: IFileObject
}

function ReadmeWrapper(props: IReadmeWrapperProps): JSX.Element {
  const {data} = useQuery<IGetObjectPreview>(getObjectPreview, {variables: {fileId: props.file.id}, fetchPolicy: "no-cache"});

  return (
    <>
      {data && <TextPreview isMarkdown={props.file.name?.endsWith(".md") ?? false} fileURL={data.getObjectPreview} name={props.file.name ?? ""}/>}
    </>
  );
}

export default ReadmeWrapper;