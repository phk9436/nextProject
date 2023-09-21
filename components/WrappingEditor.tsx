import { Editor, EditorProps } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

export interface EditorWithForwardedProps extends EditorProps {
  forwardedRef?: React.MutableRefObject<Editor>;
}

const WrappingEditor = (props: EditorWithForwardedProps) => {
  return (
    <Editor
      ref={props.forwardedRef}
      {...props}
    />
  );
};

WrappingEditor.propTypes = {};

export default WrappingEditor;
