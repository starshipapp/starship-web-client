import { useMutation, useQuery } from "@apollo/client";
import { Button, Card, Icon, Intent } from "@blueprintjs/core";
import React from "react";
import { Link } from "react-router-dom";
import deleteForumReplyMutation, { IDeleteForumReplyMutationData } from "../../graphql/mutations/components/forums/deleteForumReplyMutation";
import getForumReply, { IGetForumReplyData } from "../../graphql/queries/components/forums/getForumReply";
import { GlobalToaster } from "../../util/GlobalToaster";

interface IForumPostObjectProps {
  id: string
}

function ForumReplyObject(props: IForumPostObjectProps): JSX.Element {
  const {data} = useQuery<IGetForumReplyData>(getForumReply, {variables: {id: props.id}});
  const [deletePost] = useMutation<IDeleteForumReplyMutationData>(deleteForumReplyMutation);

  return (
    <Card className="Report-object-card">
      {data?.forumReply && <>
        <div className="Report-object-card-header">
          <Icon icon="comment"/>
          <h3 className="Report-object-card-name">Forum Reply</h3>
        </div>
        <div className="Report-object-card-details">
          <div className="Report-object-card-date">
            {new Date(Number(data.forumReply.createdAt)).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
          <div>
            {data.forumReply.content}
          </div>
        </div>
        <div className="Report-object-card-actions">
          <Button text="Delete" intent={Intent.DANGER} onClick={() => {
            deletePost({variables: {replyId: props.id}}).then(() => {
              GlobalToaster.show({message: "Deleted post.", intent: Intent.SUCCESS});
            }).catch((error: Error) => {
              GlobalToaster.show({message: error.message, intent: Intent.DANGER});
            });
          }}/>
          <Link className="link-button" to={`/planet/${data.forumReply.planet?.id ?? "null"}/${data.forumReply.component?.id ?? "null"}/${data.forumReply.post?.id ?? "null"}`}><Button text="Go To Post"/></Link>
        </div>
      </>}
    </Card>
  );
}

export default ForumReplyObject;