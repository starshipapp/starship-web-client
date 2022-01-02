import { useQuery } from "@apollo/client";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import Button from "../../components/controls/Button";
import getForumReply, { IGetForumReplyData } from "../../graphql/queries/components/forums/getForumReply";

interface IForumPostObjectProps {
  id: string
}

function ForumReplyObject(props: IForumPostObjectProps): JSX.Element {
  const {data} = useQuery<IGetForumReplyData>(getForumReply, {variables: {id: props.id}});

  return (
    <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded">
      {data?.forumReply && <>
        <div className="flex mb-1">
          <FontAwesomeIcon icon={faComment}/>
          <h3 className="text-document my-auto font-bold leading-none ml-1">Forum Reply</h3>
        </div>
        <div className="mb-2">
          <div className="text-gray-300 dark:text-gray-300">
            {new Date(Number(data.forumReply.createdAt)).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
          <div>
            {data.forumReply.content}
          </div>
        </div>
        <div>
          <Link className="link-button" to={`/planet/${data.forumReply.planet?.id ?? "null"}/${data.forumReply.component?.id ?? "null"}/${data.forumReply.post?.id ?? "null"}`}><Button small>Go To Post</Button></Link>
        </div>
      </>}
    </div>
  );
}

export default ForumReplyObject;
