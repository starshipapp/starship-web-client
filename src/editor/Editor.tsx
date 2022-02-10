import PlateEditor from "./plate/PlateEditor";

export interface IEditorObject {
  save: () => string
}

export interface IEditorProps {
  initialMarkdown: string
  onForceSave?: (content: string) => void
  onReady?: (object: IEditorObject) => void
}

function Editor(props: IEditorProps): JSX.Element {
  return (<PlateEditor {...props} />);
}

export default Editor;
