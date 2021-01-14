import { useMutation, useQuery } from "@apollo/client";
import { Button, ButtonGroup, Menu, Popover, MenuItem, Divider, Classes, MenuDivider, Intent } from "@blueprintjs/core";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import createForumTagMutation, { ICreateForumTagMutationData } from "../../../graphql/mutations/components/forums/createForumTagMutation";
import removeForumTagMutation, { IRemoveForumTagMutationData } from "../../../graphql/mutations/components/forums/removeForumTagMutation";
import getForum, { IGetForumData } from "../../../graphql/queries/components/forums/getForum";
import getCurrentUser, { IGetCurrentUserData } from "../../../graphql/queries/users/getCurrentUser";
import IForum from "../../../types/IForum";
import { GlobalToaster } from "../../../util/GlobalToaster";
import permissions from "../../../util/permissions";
import IComponentProps from "../IComponentProps";
import "./css/ForumComponent.css";
import ForumEditor from "./ForumEditor";
import ForumItemContainer from "./ForumItemContainer";

const sortOptions = {
  newest: {
    friendlyName: "Newest"
  },
  oldest: {
    friendlyName: "Oldest"
  },
  recentlyUpdated: {
    friendlyName: "Recently Updated"
  },
  leastRecentlyUpdated: {
    friendlyName: "Last Updated"
  },
  mostReplies: {
    friendlyName: "Most Replied"
  },
  fewestReplies: {
    friendlyName: "Least Replied"
  }
};

