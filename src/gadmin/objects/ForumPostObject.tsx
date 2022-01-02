import { useMutation, useQuery } from "@apollo/client";
import { Button, Card, Icon, Intent } from "@blueprintjs/core";
import { Link } from "react-router-dom";
import deleteForumPostMutation, { IDeleteForumPostMutationData } from "../../graphql/mutations/components/forums/deleteForumPostMutation";
import getForumPost, { IGetForumPostData } from "../../graphql/queries/components/forums/getForumPost";
import { GlobalToaster } from "../../util/GlobalToaster";

interface IForumPostObjectProps {
  id: string
}

function ForumPostObject(props: IForumPostObjectProps): JSX.Element {
  const {data} = useQuery<IGetForumPostData>(getForumPost, {variables: {id: props.id, count: 0, cursor: ""}});
  const [deletePost] = useMutation<IDeleteForumPostMutationData>(deleteForumPostMutation);

  return (
    <Card className="Report-object-card">
      {data?.forumPost && <>
        <div className="Report-object-card-header">
          <Icon icon="send-message"/>
          <h3 className="Report-object-card-name">{data.forumPost.name}</h3>
        </div>
        <div className="Report-object-card-details">
          <div className="Report-object-card-date">
            {new Date(Number(data.forumPost.createdAt)).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
        <div className="Report-object-card-actions">
          <Button text="Delete" intent={Intent.DANGER} onClick={() => {
            deletePost({variables: {postId: props.id}}).then(() => {
              GlobalToaster.show({message: "Deleted post.", intent: Intent.SUCCESS});
            }).catch((error: Error) => {
              GlobalToaster.show({message: error.message, intent: Intent.DANGER});
            });
          }}/>
          <Link className="link-button" to={`/planet/${data.forumPost.planet?.id ?? "null"}/${data.forumPost.component?.id ?? "null"}/${data.forumPost.id}`}><Button text="Go To"/></Link>
        </div>
      </>}
    </Card>
  );
}

export default ForumPostObject;
