import { ApolloQueryResult, useMutation, useQuery } from "@apollo/client";
import { Button, Icon, Intent, TextArea } from "@blueprintjs/core";
import axios from "axios";
import React, { useRef, useState, } from "react";
import updateProfileBioMutation, { IUpdateProfileBioMutationData } from "../graphql/mutations/users/updateProfileBioMutation";
import uploadProfileBannerMutation, { IUploadProfileBannerMutationData } from "../graphql/mutations/users/uploadProfileBannerMutation";
import uploadProfilePictureMutation, { IUploadProfilePictureMutationData } from "../graphql/mutations/users/uploadProfilePictureMutation";
import getCurrentUser, { IGetCurrentUserData } from "../graphql/queries/users/getCurrentUser";
import IUser from "../types/IUser";
import fixPFP from "../util/fixPFP";
import { GlobalToaster } from "../util/GlobalToaster";
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
        GlobalToaster.show({message: "The server did not return an address to upload.", intent: Intent.DANGER});
        return;
      }
      axios.put(data.data?.uploadProfilePicture, file, options).then(() => {
        props.refetch().then((data) => {
          if(!image.current) {
            return;
          }
          image.current.src = (data.data.currentUser.profilePicture ?? "") + "?t=" + String(Number(Date.now()));
        }).catch(() => {
          GlobalToaster.show({message: "Unable to fetch new user data.", intent: Intent.DANGER});
        });
      }).catch(function (error) {
        // handle error
      });
    }).catch((error: Error) => {
      GlobalToaster.show({message: error.message, intent: Intent.DANGER});
    });
  };

  const doBannerUpload = function (file: File) {
    uploadProfileBanner({variables: {type: file.type, size: file.size}}).then((data) => {
      const options = { headers: { "Content-Type": file.type, "x-amz-acl": "public-read" }};
      if(!data.data?.uploadProfileBanner) {
        GlobalToaster.show({message: "The server did not return an address to upload.", intent: Intent.DANGER});
        return;
      }
      axios.put(data.data?.uploadProfileBanner, file, options).then(() => {
        props.refetch().then((data) => {
          if(!image.current) {
            return;
          }
          image.current.src = String(data.data.currentUser.profileBanner ?? "") + "?t=" + String(Number(Date.now()));
        }).catch(() => {
          GlobalToaster.show({message: "Unable to fetch new user data.", intent: Intent.DANGER});
        });
      }).catch(function (error) {
        // handle error
      });
    }).catch((error: Error) => {
      GlobalToaster.show({message: error.message, intent: Intent.DANGER});
    });
  };

  return (
    <div className="Settings bp3-dark">
      <input
        type="file"
        ref={fileInput}
        id="upload-button"
        style={{ display: "none" }}
        onChange={(e) => {
          if(!e.target.files) {
            return false;
          }
          const file = e.target.files[0];
          action === "profilepic" && doPFPUpload(file);
          action === "banner" && doBannerUpload(file);
        }}
      />
      <div className="Settings-container">
        <div className="Settings-page-header">
          Profile
        </div>
        <h1>Profile Picture</h1>
        <div className="ProfileSettings-profilepic" onClick={() => {
          setAction("profilepic");
          fileInput.current?.click();
        }}>
          {/* eslint-disable-next-line jsx-a11y/img-redundant-alt*/}
          {props.user.profilePicture && <img alt="Change profile picture" src={fixPFP(props.user.profilePicture) + "?t=" + String(Number(Date.now()))} ref={image}/>}
          <Icon icon="upload" className="ProfileSettings-uploadpfp"/>
        </div>
        <h1>Profile Banner</h1>
        <div className="ProfileSettings-banner" onClick={() => {
          setAction("banner");
          fileInput.current?.click();
        }}>
          {props.user && props.user.profileBanner && <img alt="Change profile banner" src={fixPFP(props.user.profileBanner) + "?t=" + String(Number(Date.now()))} ref={image}/>}
          <Icon icon="upload" className="ProfileSettings-uploadpfp"/>
        </div>
        <h1>Bio</h1>
        <TextArea 
          className="ProfileSettings-bio"
          placeholder="Type up to 2000 characters about yourself. Markdown supported." 
          onChange={(e) => setBio(e.target.value)}
          value={bio}
        />
        <Button 
          text="Save"
          icon="floppy-disk"
          onClick={() => {
            updateProfileBio({variables: {bio}}).then(() => {
              GlobalToaster.show({message: "Successfully updated profile bio.", intent: Intent.SUCCESS});
            }).catch((error: Error) => {
              GlobalToaster.show({message: error.message, intent: Intent.DANGER});
            });
          }}
        />
      </div>
    </div>
  );
}

export default ProfileSettings;