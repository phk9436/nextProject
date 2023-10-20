import { NextPage } from "next";
import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@toast-ui/react-editor";
import {
  addDoc,
  collection,
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";
import { dbService, storageService } from "../api/firebase";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { v4 } from "uuid";
import PostEditor from "../../components/Editor";

const Create: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const contentRef = useRef<Editor>();
  const router = useRouter();

  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files?.length) {
      alert("파일을 등록해주세요");
      return;
    }
    setFileName(files[0].name);
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onloadend = () => setFileUrl(reader.result as string);
  };

  const onChangeYoutubeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeUrl(e.target.value);
  };

  const submitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const createdAt = dayjs(new Date()).format("YYMMDDHHmmss");
    const content = contentRef.current?.getInstance().getMarkdown();

    let fileData = "";
    let fileId = "";
    if (fileUrl) {
      const fileV4Id = v4();
      const fileRef = ref(storageService, `notice/${fileV4Id}`);
      const data = await uploadString(fileRef, fileUrl, "data_url");
      fileData = await getDownloadURL(data.ref);
      fileId = fileV4Id;
    }

    let youtubeData = "";
    if (youtubeUrl) {
      youtubeData = youtubeUrl.replace("youtu.be/", "www.youtube.com/embed/");
    }

    const context = {
      title,
      content,
      createdAt,
      view: 0,
      fileData,
      fileName,
      fileId,
      youtubeData,
    };
    if (context.title && context.content) {
      await addDoc(collection(dbService, "notice"), context);
      await updateDoc(doc(dbService, "meta", "noticeCount"), {
        //전체 게시물 개수
        total: increment(1),
      });
      setTitle("");
      alert("게시글이 작성되었습니다");
      router.push("/");
    } else {
      alert("항목이 모두 작성되지 않았습니다");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!sessionStorage.getItem("admin")) {
      alert("어드민 로그인이 필요합니다");
      router.push("/");
    }
  }, []);

  return (
    <div>
      <h1>공지사항 글쓰기</h1>
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
            pdf: <input type="file" accept=".pdf" onChange={uploadFile} />
          </li>
          <li key="input4">
            유튜브url:
            <input
              type="text"
              value={youtubeUrl}
              onChange={onChangeYoutubeUrl}
            />
          </li>
        </ul>
        {!loading ? <button>작성하기</button> : "업로드중..."}
      </form>
    </div>
  );
};

export default Create;
