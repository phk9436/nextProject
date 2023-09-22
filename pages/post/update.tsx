import { useRef, useState } from "react";
import { useRouter } from "next/router";
import PostEditor from "../../components/Editor";
import { doc, updateDoc } from "firebase/firestore";
import { dbService } from "../api/firebase";
import { Editor } from "@toast-ui/react-editor";

const Update = () => {
  const router = useRouter();
  const [title, setTitle] = useState(router.query.title);
  const contentRef = useRef<Editor>();

  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);

  const submitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const content = contentRef.current?.getInstance().getMarkdown();
    await updateDoc(doc(dbService, "free", `${router.query.id}`), {
      title,
      content,
    });
    alert("수정 완료됐습니다");
    router.push(`/post/list/${router.query.id}`)
  };

  return (
    <div>
      <h1>수정하기페이지</h1>
      <form action="" onSubmit={submitPost}>
        <ul>
          <li key="input1">
            제목: <input type="text" value={title} onChange={changeTitle} />
          </li>
          <li key="input2">
            내용:
            <div style={{ maxWidth: "500px" }}>
              <PostEditor
                initialValue={router.query.content as string}
                initialEditType="wysiwyg"
                useCommandShortcut={false}
                autofocus={false}
                toolbarItems={[
                  // 툴바 옵션 설정
                  ["heading", "bold", "italic", "strike"],
                  ["hr", "quote"],
                  ["task", "indent", "outdent"],
                  ["table", "link"],
                  ["code", "codeblock"],
                ]}
                ref={contentRef as React.MutableRefObject<Editor>}
              />
            </div>
          </li>
          <button>수정완료</button>
        </ul>
      </form>
    </div>
  );
};

export default Update;
