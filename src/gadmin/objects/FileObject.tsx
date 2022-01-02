import { useQuery } from "@apollo/client";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import Button from "../../components/controls/Button";
import getFileObject, { IGetFileObjectData } from "../../graphql/queries/components/files/getFileObject";

interface IForumPostObjectProps {
  id: string
}

function FileObject(props: IForumPostObjectProps): JSX.Element {
  const {data} = useQuery<IGetFileObjectData>(getFileObject, {variables: {id: props.id, count: 0, cursor: ""}});

  return (
    <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded">
      {data?.fileObject && <>
        <div className="flex mb-1">
          <FontAwesomeIcon icon={faFile}/>
          <h3 className="text-document my-auto font-bold leading-none ml-1">{data.fileObject.name}</h3>
        </div>
        <div className="mb-2">
          <div className="text-gray-300 dark:text-gray-300">
            {new Date(Number(data.fileObject.createdAt)).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
        <div>
          <Link className="link-button" to={`/planet/${data.fileObject.planet?.id ?? "null"}/${data.fileObject.component?.id ?? "null"}/${data.fileObject.id}`}><Button small>Go To</Button></Link>
        </div>
      </>}
    </div>
  );
}

export default FileObject;
