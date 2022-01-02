import { useQuery } from "@apollo/client";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import Button from "../../components/controls/Button";
import getForumPost, { IGetForumPostData } from "../../graphql/queries/components/forums/getForumPost";

interface IForumPostObjectProps {
  id: string
}

function ForumPostObject(props: IForumPostObjectProps): JSX.Element {
  const {data} = useQuery<IGetForumPostData>(getForumPost, {variables: {id: props.id, count: 0, cursor: ""}});

  return (
    <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded">
      {data?.forumPost && <>
        <div className="flex mb-1">
          <FontAwesomeIcon icon={faComment}/>
          <h3 className="text-document my-auto font-bold leading-none ml-1">{data.forumPost.name}</h3>
        </div>
        <div className="mb-2">
          <div className="text-gray-300 dark:text-gray-300">
            {new Date(Number(data.forumPost.createdAt)).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
          <div>
            {data.forumPost.content}
          </div>
        </div>
        <div>
          <Link className="link-button" to={`/planet/${data.forumPost.planet?.id ?? "null"}/${data.forumPost.component?.id ?? "null"}/${data.forumPost.id}`}><Button small>Go To</Button></Link>
        </div>
      </>}
    </div>
  );
}

export default ForumPostObject;
