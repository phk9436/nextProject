import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { doc, updateDoc } from "firebase/firestore";
import { dbService, storageService } from "../api/firebase";
import { Editor } from "@toast-ui/react-editor";
import { v4 } from "uuid";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import PostEditor from "../../components/Editor";

const Update = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(router.query.title);
  const [fileChange, setFileChange] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const contentRef = useRef<Editor>();

  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);

  const changeFile = () => setFileChange(true);

  const onChangeYoutubeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeUrl(e.target.value);
  };

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

  const submitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const content = contentRef.current?.getInstance().getMarkdown();
    if (!content || !title) {
      alert("항목이 모두 채워지지 않았습니다");
      setLoading(false);
      return;
    }
    if (fileChange && !fileUrl) {
      alert("파일을 등록해주세요");
      setLoading(false);
      return;
    }
    let context;
    let fileData = "";
    let fileId = "";

    let youtubeData = "";
    if (youtubeUrl) {
      youtubeData = youtubeUrl.replace("youtu.be/", "www.youtube.com/embed/");
    }

    if (!fileUrl) {
      context = {
        title,
        content,
        youtubeData,
      };
    } else {
      const deleteFileRef = ref(
        storageService,
        `notice/${router.query.fileId}`
      );
      await deleteObject(deleteFileRef);

      const fileV4Id = v4();
      const fileRef = ref(storageService, `notice/${fileV4Id}`);
      const data = await uploadString(fileRef, fileUrl, "data_url");
      fileData = await getDownloadURL(data.ref);
      fileId = fileV4Id;

      context = {
        title,
        content,
        fileData,
        fileId,
        fileName,
        youtubeData,
      };
    }
    await updateDoc(doc(dbService, "notice", `${router.query.id}`), context);
    alert("수정 완료됐습니다");
    router.push(`/notice/list/${router.query.id}`);
    setLoading(false);
  };

  useEffect(() => {
    !router.query.id && router.push("/");
    router.query.youtubeData &&
      setYoutubeUrl(router.query.youtubeData as string);
  }, []);

  return (
    <div>
      <h1>수정하기페이지</h1>
      <form action="" onSubmit={submitPost}>
        <ul>
          <li key="input1">
            제목: <input type="text" value={title} onChange={changeTitle} />
          </li>
          <li key="input2">
            파일: {router.query.fileName}
            <button type="button" onClick={changeFile}>
              파일 수정하기
            </button>
            {fileChange && (
              <input type="file" accept=".pdf" onChange={uploadFile} />
            )}
          </li>
          <li key="input3">
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
          <li key="input4">
            유튜브url:
            <input
              type="text"
              value={youtubeUrl}
              onChange={onChangeYoutubeUrl}
            />
          </li>
          {!loading ? <button>수정완료</button> : "업로드중..."}
        </ul>
      </form>
    </div>
  );
};

export default Update;
