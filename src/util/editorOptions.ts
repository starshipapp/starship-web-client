import { Intent } from "@blueprintjs/core";
import { GlobalToaster } from "./GlobalToaster";

/* type ToolbarButton =
    'bold'
    | 'italic'
    | 'quote'
    | 'unordered-list'
    | 'ordered-list'
    | 'link'
    | 'image'
    | 'strikethrough'
    | 'code'
    | 'table'
    | 'redo'
    | 'heading'
    | 'undo'
    | 'heading-bigger'
    | 'heading-smaller'
    | 'heading-1'
    | 'heading-2'
    | 'heading-3'
    | 'clean-block'
    | 'horizontal-rule'
    | 'preview'
    | 'side-by-side'
    | 'fullscreen'
    | 'guide';*/


const editorOptions = {
  uploadImage: true,
  hideIcons: ["side-by-side", "fullscreen", "guide"],
  // showIcons: ["upload-image"],
  /* imageUploadFunction: (file, onSuccess, onError) => {
    if(!MimeTypes.imageTypes.includes(file.type)) {
      onError("Invalid file type.");
      return;
    }

    if(file.size > 8000000) {
      onError("File too big. Max file size is 8MB.");
      return;
    }

    Meteor.call("aws.markdownuploadimage", file.size, file.type, (error, value) => {
      if(error) {
        console.log(error);
        onError("Unknown error while preparing to upload image.");
      }

      if(value) {
        const options = { headers: { "Content-Type": file.type, "x-amz-acl": "public-read" }};
        Axios.put(value.uploadUrl, file, options).then(() => {
          onSuccess(value.finalUrl);
        }).catch(function (error) {
          // handle error
          console.log(error);
          onError("Unknown error while uploading image.");
        });
      }
    });
  },*/
  errorCallback: (errorMessage: string): void => {
    GlobalToaster.show({message: errorMessage, icon:"error", intent: Intent.DANGER});
  }
};

export default editorOptions;