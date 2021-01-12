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
    <tbody className="ForumComponent-item-container">
      {props.forum.stickiedPosts && props.forum.stickiedPosts.map((value) => (<ForumItem key={value.id} post={value} planet={props.planet} stickied={true} id={props.id}/>))}
      {props.forum.posts && props.forum.posts.forumPosts.map((value) => (<ForumItem key={value.id} post={value} planet={props.planet} id={props.id}/>))}
      <tr>
        {/* TODO: Load on scroll to bottom */}
        {<td className="ForumComponent-loadmore">
          <Button text="Load More" onClick={props.loadMore}/>
        </td>}
      </tr>
    </tbody>
  );
}

export default ForumItemContainer;