import { useMutation, useQuery } from "@apollo/client";
import { Button, Card, Icon, Intent } from "@blueprintjs/core";
import { Link } from "react-router-dom";
import deleteFileObjectMutation, { IDeleteFileObjectMutationData } from "../../graphql/mutations/components/files/deleteFileObjectMutation";
import getFileObject, { IGetFileObjectData } from "../../graphql/queries/components/files/getFileObject";
import { GlobalToaster } from "../../util/GlobalToaster";

interface IForumPostObjectProps {
  id: string
}

function FileObject(props: IForumPostObjectProps): JSX.Element {
  const {data} = useQuery<IGetFileObjectData>(getFileObject, {variables: {id: props.id, count: 0, cursor: ""}});
  const [deleteFile] = useMutation<IDeleteFileObjectMutationData>(deleteFileObjectMutation);

  return (
    <Card className="Report-object-card">
      {data?.fileObject && <>
        <div className="Report-object-card-header">
          <Icon icon="document"/>
          <h3 className="Report-object-card-name">{data.fileObject.name}</h3>
        </div>
        <div className="Report-object-card-details">
          <div className="Report-object-card-date">
            {new Date(Number(data.fileObject.createdAt)).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
        <div className="Report-object-card-actions">
          <Button text="Delete" intent={Intent.DANGER} onClick={() => {
            deleteFile({variables: {objectId: props.id}}).then(() => {
              GlobalToaster.show({message: "Deleted file.", intent: Intent.SUCCESS});
            }).catch((error: Error) => {
              GlobalToaster.show({message: error.message, intent: Intent.DANGER});
            });
          }}/>
          <Link className="link-button" to={`/planet/${data.fileObject.planet?.id ?? "null"}/${data.fileObject.component?.id ?? "null"}/${data.fileObject.id}`}><Button text="Go To"/></Link>
        </div>
      </>}
    </Card>
  );
}

export default FileObject;
