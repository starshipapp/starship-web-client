import { Button } from "@blueprintjs/core";
import React from "react";
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
  console.log(props.forum);
  return (
    <div className="ForumComponent-item-container" onScroll={(e) => {
      console.log(e);
      if(true) {
        return;
      }
    }}>
      {props.forum.stickiedPosts && props.forum.stickiedPosts.map((value) => (<ForumItem key={value.id} post={value} planet={props.planet} stickied={true} id={props.id}/>))}
      {props.forum.posts && props.forum.posts.forumPosts.map((value) => (<ForumItem key={value.id} post={value} planet={props.planet} id={props.id}/>))}
      {/* TODO: Load on scroll to bottom */}
      {<div className="ForumComponent-loadmore">
        <Button text="Load More" onClick={props.loadMore}/>
      </div>}
    </div>
  );
}

export default ForumItemContainer;