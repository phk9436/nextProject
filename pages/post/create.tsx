import { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
const PostEditor = dynamic(() => import("../../components/Editor"), {
    ssr: false
})

const Create: NextPage = () => {
  const [postData, setPostData] = useState({});
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const contentRef = useRef();

  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const submitPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPostData({ title, password });
  };

  useEffect(() => {
    console.log(postData);
  }, [postData]);

  return (
    <div>
      <form action="" onSubmit={submitPost}>
        <ul>
          <li key="input1">
            제목: <input type="text" value={title} onChange={changeTitle} />
          </li>
          <li key="input2">내용: <PostEditor /></li>
          <li key="input3">
            비밀번호:{" "}
            <input type="text" value={password} onChange={changePassword} />
          </li>
        </ul>
        <button>작성하기</button>
      </form>
    </div>
  );
};

export default Create;
