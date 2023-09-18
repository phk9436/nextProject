import { Editor } from "@toast-ui/react-editor";
import '@toast-ui/editor/dist/toastui-editor.css';

const PostEditor = () => {
    return <Editor 
    initialEditType="markdown"
    useCommandShortcut={false}
    autofocus={false}
    toolbarItems={[
        // 툴바 옵션 설정
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task', 'indent', 'outdent'],
        ['table', 'link'],
        ['code', 'codeblock'],
      ]}
  />
}

export default PostEditor;