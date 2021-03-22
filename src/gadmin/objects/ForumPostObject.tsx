import { useQuery } from "@apollo/client";
import { Button, Card, Icon, Intent } from "@blueprintjs/core";
import React from "react";
import { Link } from "react-router-dom";
import getForumPost, { IGetForumPostData } from "../../graphql/queries/components/forums/getForumPost";

interface IForumPostObjectProps {
  id: string
}

function ForumPostObject(props: IForumPostObjectProps): JSX.Element {
  const {data} = useQuery<IGetForumPostData>(getForumPost, {variables: {id: props.id, count: 0, cursor: ""}});
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
          <Button text="Delete" intent={Intent.DANGER}/>
          <Link className="link-button" to={`/planet/${data.forumPost.planet?.id ?? "null"}/${data.forumPost.component?.id ?? "null"}/${data.forumPost.id}`}><Button text="Go To"/></Link>
        </div>
      </>}
    </Card>
  );
}

export default ForumPostObject;