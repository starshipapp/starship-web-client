import { useMemo, useState } from "react";
import generatePlugins from "./generatePlugins";
import { createPlateUI, Plate } from "@udecode/plate";
import convertMdToSlate from "./conversion/convertMdToSlate";
import { IEditorProps } from "../Editor";
import BlockButton from "./ui/BlockButton";
import {faQuoteLeft } from "@fortawesome/free-solid-svg-icons";

function PlateEditor(props: IEditorProps): JSX.Element {
  const initialValue = useMemo(() => convertMdToSlate(props.initialMarkdown), [props.initialMarkdown]);
  const [buttonUpdateCount, setButtonUpdateCount] = useState(0);

  console.log(initialValue);
  console.log(createPlateUI());

  const plugins = generatePlugins();

  const editableProps = {
    placeholder: 'Type…',
    className: "text-document" 
  };


  return (<>
    <div className="flex -ml-1 border-b border-gray-300 dark:border-gray-600 py-2 sticky top-0 bg-gray-50 dark:bg-gray-900 z-50">
      <BlockButton
        icon={faQuoteLeft}
        type="blockquote"
        updateCount={buttonUpdateCount}
      />
    </div>
    <Plate
      id="1"
      editableProps={editableProps}
      initialValue={initialValue as Node[]}
      onChange={(data) => {
        console.log(data);
        setButtonUpdateCount(buttonUpdateCount + 1);
      }}
      plugins={plugins}
    />
  </>);
}

export default PlateEditor;
