import { faComment, faLock, faReply, faThumbtack } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useHistory } from "react-router-dom";
import Divider from "../../../components/display/Divider";
import Tag from "../../../components/display/Tag";
import Intent from "../../../components/Intent";
import IForumPost from "../../../types/IForumPost";
import IPlanet from "../../../types/IPlanet";
import "./css/ForumItem.css";

interface IForumItemProps {
  post: IForumPost,
  planet: IPlanet,
  stickied?: boolean,
  id: string,
  last? : boolean
}

function ForumItem(props: IForumItemProps): JSX.Element {
  const updateDate: Date = props.post.updatedAt ? new Date(Number(props.post.updatedAt)) : new Date("2020-07-25T15:24:30+00:00");
  const updateDateText: string = updateDate.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <Link to={`/planet/${props.planet.id}/${props.id}/${props.post.id}`} className="link-button">
      <div
        className={`flex px-4 py-2.5 hover:bg-gray-200 dark:hover:bg-gray-800 ${props.last ? "" : "border-b border-gray-300 dark:border-gray-600"} cursor-pointer`}
      >
        <div className="flex">
          <div className="w-4 mr-2 mt-0.5 inline-flex">
            <FontAwesomeIcon icon={props.post.stickied ? faThumbtack : faComment} className={props.post.stickied ? "mx-auto text-green-600 dark:text-green-300" : "mx-auto"}/>
          </div>
          <div className="inline-block">
            {props.post.name}
            {props.post.locked && <Tag className="ml-2" icon={faLock} intent={Intent.WARNING}>LOCKED</Tag>}
          </div>
        </div>
        <div className="ml-auto flex">
          {(props.post.replyCount && props.post.replyCount > 0) ? <div>
            <FontAwesomeIcon
              icon={faReply}
              className="mr-2"
            />
            <span>{props.post.replyCount}</span>
          </div> : <span/>}
          {(props.post.replyCount && props.post.replyCount > 0) ? <Divider/> : <span/>}
          <span>{updateDateText}</span>
        </div>
      </div>
    </Link>
  );

  /* return (
    <div className="ForumItem" onClick={() => history.push(`/planet/${props.planet.id}/${props.id}/${props.post.id}`)}>
      <div className="ForumItem-name">
        <span className={props.stickied ? "ForumItem-name-text ForumItem-stickied" : "ForumItem-name-text"}>{props.post.locked && <Icon icon="lock" color="#ffb366" className="ForumItem-stickied-pin" />} {props.stickied && <Icon icon="pin" color="#3dcc91" className="ForumItem-stickied-pin" />} {props.post.name}</span>
        <div className="ForumItem-name-flex">
          {props.post.tags && <div className="ForumItem-tags">{props.post.tags.map((value) => (<Tag className="ForumItem-tag" key={value}>{value}</Tag>))}</div>}
        </div>
        <div className="ForumItem-rightside">
          <div className="ForumItem-right-container">
            <Icon icon="comment" />
            <span className="ForumItem-replies">{props.post.replyCount}</span>
            {!isMobile() && <Divider />}
            {!isMobile() && <span className="ForumItem-updated">{updateDateText}</span>}
          </div>
        </div>
      </div>
      <div className="ForumItem-info">
        {!isMobile() && <div>Posted by {props.post.owner && props.post.owner.username} on {creationDateText}</div>}
        {isMobile() && <div>
          <Icon className="ForumItem-info-icon" icon="user" />
          {props.post.owner && props.post.owner.username}
          <Icon className="ForumItem-info-icon ForumItem-info-icon-2" icon="time" />
          {creationDateText}
        </div>}
      </div>
    </div>
  ); */
}

export default ForumItem;
