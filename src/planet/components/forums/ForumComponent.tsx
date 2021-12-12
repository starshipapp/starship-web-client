import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import createForumTagMutation, { ICreateForumTagMutationData } from "../../../graphql/mutations/components/forums/createForumTagMutation";
import removeForumTagMutation, { IRemoveForumTagMutationData } from "../../../graphql/mutations/components/forums/removeForumTagMutation";
import getForum, { IGetForumData } from "../../../graphql/queries/components/forums/getForum";
import getCurrentUser, { IGetCurrentUserData } from "../../../graphql/queries/users/getCurrentUser";
import IForum from "../../../types/IForum";
import permissions from "../../../util/permissions";
import IComponentProps from "../IComponentProps";
import "./css/ForumComponent.css";
import ForumEditor from "./ForumEditor";
import ForumItemContainer from "./ForumItemContainer";
import yn from "yn";
import ForumThread from "./ForumThread";
import Page from "../../../components/layout/Page";
import PageHeader from "../../../components/layout/PageHeader";
import PageContainer from "../../../components/layout/PageContainer";
import SubPage from "../../../components/subpage/SubPage";
import SubPageSidebar from "../../../components/subpage/SubPageSidebar";
import MenuHeader from "../../../components/menu/MenuHeader";
import MenuItem from "../../../components/menu/MenuItem";
import Button from "../../../components/controls/Button";
import { faCalendarMinus, faCalendarPlus, faCheck, faClock, faGlobe, faPlus, faReply, faReplyAll, faSort, faTag, faTrash, faUserMinus, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Toasts from "../../../components/display/Toasts";
import Popover from "../../../components/overlays/Popover";
import PopperPlacement from "../../../components/PopperPlacement";
import Textbox from "../../../components/input/Textbox";
import Divider from "../../../components/display/Divider";

const sortOptions = {
  newest: {
    friendlyName: "Newest",
    icon: faCalendarPlus
  },
  oldest: {
    friendlyName: "Oldest",
    icon: faCalendarMinus
  },
  recentlyUpdated: {
    friendlyName: "Recently Updated",
    icon: faClock
  },
  leastRecentlyUpdated: {
    friendlyName: "Least Updated",
    icon: faClock 
  },
  mostReplies: {
    friendlyName: "Most Replied",
    icon: faReplyAll
  },
  fewestReplies: {
    friendlyName: "Least Replied",
    icon: faReply
  }
};

function ForumComponent(props: IComponentProps): JSX.Element {
  const {data} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const [createTag] = useMutation<ICreateForumTagMutationData>(createForumTagMutation);
  const [removeTag] = useMutation<IRemoveForumTagMutationData>(removeForumTagMutation);
  const [creatingNewThread, setCreatingNewThread] = useState<boolean>(false);
  const [creatingNewTag, setCreatingNewTag] = useState<boolean>(false);
  const [newTagTextbox, setNewTagTextbox] = useState<string>("");
  const [hasHitEnd, setHasHitEnd] = useState<boolean>(false);
  const [activeTag, setActiveTag] = useState<string>("");
  const [activeSort, setActiveSort] = useState<string>("recentlyUpdated");
  const {data: forumData, fetchMore, refetch} = useQuery<IGetForumData>(getForum, {variables: {forumId: props.id, tag: activeTag !== "" ? activeTag : null, sortMethod: activeSort ?? "recentlyUpdated", count: 25}});

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
          tag: activeTag !== "" ? activeTag : null,
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

  const hasFullWrite = data?.currentUser && permissions.checkFullWritePermission(data?.currentUser, props.planet);
  const hasPublicWrite = data?.currentUser && permissions.checkPublicWritePermission(data?.currentUser, props.planet);

  return (
    <Page>
      <PageContainer>
        <Link to={`/planet/${props.planet.id}/${props.id}`} className="link-button cursor-pointer"><PageHeader>{props.name}</PageHeader></Link>
        {forumData?.forum && <SubPage>
          {!props.subId && <SubPageSidebar>
            {hasPublicWrite && <MenuItem icon={faPlus} onClick={() => setCreatingNewThread(true)}>New Thread</MenuItem>}
            {((forumData.forum.tags && forumData.forum.tags.length > 0) || hasFullWrite) && <MenuHeader>Tags</MenuHeader>}
            {forumData.forum.tags && forumData.forum.tags.length > 0 && <MenuItem onClick={() => setActiveTag("")} icon={activeTag === "" ? faCheck : faGlobe}>All</MenuItem>}
            {forumData.forum.tags && forumData.forum.tags.map((tag, index) => (
              <MenuItem
                key={index}
                icon={activeTag === tag ? faCheck : faTag}
                onClick={() => setActiveTag(tag)}
                rightElement={hasFullWrite ? <Button
                  small
                  minimal
                  icon={faTrash}
                  className="-m-1"
                  onClick={() => {
                    removeTag({variables: {forumId: props.id, tag}}).then(() => {
                      Toasts.success(`Successfully removed tag ${tag}.`);
                    }).catch((err: Error) => {
                      Toasts.danger(err.message);
                    });
                  }}
                /> : undefined}
              >{tag}</MenuItem>
            ))}
            {hasFullWrite && <Popover
              open={creatingNewTag}
              onClose={() => setCreatingNewTag(false)}
              popoverTarget={<MenuItem icon={faPlus} onClick={() => setCreatingNewTag(true)}>New Tag</MenuItem>}
              fullWidth
              placement={PopperPlacement.rightStart}
            >
              <Textbox
                value={newTagTextbox}
                className="mr-2"
                onChange={(e) => setNewTagTextbox(e.target.value)}
              />
              <Button
                onClick={() => {
                  if(newTagTextbox === "") {
                    Toasts.danger("Please enter a tag name.");
                    return;
                  }
                  if(forumData.forum.tags && forumData.forum.tags.includes(newTagTextbox)) {
                    Toasts.danger("That tag already exists.");
                    return;
                  }
                  createTag({variables: {forumId: props.id, tag: newTagTextbox}}).then(() => {
                    Toasts.success(`Successfully created tag ${newTagTextbox}.`);
                    setNewTagTextbox("");
                  }).catch((err: Error) => {
                    Toasts.danger(err.message);
                  });
                  setCreatingNewTag(false);
                }}
              >Create</Button>
            </Popover>}
            <MenuHeader>Sort</MenuHeader>
            {Object.entries(sortOptions).map((value) => (<MenuItem 
              key={value[0]}
              icon={activeSort === value[0] ? faCheck : value[1].icon}
              onClick={() => setActiveSort(value[0])}>
                {value[1].friendlyName} 
              </MenuItem>))}
          </SubPageSidebar>}
          {creatingNewThread || props.subId ? <div className="w-full">
            {forumData?.forum && <>
              {props.subId ? <>{forumData?.forum && <ForumThread forumRefetch={() => void refetch()} planet={props.planet} componentId={props.id} postId={props.subId} page={props.pageId} forum={forumData?.forum}/>}</> : <ForumEditor 
                onClose={() => {
                  void refetch();
                  setCreatingNewThread(false);
                }} 
                forum={forumData?.forum}
              />}
            </>}
          </div> : <>{forumData && <ForumItemContainer planet={props.planet} id={props.id} forum={forumData.forum} loadMore={loadMore}/>}</>}
        </SubPage>}
      </PageContainer>
    </Page> 
  );

  /* return (
    <Page>
      <PageContainer>
      <PageHeader>{props.name}</PageHeader>
      <div className="flex">
        <div className={"ForumComponent-container " + (((!props.subId && !creatingNewThread) && Classes.INTERACTIVE) as string)}>
          <div className="ForumComponent-header">
            {props.subId ? <ButtonGroup minimal={true} className="ForumComponent-buttons">
              <Button icon="arrow-left" text="Back" onClick={() => {
                history.push(`/planet/${props.planet.id}/${props.id}`);
                void refetch();
              }}/>
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
                  {forumData?.forum.tags && forumData?.forum.tags.map((value) => (<MenuItem key={value} icon={activeTag === value && "tick"} text={value} onClick={() => {
                    activeTag === value ? setActiveTag("") : setActiveTag(value);
                    void refetch();
                  }}/>))}
                  {data?.currentUser && permissions.checkFullWritePermission(data?.currentUser, props.planet) && forumData?.forum.tags && forumData?.forum.tags.length !== 0 && <MenuDivider/>}
                  {data?.currentUser && permissions.checkFullWritePermission(data?.currentUser, props.planet) && <MenuItem icon="plus" text="Add New">
                    <div className="MainSidebar-menu-form">
                      <input className={Classes.INPUT + " MainSidebar-menu-input"} value={newTagTextbox} onChange={(e) => {setNewTagTextbox(e.target.value);}}/>
                      <Button text="Create" className="MainSidebar-menu-button" onClick={() => {
                        if(newTagTextbox === "") {
                          GlobalToaster.show({message: "Please enter a tag name.", intent: Intent.DANGER});
                          return;
                        }
                        if(forumData.forum.tags && forumData.forum.tags.includes(newTagTextbox)) {
                          GlobalToaster.show({message: "That tag already exists.", intent: Intent.DANGER});
                          return;
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
          </div>
          <Divider/>
          {creatingNewThread || props.subId ? <div>
            {forumData?.forum && <>
              { props.subId ? <>{forumData?.forum && <ForumThread forumRefetch={() => void refetch()} planet={props.planet} componentId={props.id} postId={props.subId} page={props.pageId} forum={forumData?.forum}/>}</> : <ForumEditor 
                onClose={() => {
                  void refetch();
                  setCreatingNewThread(false);
                }} 
                forum={forumData?.forum}
              />}
            </>}
          </div> : <>{forumData && <ForumItemContainer planet={props.planet} id={props.id} forum={forumData.forum} loadMore={loadMore}/>}</>}
        </div>
      </div>

      </PageContainer>
    </Page>
  ); */
}

export default ForumComponent;
