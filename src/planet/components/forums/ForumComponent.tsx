import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { Link } from "react-router-dom";
import createForumTagMutation, { ICreateForumTagMutationData } from "../../../graphql/mutations/components/forums/createForumTagMutation";
import removeForumTagMutation, { IRemoveForumTagMutationData } from "../../../graphql/mutations/components/forums/removeForumTagMutation";
import getForum, { IGetForumData } from "../../../graphql/queries/components/forums/getForum";
import getCurrentUser, { IGetCurrentUserData } from "../../../graphql/queries/users/getCurrentUser";
import IForum from "../../../types/IForum";
import permissions from "../../../util/permissions";
import IComponentProps from "../IComponentProps";
import ForumEditor from "./ForumEditor";
import ForumItemContainer from "./ForumItemContainer";
import ForumThread from "./ForumThread";
import Page from "../../../components/layout/Page";
import PageHeader from "../../../components/layout/PageHeader";
import PageContainer from "../../../components/layout/PageContainer";
import SubPage from "../../../components/subpage/SubPage";
import SubPageSidebar from "../../../components/subpage/SubPageSidebar";
import MenuHeader from "../../../components/menu/MenuHeader";
import MenuItem from "../../../components/menu/MenuItem";
import Button from "../../../components/controls/Button";
import { faCalendarMinus, faCalendarPlus, faCheck, faClock, faGlobe, faPlus, faReply, faReplyAll, faTag, faTrash } from "@fortawesome/free-solid-svg-icons";
import Toasts from "../../../components/display/Toasts";
import Popover from "../../../components/overlays/Popover";
import PopperPlacement from "../../../components/PopperPlacement";
import Textbox from "../../../components/input/Textbox";

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
        <Link
          to={`/planet/${props.planet.id}/${props.id}`} className="link-button cursor-pointer"
          onClick={() => setCreatingNewThread(false)}
        ><PageHeader>{props.name}</PageHeader></Link>
        {forumData?.forum && <SubPage>
          {!props.subId && <SubPageSidebar>
            {hasPublicWrite && <MenuItem icon={faPlus} onClick={() => setCreatingNewThread(!creatingNewThread)}>New Thread</MenuItem>}
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
}

export default ForumComponent;