function ForumComponent(props: IComponentProps): JSX.Element {
  const {data} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const [createTag] = useMutation<ICreateForumTagMutationData>(createForumTagMutation);
  const [removeTag] = useMutation<IRemoveForumTagMutationData>(removeForumTagMutation);
  const [creatingNewThread, setCreatingNewThread] = useState<boolean>(false);
  const [newTagTextbox, setNewTagTextbox] = useState<string>("");
  const [hasHitEnd, setHasHitEnd] = useState<boolean>(false);
  const [activeTag, setActiveTag] = useState<string>("");
  const [activeSort, setActiveSort] = useState<string>("recentlyUpdated");
  const {data: forumData, fetchMore, refetch} = useQuery<IGetForumData>(getForum, {variables: {forumId: props.id, sortMethod: activeSort ?? "recentlyUpdated", count: 25}});
  const history = useHistory();

  const loadMore = function() {
    if(hasHitEnd) {
      return;
    }
    if(forumData?.forum.posts) {
      void fetchMore({
        variables: {
          forumId: props.id,
          sortMethod: activeSort ?? "recentlyUpdated",
          count: 25,
          cursor: forumData.forum.posts.cursor
        },
        updateQuery(previousResult, { fetchMoreResult }) {
          const previousFeed = previousResult.forum.posts;
          const newFeed = fetchMoreResult?.forum.posts;
          if(!previousFeed) {
            throw new Error("No feed for previous");
          }
          if(!newFeed) {
            throw new Error("No feed for new");
          }
          if(newFeed.forumPosts.length === 0) {
            setHasHitEnd(true);
            return previousResult;
          }
          const newForumData: IForum = {
            ...previousResult.forum,
            posts: {
              forumPosts: [
                ...previousFeed.forumPosts,
                ...newFeed.forumPosts
              ],
              cursor: newFeed.cursor
            }
          };
          const newData: IGetForumData = {
            forum: newForumData
          };
          return newData;
        }
      });
    }
  };

  console.log(forumData);

  return (
    <div className="bp3-dark ForumComponent">
        <div className="ForumComponent-flex">
          <table className={Classes.HTML_TABLE + " ForumComponent-container " + (((!props.subId && !creatingNewThread) && Classes.INTERACTIVE) as string)}>
            <thead>
              <tr>
                <th className="ForumComponent-header">
                  {props.subId ? <ButtonGroup minimal={true} className="ForumComponent-buttons">
                    <Button icon="arrow-left" text="Back" onClick={() => history.push(`/planet/${props.planet.id}/${props.id}`)}/>
                  </ButtonGroup>: <ButtonGroup minimal={true} className="ForumComponent-buttons">
                    <Popover>
                      <Button icon="sort" text="Sort By"/>
                      <Menu>
                        {Object.entries(sortOptions).map((value) => (<MenuItem text={value[1].friendlyName} key={value[0]} icon={activeSort === value[0] ? "tick" : null} onClick={() => setActiveSort(value[0])}/>))}
                      </Menu>
                    </Popover>
                    {forumData?.forum && <Popover>
                      <Button icon="tag" text="Tags"/>
                      <Menu>
                        {forumData?.forum.tags && forumData?.forum.tags.map((value) => (<MenuItem key={value} icon={activeTag === value && "tick"} text={value} onClick={() => setActiveTag(value)}/>))}
                        {data?.currentUser && permissions.checkFullWritePermission(data?.currentUser, props.planet) && forumData?.forum.tags && forumData?.forum.tags.length !== 0 && <MenuDivider/>}
                        {data?.currentUser && permissions.checkFullWritePermission(data?.currentUser, props.planet) && <MenuItem icon="plus" text="Add New">
                          <div className="MainSidebar-menu-form">
                            <input className={Classes.INPUT + " MainSidebar-menu-input"} value={newTagTextbox} onChange={(e) => {setNewTagTextbox(e.target.value);}}/>
                            <Button text="Create" className="MainSidebar-menu-button" onClick={() => {
                              if(newTagTextbox === "") {
                                GlobalToaster.show({message: "Please enter a tag name.", intent: Intent.DANGER});
                              }
                              if(forumData.forum.tags && forumData.forum.tags.includes(newTagTextbox)) {
                                GlobalToaster.show({message: "That tag already exists.", intent: Intent.DANGER});
                              }
                              createTag({variables: {forumId: props.id, tag: newTagTextbox}}).then(() => {
                                GlobalToaster.show({message: `Sucessfully created tag ${newTagTextbox}.`, intent: Intent.SUCCESS});
                                setNewTagTextbox("");
                              }).catch((err: Error) => {
                                GlobalToaster.show({message: err.message, intent: Intent.DANGER});
                              });
                            }}/>
                          </div>
                        </MenuItem>}
                        {data?.currentUser && permissions.checkFullWritePermission(data?.currentUser, props.planet) && <MenuItem icon="cross" text="Delete">
                          {forumData?.forum.tags?.map((value) => (<MenuItem key={value} icon={activeTag === value && "tick"} text={value} onClick={() => {
                            removeTag({variables: {forumId: props.id, tag: value}}).then(() => {
                              GlobalToaster.show({message: `Sucessfully removed tag ${value}.`, intent: Intent.SUCCESS});
                            }).catch((err: Error) => {
                              GlobalToaster.show({message: err.message, intent: Intent.DANGER});
                            });
                          }}/>))}
                        </MenuItem>}
                      </Menu>
                    </Popover>}
                    <Divider/>
                    {forumData?.forum && data?.currentUser && <Button icon="plus" text="New Thread" onClick={() => setCreatingNewThread(true)}/>}
                  </ButtonGroup>}
                </th>
              </tr>
            </thead>
            {creatingNewThread || props.subId ? <tbody>
              <tr>
                {forumData?.forum && <td>
                  { props.subId ? <>{/* <ForumThread planet={props.planet} componentId={props.id} postId={props.subId} page={props.pageId} forum={forumData?.getForum}/>*/}</> : <ForumEditor 
                    onClose={() => {
                      void refetch();
                      setCreatingNewThread(false);
                    }} 
                    forum={forumData?.forum}
                  />}
                </td>}
              </tr>
            </tbody> : <>{forumData && <ForumItemContainer planet={props.planet} id={props.id} forum={forumData.forum} loadMore={loadMore}/>}</>}
          </table>
        </div>
      </div>
  );
}

export default ForumComponent;