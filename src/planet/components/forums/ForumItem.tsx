import { Divider, Icon, Tag } from "@blueprintjs/core";
import React from "react";
import { useHistory } from "react-router-dom";
import IForumPost from "../../../types/IForumPost";
import IPlanet from "../../../types/IPlanet";
import "./css/ForumItem.css";

interface IForumItemProps {
  post: IForumPost,
  planet: IPlanet,
  stickied?: boolean,
  id: string
}

function ForumItem(props: IForumItemProps): JSX.Element {
  const updateDate: Date = props.post.updatedAt ? new Date(Number(props.post.updatedAt)) : new Date("2020-07-25T15:24:30+00:00");
  const updateDateText: string = updateDate.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const creationDate: Date = props.post.createdAt ? new Date(Number(props.post.createdAt)) : new Date("2020-07-25T15:24:30+00:00");
  const creationDateText: string = creationDate.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const history = useHistory();
  
  return (
    <tr className="ForumItem" onClick={() => history.push(`/planet/${props.planet.id}/${props.id}/${props.post.id}`)}>
      <td>
        <div className="ForumItem-name">
          <span className={props.stickied ? "ForumItem-name-text ForumItem-stickied" : "ForumItem-name-text"}>{props.post.locked && <Icon icon="lock" color="#ffb366" className="ForumItem-stickied-pin"/>} {props.stickied && <Icon icon="pin" color="#3dcc91" className="ForumItem-stickied-pin"/>} {props.post.name}</span>
          <div className="ForumItem-name-flex">
            {props.post.tags && <div className="ForumItem-tags">{props.post.tags.map((value) => (<Tag className="ForumItem-tag" key={value}>{value}</Tag>))}</div>}
          </div>
          <div className="ForumItem-rightside">
            <div className="ForumItem-right-container">
              <Icon icon="comment"/>
              <span className="ForumItem-replies">{props.post.replyCount}</span>
              <Divider/>
              <span className="ForumItem-updated">{updateDateText}</span>
            </div>
          </div>
        </div>
        <div className="ForumItem-info">
          <div>Posted by {props.post.owner && props.post.owner.username} on {creationDateText}</div>
        </div>
      </td>
    </tr>
  );
}

export default ForumItem;