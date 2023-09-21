import { NextPage } from "next";
import { PostData } from ".";
import { useState, useEffect, useRef } from "react";
import { getDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { dbService } from "../../api/firebase";
import { useRouter } from "next/router";
import { Viewer, Editor } from "@toast-ui/react-editor";
import PostEditor from "../../../components/Editor";

const PostDetail: NextPage = () => {
  const [postData, setPostData] = useState<PostData>();
  const [isUpdateStart, setIsUpdateStart] = useState(false);
  const [isUpdateComplete, setIsUpdateComplete] = useState(false);
  const [title, setTitle] = useState("");
  const contentRef = useRef<Editor>();
  const router = useRouter();
  
  const getPost = async () => {
    const data = await getDoc(doc(dbService, "free", `${router.query.id}`));
    if (!data.data()) router.push("/post/list");
    const dataObj = { ...data.data(), id: router.query.id } as PostData;
    setPostData(dataObj);
  };

  const deletePost = async () => {
    if (prompt("비밀번호를 입력해주세요") !== postData?.password) {
      alert("비밀번호가 다릅니다.");
      return;
    }
    await deleteDoc(doc(dbService, "free", `${router.query.id}`));
    alert("게시물이 삭제되었습니다");
    router.push("/post/list");
  };

  const updatePost = async () => {
    if (prompt("비밀번호를 입력해주세요") !== postData?.password) {
      alert("비밀번호가 다릅니다.");
      return;
    }
    setIsUpdateStart(true);
    setTitle(postData?.title);
  };

  const submitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const content = contentRef.current?.getInstance().getMarkdown();
    await updateDoc(doc(dbService, "free", `${router.query.id}`), {
      title,
      content,
    });
    alert("수정 완료됐습니다");
    setIsUpdateStart(false);
    setIsUpdateComplete(state => !state);
  };

  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);

  useEffect(() => {
    getPost();
  }, [isUpdateComplete]);

  return (
    <div>
      <h1>{postData?.title}</h1>
      <h4>작성일: {postData && `${postData.createdAt}`.slice(0, 6)}</h4>
      <div>{postData && <Viewer initialValue={postData?.content}/>}</div>
      {!isUpdateStart && (
        <>
          <button type="button" onClick={deletePost}>
            삭제하기
          </button>
          <button type="button" onClick={updatePost}>
            수정하기
          </button>
        </>
      )}
      {isUpdateStart && (
        <>
          <hr />
          <h4>수정하기영역</h4>
          <form action="" onSubmit={submitPost}>
            <ul>
              <li key="input1">
                제목: <input type="text" value={title} onChange={changeTitle} />
              </li>
              <li key="input2">
                <div style={{ maxWidth: "500px" }}>
                  <PostEditor
                    initialValue={postData?.content}
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
        </>
      )}
    </div>
  );
};

export default PostDetail;
