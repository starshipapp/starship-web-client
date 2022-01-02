import { MutationFunctionOptions, OperationVariables } from "@apollo/client";
import axios from "axios";
import EasyMDE from "easymde";
import { ExecutionResult } from "graphql";
import Toasts from "../components/display/Toasts";
import { IUploadMarkdownImageMutationData } from "../graphql/mutations/misc/uploadMarkdownImageMutation";
import MimeTypes from "./validMimes";

const editorOptions: EasyMDE.Options = {
  uploadImage: true,
  hideIcons: ["side-by-side", "fullscreen", "guide"],
  errorCallback: (errorMessage: string): void => {
    Toasts.danger(errorMessage);
  }
};

export function assembleEditorOptions(newFunction: (options?: MutationFunctionOptions<IUploadMarkdownImageMutationData, OperationVariables> | undefined) => Promise<ExecutionResult<IUploadMarkdownImageMutationData>>): EasyMDE.Options {
  editorOptions.imageUploadFunction = (file: File, onSuccess: (arg0: string) => void, onError: (arg0: string) => void): void => {
    if(!MimeTypes.imageTypes.includes(file.type)) {
      onError("Invalid file type.");
      return;
    }

    if(file.size > 8000000) {
      onError("File too big. Max file size is 8MB.");
      return;
      
    }

    newFunction({variables: {type: file.type, size: file.size}}).then((data) => {
      const options = { headers: { "Content-Type": file.type, "x-amz-acl": "public-read" }};
      axios.put(data.data?.uploadMarkdownImage.uploadUrl ?? "", file, options).then(() => {
        onSuccess(data.data?.uploadMarkdownImage.finalUrl ?? "");
      }).catch(function (error) {
        // handle error
        onError("Unknown error while uploading image.");
      });
    }).catch((error: Error) => {
      onError(error.message);
    });
  };

  return editorOptions;
}

export default editorOptions;
