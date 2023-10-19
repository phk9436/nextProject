import React from "react";
import { Viewer } from "@toast-ui/react-editor";

interface Props {
  content: string;
}

const PostViewer = (props: Props) => {
  return <Viewer initialValue={props.content} />;
};

export default PostViewer;
