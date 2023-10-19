import { forwardRef } from "react";
import { Editor } from "@toast-ui/react-editor";
import { EditorWithForwardedProps } from "./WrappingEditor";
import dynamic from "next/dynamic";

const WrappingEditor = dynamic(() => import("./WrappingEditor"), {
  ssr: false,
});
const PostEditor = forwardRef<Editor, EditorWithForwardedProps>(
  (props, ref) => {
    return (
      <WrappingEditor
        {...props}
        forwardedRef={ref as React.MutableRefObject<Editor>}
      />
    );
  }
);

PostEditor.displayName = "editor";

export default PostEditor;
