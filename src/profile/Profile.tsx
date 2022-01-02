import { useMutation, useQuery } from "@apollo/client";
import { faBan, faComment, faEllipsisH, faGavel } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Button from "../components/controls/Button";
import Dialog from "../components/dialog/Dialog";
import Tag from "../components/display/Tag";
import Intent from "../components/Intent";
import MenuItem from "../components/menu/MenuItem";
import Popover from "../components/overlays/Popover";
import toggleBanMutation, { IToggleBanMutationData } from "../graphql/mutations/planets/toggleBanMutation";
import banUserMutation, { IBanUserMutationData } from "../graphql/mutations/users/banUserMutation";
import toggleBlockUserMutation, { IToggleBlockUserData } from "../graphql/mutations/users/toggleBlockUserMutation";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import getUser, { IGetUserData } from "../graphql/queries/users/getUser";
import IPlanet from "../types/IPlanet";
import fixPFP from "../util/fixPFP";
import Markdown from "../util/Markdown";
import permissions from "../util/permissions";
import PopperPlacement from "../components/PopperPlacement";
import Toasts from "../components/display/Toasts";

interface IProfileProps {
  onClose: () => void,
  isOpen: boolean,
  planet?: IPlanet,
  userId: string
}

function Profile(props: IProfileProps): JSX.Element {
  const { data, loading, refetch } = useQuery<IGetUserData>(getUser, {variables: {id: props.userId}});
  const { data: currentData, loading: currentLoading } = useQuery<IGetCurrentUserData>(getCurrentUser, {errorPolicy: "all"});
  const [banUser] = useMutation<IBanUserMutationData>(banUserMutation);
  const [toggleBan] = useMutation<IToggleBanMutationData>(toggleBanMutation);
  const [blockUser] = useMutation<IToggleBlockUserData>(toggleBlockUserMutation);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isBlocked: boolean | undefined = currentData?.currentUser?.blockedUsers && (currentData.currentUser.blockedUsers.filter((value) => value.id === props.userId).length > 0);

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}
      className="z-10 w-xl flex flex-col rounded-lg bg-none"
    >
      {loading ? <div></div> : (data?.user && <>
        <div className={`w-full h-36 bg-gray-200 dark:bg-gray-700 rounded-t-lg`}>
          {data.user.profileBanner && <img alt="" className={`object-cover h-36 w-xl rounded-t-lg overflow-hidden `} src={fixPFP(data.user.profileBanner)}/>}
          <div className={`relative ${data.user.profileBanner ? "-top-8 left-32" : "top-28 left-32"} w-max max-w-md`}>
            {data.user.admin && <Tag intent={Intent.DANGER} className="mr-2 shadow-lg">Global Admin</Tag>}
            {data.user.online && <Tag intent={Intent.SUCCESS} className="mr-2 shadow-lg">Online</Tag>}
            {data.user.banned && <Tag intent={Intent.DANGER} className="mr-2 shadow-lg">Globally Banned</Tag>}
            {data.user.id.length === 17 && <Tag className="shadow-lg">Early Alpha Tester</Tag>}
          </div> 
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-b-lg">
          <div className="flex h-8">
            <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-xl relative -top-16 shadow-md">
              {data.user.profilePicture && <img alt="" className={`h-24 w-24 rounded-lg`} src={fixPFP(data.user.profilePicture)}/>}
            </div>
            <div className="text-3xl font-extrabold -mt-2 ml-4">{data.user.username}</div>
            <Popover
              open={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              className="ml-auto"
              popoverClassName="pl-0 pr-0 pt-1 pb-1 bg-gray-200 flex flex-col"
              placement={PopperPlacement.bottomEnd}
              popoverTarget={
                <Button
                  icon={faEllipsisH}
                  small
                  className=""
                  onClick={() => setIsMenuOpen(true)}
                />
              }
            >
              {currentData?.currentUser && permissions.checkAdminPermission(currentData.currentUser) && !permissions.checkAdminPermission(data.user) && <MenuItem 
                icon={faGavel} 
                intent={Intent.DANGER}
                onClick={() => {
                  banUser({variables: {userId: props.userId}}).then(() => {
                    void refetch();
                    Toasts.success("Successfully " + (data.user.banned ? "un" : "") + "banned user. (GLOBAL)");
                  }).catch((err: Error) => {
                    Toasts.danger(err.message);
                  });
                }}
              >Global {data.user.banned ? "Unban" : "Ban"}</MenuItem>}
              {props.planet && currentData?.currentUser && permissions.checkFullWritePermission(currentData.currentUser, props.planet) && !permissions.checkFullWritePermission(data.user, props.planet) && <MenuItem 
                icon={faGavel} 
                intent={Intent.DANGER}
                onClick={() => {
                  toggleBan({variables: {planetId: props.planet?.id, userId: props.userId}}).then(() => {
                    void refetch();
                    Toasts.success("Successfully " + (data.user.banned ? "un" : "") + "banned user.");
                  }).catch((err: Error) => {
                    Toasts.danger(err.message);
                  });
                }}
              >{props.planet.banned && props.planet.banned.includes({id: props.userId}) ? "Unban" : "Ban"}</MenuItem>}
              {currentData?.currentUser && currentData.currentUser.id !== data.user.id && <MenuItem
                icon={faBan}
                onClick={() => {
                  blockUser({variables: {userId: props.userId}}).then(() => {
                    Toasts.success("Successfully " + (isBlocked ? "un" : "") + "blocked user.");
                  }).catch((err: Error) => {
                    Toasts.danger(err.message);
                  });
                }}
              >{isBlocked ? "Unblock" : "Block"}</MenuItem>}
              {<MenuItem
                icon={faComment}
              >Message</MenuItem>}
            </Popover>
          </div>
          {data.user.profileBio && <Markdown className="mt-4" userEmojis={data.user.customEmojis}>{data.user.profileBio}</Markdown>}
        </div>
      </>)}
    </Dialog>
  );
}

export default Profile;
