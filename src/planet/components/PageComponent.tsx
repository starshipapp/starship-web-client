import { useMutation, useQuery } from "@apollo/client";
import { Button, Intent, NonIdealState, H1, H2, Classes } from "@blueprintjs/core";
import React, { useMemo, useState } from "react";
import SimpleMDEEditor from "react-simplemde-editor";
import getPage, { IGetPageData } from "../../graphql/queries/components/getPage";
import getCurrentUser, { IGetCurrentUserData } from "../../graphql/queries/users/getCurrentUser";
import { assembleEditorOptions } from "../../util/editorOptions";
import permissions from "../../util/permissions";
import "easymde/dist/easymde.min.css";
import "./css/PageComponent.css";
import IComponentProps from "./IComponentProps";
import updatePageMutation, { IUpdatePageMutationData } from "../../graphql/mutations/components/updatePageMutation";
import { GlobalToaster } from "../../util/GlobalToaster";
import uploadMarkdownImageMutation, { IUploadMarkdownImageMutationData } from "../../graphql/mutations/misc/uploadMarkdownImageMutation";
import Markdown from "../../util/Markdown";
import yn from "yn";

function PageComponent(props: IComponentProps): JSX.Element {
  const {data, loading } = useQuery<IGetPageData>(getPage, {variables: {page: props.id}});
  const [isEditing, setEditing] = useState<boolean>(false);
  const [editorState, setEditorState] = useState<string>("");
  const {data: userData} = useQuery<IGetCurrentUserData>(getCurrentUser, { errorPolicy: 'all' });
  const [updatePage] = useMutation<IUpdatePageMutationData>(updatePageMutation);
  const [uploadMarkdownImage] = useMutation<IUploadMarkdownImageMutationData>(uploadMarkdownImageMutation);
  const useRedesign = yn(localStorage.getItem("superSecretSetting.useRedesign"));

  const memoizedOptions = useMemo(() => assembleEditorOptions(uploadMarkdownImage), [uploadMarkdownImage]);

  return (
    <div className="bp3-dark PageComponent">
      {loading ? <div>
          <H1 className={Classes.SKELETON}># Lorem ipsum dolor sit amet</H1>
          <p className={Classes.SKELETON}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec placerat metus in ante congue, eu sodales nulla molestie. Proin semper blandit mi sed consectetur. Curabitur rhoncus commodo tellus ornare ornare. Donec dignissim id tellus quis pretium. Sed vel lobortis orci. Phasellus sed mi condimentum, congue risus et, luctus mauris. Integer quis augue in nulla euismod sagittis id sed libero. Integer eu blandit augue. Cras sed velit sit amet ligula pretium malesuada eu nec quam. Aenean molestie massa lorem, a tristique lectus ornare eu. Sed accumsan nunc at sollicitudin efficitur. Nunc id porta turpis. Nunc et gravida sapien. Maecenas ut cursus mauris, nec gravida leo.</p>
          <p className={Classes.SKELETON}>Ut vulputate lacinia dolor quis dignissim. Nam felis ante, facilisis in luctus sit amet, finibus at orci. Donec varius euismod suscipit. Maecenas sit amet diam vitae nunc fringilla volutpat. Suspendisse potenti. Curabitur vitae odio dictum, tristique erat sit amet, tincidunt est. Fusce metus orci, bibendum ut nisi vitae, tempus posuere leo. Mauris fermentum ligula nec massa vulputate maximus. Cras eleifend ex vitae scelerisque accumsan. Phasellus tempor fringilla turpis, quis dapibus felis feugiat sit amet. Suspendisse accumsan imperdiet feugiat. Morbi tempus, velit et efficitur efficitur, lectus velit suscipit lectus, ac ornare magna ipsum vitae enim.</p>
          <H2 className={Classes.SKELETON}>## Aliquam id ultrices ligula</H2>
          <p className={Classes.SKELETON}>Aliquam id ultricies ligula, nec mattis sapien. Sed varius felis sit amet varius dignissim. Morbi nunc felis, feugiat a sapien in, dictum eleifend risus. Etiam et augue eros. In quis maximus mi, ut pellentesque lacus. Maecenas varius pretium nunc sit amet finibus. Etiam dignissim sollicitudin vulputate. Praesent accumsan erat quis tincidunt tincidunt. Duis vel libero in elit efficitur varius a a orci.</p>
          <p className={Classes.SKELETON}>Fusce vitae iaculis elit. Suspendisse mattis fermentum erat, quis euismod urna ultricies sagittis. Mauris semper vulputate ullamcorper. Etiam nisl eros, condimentum vel tincidunt eu, feugiat in sem. Pellentesque eget mattis tellus. Ut augue risus, scelerisque a euismod malesuada, varius sed ligula. Suspendisse quis nunc at est porta volutpat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <p className={Classes.SKELETON}>Morbi mattis, nibh sollicitudin varius imperdiet, nunc nunc luctus lacus, vel mollis lectus dui at sapien. Nullam massa augue, dignissim ac mauris non, aliquam mattis mauris. Pellentesque lobortis iaculis ante, sed sodales augue ullamcorper a. Phasellus suscipit posuere eros, nec molestie magna bibendum at. Vestibulum ornare malesuada laoreet. Aliquam tortor ex, hendrerit non justo vel, interdum pulvinar lacus. Suspendisse potenti. Fusce sagittis velit velit, et luctus purus porta non. Vestibulum at hendrerit diam. Etiam in est semper, ullamcorper tortor vel, facilisis dolor. In et tempus lacus. Donec posuere mattis dui, at fringilla turpis feugiat sit amet. Ut vitae pellentesque ante, consequat molestie urna. Quisque congue est sed elit dignissim accumsan. Aenean bibendum orci a est finibus, vitae sagittis turpis sodales.</p>
          <p className={Classes.SKELETON}>Fusce luctus efficitur hendrerit. Sed vitae dictum erat, eget varius diam. Suspendisse potenti. Nam quis porta turpis. Duis quis ex dui. Nam nisi mauris, pharetra vitae dapibus vitae, porttitor vel tellus. Praesent iaculis non dolor vel ultricies. Integer rhoncus, neque eu venenatis tristique, purus enim fringilla sapien, et ultricies lectus libero et augue. Nullam ultrices tortor erat, et mattis ex tincidunt id. In neque odio, vestibulum at leo imperdiet, convallis pellentesque ante. Cras hendrerit ac mi ut aliquet. Nullam faucibus nulla odio, id gravida libero tristique et. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis gravida maximus orci ut tincidunt. Morbi lobortis nunc orci, eget aliquet diam molestie a.</p>
          <p className={Classes.SKELETON}>Morbi id auctor ante. Nam et mauris eu nulla porttitor fringilla. Quisque velit erat, commodo id tempus venenatis, scelerisque viverra tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse rutrum erat cursus, tempor odio quis, ultrices velit. Maecenas quis auctor magna. Donec interdum a justo in maximus.</p>
          <p className={Classes.SKELETON}>Morbi non eros arcu. Nam ex justo, posuere vitae justo ac, feugiat pulvinar magna. Mauris libero mauris, eleifend hendrerit ligula et, tincidunt finibus velit. Aliquam erat volutpat. Integer nisi lorem, commodo ut auctor eu, ultricies at magna. Nunc eu suscipit metus. Donec ac lorem at elit blandit viverra. Pellentesque luctus felis est, fringilla posuere tellus condimentum vel. Etiam vel libero sit amet mauris euismod scelerisque. Sed iaculis luctus metus vel scelerisque.</p>
      </div> : (data?.page ? <>
        {useRedesign && <div className="PageComponent-title">
          <span>{props.name}</span>
          {(userData?.currentUser && permissions.checkFullWritePermission(userData?.currentUser, props.planet)) && (!isEditing ? <Button
            icon="edit"
            onClick={() => {
              setEditing(true);
              setEditorState(data?.page.content);
            }}
            minimal={true}
            text="Edit"
            className="PageComponent-edit PageComponent-edit-button"
          /> : <Button
            icon="saved"
            onClick={() => {
              updatePage({variables: {pageId: props.id, content: editorState}}).then((value) => {
                setEditing(false);
              }).catch((error: Error) => {
                GlobalToaster.show({message: error.message, intent: Intent.DANGER});
              });
            }}
            text="Save"
            minimal={true}
            className="PageComponent-edit PageComponent-edit-button"
          />)}  
        </div>}
        {!isEditing && <Markdown planetEmojis={props.planet.customEmojis}>{data.page.content}</Markdown>}
        {isEditing && <SimpleMDEEditor onChange={(e) => setEditorState(e)} value={editorState} options={memoizedOptions}/>}
        {!useRedesign && (userData?.currentUser && permissions.checkFullWritePermission(userData?.currentUser, props.planet)) && (!isEditing ? <Button
          icon="edit"
          onClick={() => {
            setEditing(true);
            setEditorState(data?.page.content);
          }}
          minimal={true}
          className="PageComponent-edit PageComponent-edit-button"
        /> : <Button
          icon="saved"
          onClick={() => {
            updatePage({variables: {pageId: props.id, content: editorState}}).then((value) => {
              setEditing(false);
            }).catch((error: Error) => {
              GlobalToaster.show({message: error.message, intent: Intent.DANGER});
            });
          }}
          className="PageComponent-edit PageComponent-save-button"
        >
          Save
        </Button>)}
      </> : <NonIdealState
        title="404"
        icon="warning-sign"
        description="We couldn't find this page."
      />)}
    </div>
  );
}

export default PageComponent;