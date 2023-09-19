import { forwardRef } from "react";
import dynamic from "next/dynamic";
import { Editor } from "@toast-ui/react-editor";
import { EditorWithForwardedProps } from "./WrappingEditor";
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import Prism from "prismjs";

const ImportEditor = dynamic<EditorWithForwardedProps>(
  () => import("./WrappingEditor"),
  {
    ssr: false,
  }
);

const PostEditor = forwardRef<Editor, EditorWithForwardedProps>(
  (props, ref) => {
    return (
      <ImportEditor
        {...props}
        plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}
        forwardedRef={ref as React.MutableRefObject<Editor>}
      />
    );
  }
);

PostEditor.displayName = "editor";

export default PostEditor;
