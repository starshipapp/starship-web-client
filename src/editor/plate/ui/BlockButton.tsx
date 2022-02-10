import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { someNode, toggleNodeType, usePlateEditorState } from "@udecode/plate";
import Button from "../../../components/controls/Button";
import Intent from "../../../components/Intent";

interface IBlockButtonProps {
  type: string
  icon: IconProp
}

function BlockButton(props: IBlockButtonProps) {
  const editor = usePlateEditorState();

  console.log((!!editor?.selection && someNode(editor, { match: { type: props.type } })));
  console.log((!!editor?.selection && someNode(editor, { match: { type: props.type } })) ? Intent.PRIMARY : undefined);


  return (<Button
    icon={props.icon}
    intent={(!!editor?.selection && someNode(editor, { match: { type: props.type } })) ? Intent.PRIMARY : undefined}
    className="select-none"
    minimal
    small
    onMouseDown={(e) => {
      if(editor) {
        e.preventDefault();
        toggleNodeType(editor, { activeType: props.type });
      }
    }}
  />);
}

export default BlockButton;
