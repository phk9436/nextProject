import { NextPage } from "next";
import React, { useState, useRef } from "react";
import PostEditor from "../../components/Editor";
import { Editor } from "@toast-ui/react-editor";
import {
  addDoc,
  collection,
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";
import { dbService } from "../api/firebase";
import { useRouter } from "next/router";
import dayjs from "dayjs";

const Create: NextPage = () => {
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const contentRef = useRef<Editor>();
  const router = useRouter();

  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const submitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const createdAt = dayjs(new Date()).format("YYMMDDHHmmss");
    const content = contentRef.current?.getInstance().getMarkdown();

    const context = {
      title,
      password,
      content,
      createdAt,
    };
    if (context.title && context.password && context.content) {
      await addDoc(collection(dbService, "free"), context);
      await updateDoc(doc(dbService, "meta", "boardCount"), {
        //전체 게시물 개수
        total: increment(1),
      });
      setTitle("");
      setPassword("");
      alert("게시글이 작성되었습니다");
      router.push("/");
    } else {
      alert("항목이 모두 작성되지 않았습니다");
    }
  };

  return (
    <div>
      <h1>자유게시판 글쓰기</h1>
      <form action="" onSubmit={submitPost}>
        <ul>
          <li key="input1">
            제목: <input type="text" value={title} onChange={changeTitle} />
          </li>
          <li key="input2">
            내용:
            <div style={{ maxWidth: "500px" }}>
              <PostEditor
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
          <li key="input3">
            비밀번호:
            <input type="text" value={password} onChange={changePassword} />
          </li>
        </ul>
        <button>작성하기</button>
      </form>
    </div>
  );
};

export default Create;
