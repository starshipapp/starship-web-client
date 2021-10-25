import { useMutation } from "@apollo/client";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useRef, useState } from "react";
import Button from "../components/controls/Button";
import Toasts from "../components/display/Toasts";
import Textbox from "../components/input/Textbox";
import Intent from "../components/Intent";
import Page from "../components/layout/Page";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import List from "../components/list/List";
import ListItem from "../components/list/ListItem";
import Popover from "../components/overlays/Popover";
import deleteCustomEmojiMutation, { IDeleteCustomEmojiData } from "../graphql/mutations/customemojis/deleteCustomEmojiMutation";
import uploadCustomEmojiMutation, { IUploadCustomEmojiData } from "../graphql/mutations/customemojis/uploadCustomEmojiMutation";
import IUser from "../types/IUser";
import MimeTypes from "../util/validMimes";

interface IEmojiSettingsProps {
  user: IUser
  refetch: () => void
}

function EmojiSettings(props: IEmojiSettingsProps): JSX.Element {
  const [emojiName, setEmojiName] = useState<string>("");
  const [emojiFile, setEmojiFile] = useState<File | null>(null);
  const [showPopover, setPopover] = useState<boolean>(false);
  const [uploadEmoji] = useMutation<IUploadCustomEmojiData>(uploadCustomEmojiMutation);
  const [deleteEmoji] = useMutation<IDeleteCustomEmojiData>(deleteCustomEmojiMutation);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Page>
      <PageContainer>
        <PageHeader>
          Emojis
        </PageHeader>
        <List
          name={`${String(props.user.customEmojis?.length)}/50 slots used`}
          actions={<Popover 
            popoverTarget={<Button 
              icon={faUpload} 
              minimal 
              small
              onClick={() => setPopover(true)}
            >
              Upload Emoji
            </Button>}
            open={showPopover}
            onClose={() => {
              setPopover(false);
              setEmojiFile(null);
              setEmojiName("");
            }}
          >
            <div>
              <Textbox 
                placeholder="Emoji Name"
                value={emojiName}
                onChange={(e) => setEmojiName(e.target.value)}
                className="mb-2"
              /> 
              <input
                type="file"
                className="hidden"
                accept={MimeTypes.imageTypes.join(",")}
                onChange={(e) => {
                  if(e.target.files && e.target.files[0]) {
                    setEmojiFile(e.target.files[0]);
                  }
                }}
                ref={inputRef}
              />
              <Button
                intent={emojiFile ? Intent.SUCCESS : undefined}
                className="mb-2 w-full block"
                icon={faUpload}
                onClick={() => {
                  inputRef?.current && inputRef.current.click();
                }}
              >
                {emojiFile ? emojiFile.name : "Choose file..."}
              </Button>
              <Button
                icon={faUpload}
                onClick={() => {
                  if(emojiName === "") {
                    Toasts.danger("Your emoji must have a name.");
                    return;
                  }
                  if(!emojiFile) {
                    Toasts.danger("Please select a file to upload.");
                    return;
                  }
                  uploadEmoji({variables: {name: emojiName, type: emojiFile.type, size: emojiFile.size}}).then((data) => {
                    if(data.data?.uploadCustomEmoji) {
                      const options = { headers: { "Content-Type": emojiFile.type, "x-amz-acl": "public-read" }};
                      axios.put(data.data?.uploadCustomEmoji, emojiFile, options).then(() => {
                        props.refetch();
                        setPopover(false);
                        setEmojiFile(null);
                        setEmojiName("");
                      }).catch(() => {
                        Toasts.danger("An unexpected error occured while uploading the emoji.");
                      });
                    }
                  }).catch((error: Error) => {
                    Toasts.danger(error.message);
                  });
                }}
              >
                Upload
              </Button>
            </div>
          </Popover>}
        >
          {props.user.customEmojis && props.user.customEmojis.map((value) => (
            <ListItem
              icon={<img className="h-6 w-6" src={value.url} alt={value.name}/>}
              actions={<Button
                icon={faTrash}
                intent={Intent.DANGER}
                small
                onClick={() => {
                  deleteEmoji({variables: {emojiId: value.id}}).then(() => {
                    Toasts.success(`Successfully deleted :${value.name ?? ""}:.`);
                    props.refetch();
                  }).catch((error: Error) => {
                    Toasts.danger(error.message);
                  });
                }}
              />}
            >
              :{value.name}:
            </ListItem>
          ))}
        </List>
      </PageContainer>
    </Page>
  );
}

export default EmojiSettings;
