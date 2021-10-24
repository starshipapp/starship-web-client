import { ApolloQueryResult, useMutation } from "@apollo/client";
import { faSave, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useRef, useState, } from "react";
import Button from "../components/controls/Button";
import Toasts from "../components/display/Toasts";
import TextArea from "../components/input/TextArea";
import Page from "../components/layout/Page";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import PageSubheader from "../components/layout/PageSubheader";
import updateProfileBioMutation, { IUpdateProfileBioMutationData } from "../graphql/mutations/users/updateProfileBioMutation";
import uploadProfileBannerMutation, { IUploadProfileBannerMutationData } from "../graphql/mutations/users/uploadProfileBannerMutation";
import uploadProfilePictureMutation, { IUploadProfilePictureMutationData } from "../graphql/mutations/users/uploadProfilePictureMutation";
import { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import IUser from "../types/IUser";
import fixPFP from "../util/fixPFP";
import MimeTypes from "../util/validMimes";
import "./css/ProfileSettings.css";

interface IProfileSettingsProps {
  user: IUser
  refetch: () => Promise<ApolloQueryResult<IGetCurrentUserData>>
}

function ProfileSettings(props: IProfileSettingsProps): JSX.Element {
  const fileInput = useRef<HTMLInputElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const [uploadProfilePicture] = useMutation<IUploadProfilePictureMutationData>(uploadProfilePictureMutation);
  const [updateProfileBio] = useMutation<IUpdateProfileBioMutationData>(updateProfileBioMutation);
  const [uploadProfileBanner] = useMutation<IUploadProfileBannerMutationData>(uploadProfileBannerMutation);
  const [action, setAction] = useState<string>("");
  const [bio, setBio] = useState<string>(props.user.profileBio ?? "");

  const doPFPUpload = function (file: File) {
    uploadProfilePicture({variables: {type: file.type, size: file.size}}).then((data) => {
      const options = { headers: { "Content-Type": file.type, "x-amz-acl": "public-read" }};
      if(!data.data?.uploadProfilePicture) {
        return;
      }
      axios.put(data.data?.uploadProfilePicture, file, options).then(() => {
        props.refetch().then((data) => {
          if(!image.current) {
            return;
          }
          image.current.src = (data.data.currentUser.profilePicture ?? "") + "?t=" + String(Number(Date.now()));
        }).catch(() => {
          Toasts.danger("Unable to fetch new user data.");
        });
      }).catch(function () {
        Toasts.danger("Unable to upload profile picture.");
      });
    }).catch((error: Error) => {
      Toasts.danger(error.message);
    });
  };

  const doBannerUpload = function (file: File) {
    uploadProfileBanner({variables: {type: file.type, size: file.size}}).then((data) => {
      const options = { headers: { "Content-Type": file.type, "x-amz-acl": "public-read" }};
      if(!data.data?.uploadProfileBanner) {
        Toasts.danger("The server did not return an address to upload.");
        return;
      }
      axios.put(data.data?.uploadProfileBanner, file, options).then(() => {
        props.refetch().then((data) => {
          if(!image.current) {
            return;
          }
          image.current.src = String(data.data.currentUser.profileBanner ?? "") + "?t=" + String(Number(Date.now()));
        }).catch(() => {
          Toasts.danger("Unable to fetch new user data.");
        });
      }).catch(function () {
        Toasts.danger("Unable to upload profile banner");
      });
    }).catch((error: Error) => {
      Toasts.danger(error.message);
    });
  };

  return (
    <Page>
      <input
        type="file"
        ref={fileInput}
        id="upload-button"
        style={{ display: "none" }}
        accept={MimeTypes.imageTypes.join(",")}
        onChange={(e) => {
          if(!e.target.files) {
            return false;
          }
          const file = e.target.files[0];
          action === "profilepic" && doPFPUpload(file);
          action === "banner" && doBannerUpload(file);
        }}
      />
      <PageContainer>
        <PageHeader>Profile</PageHeader>
        <PageSubheader>Profile Picture</PageSubheader>
        <div className={`ProfileSettings-profilepic shadow h-24 w-24 ${!props.user.profilePicture ? "bg-gray-200 dark:bg-gray-700" : ""} rounded-lg relative`} onClick={() => {
          setAction("profilepic");
          fileInput.current?.click();
        }}>
          {/* eslint-disable-next-line jsx-a11y/img-redundant-alt*/}
          {props.user.profilePicture && <img
            alt="Change profile picture"
            src={fixPFP(props.user.profilePicture) + "?t=" + String(Number(Date.now()))}
            ref={image}
            className="h-24 w-24 rounded-lg"
          />}
          <FontAwesomeIcon icon={faUpload} className="ProfileSettings-profilepic-icon opacity-0 transtion absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"/>
        </div>
        <PageSubheader>Banner</PageSubheader>
        <div className={`ProfileSettings-banner h-24 w-96 shadow ${!props.user.profileBanner ? "bg-gray-200 dark:bg-gray-700" : ""} rounded-lg relative`} onClick={() => {
          setAction("banner");
          fileInput.current?.click();
        }}>
          {props.user && props.user.profileBanner && <img alt="Change profile banner" src={fixPFP(props.user.profileBanner) + "?t=" + String(Number(Date.now()))} ref={image}/>}
          <FontAwesomeIcon icon={faUpload} className="ProfileSettings-profilepic-icontransition opacity-0 absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 hover:opacity-100"/>
        </div>
        <PageSubheader>Bio</PageSubheader>
        <TextArea
          className="w-full mb-3"
          placeholder="Type up to 2000 characters about yourself. Markdown supported." 
          onChange={(e) => setBio(e.target.value)}
          value={bio}
        />
        <Button
          icon={faSave}
          onClick={() => {
            updateProfileBio({variables: {bio}}).then(() => {
              Toasts.success("Successfully updated profile bio.");
            }).catch((error: Error) => {
              Toasts.danger(error.message);
            });
          }}
        >Save</Button>
      </PageContainer>
    </Page>
  );
}

export default ProfileSettings;
