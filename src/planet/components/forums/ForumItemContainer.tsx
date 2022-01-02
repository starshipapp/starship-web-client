import IForum from "../../../types/IForum";
import IPlanet from "../../../types/IPlanet";
import ForumItem from "./ForumItem";

interface IForumItemContainerProps {
  planet: IPlanet,
  id: string,
  forum: IForum,
  loadMore: () => void
}

function ForumItemContainer(props: IForumItemContainerProps): JSX.Element {
  return (
    <div className="border-gray-300 dark:border-gray-600 w-full flex flex-col" onScroll={(e) => {
      if(true) {
        return;
      }
    }}>
      {props.forum.stickiedPosts && props.forum.stickiedPosts.map((value, index) => (<ForumItem 
        key={value.id}
        post={value}
        planet={props.planet}
        stickied={true}
        id={props.id}
        last={index === (props.forum.stickiedPosts?.length ?? 1) - 1 && props.forum.posts?.forumPosts.length === 0}
      />))}
      {props.forum.posts && props.forum.posts.forumPosts.map((value, index) => (<ForumItem
        key={value.id}
        post={value}
        planet={props.planet}
        id={props.id}
        last={index === (props.forum.posts?.forumPosts.length ?? 1) - 1}
      />))}
      {/* TODO: Load on scroll to bottom */}
      {(((props.forum.posts?.forumPosts?.length ?? 1) + 1) % 60) === 0 && <div
        onClick={props.loadMore}
        className="w-full flex p-2 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
      >
        <div className="mx-auto">Load More</div>
      </div>}
    </div>
  );
}

export default ForumItemContainer;
