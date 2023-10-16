import { NextPage } from "next";
import { PostData } from ".";
import { useState, useEffect } from "react";
import {
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { dbService, storageService } from "../../api/firebase";
import { useRouter } from "next/router";
import { Viewer } from "@toast-ui/react-editor";
import { deleteObject, ref } from "firebase/storage";

interface NoticeData extends PostData {
  fileData: string;
  fileName: string;
  fileId: string;
}

const PostDetail: NextPage = () => {
  const [postData, setPostData] = useState<NoticeData>();
  const router = useRouter();

  const getPost = async () => {
    const data = await getDoc(doc(dbService, "notice", `${router.query.id}`));
    if (!data.data()) {
      router.push("/notice/list");
      return;
    }
    await updateDoc(doc(dbService, "notice", `${router.query.id}`), {
      view: increment(1),
    });
    const dataObj = { ...data.data(), id: router.query.id } as NoticeData;
    setPostData(dataObj);
  };

  const deletePost = async () => {
    if (!sessionStorage.getItem("admin")) {
      alert("어드민이 아닙니다");
      return;
    }

    const fileRef = ref(storageService, `notice/${postData?.fileId}`);
    await deleteObject(fileRef);

    await deleteDoc(doc(dbService, "notice", `${router.query.id}`));
    await updateDoc(doc(dbService, "meta", "noticeCount"), {
      total: increment(-1),
    });
    alert("게시물이 삭제되었습니다");
    router.push("/notice/list");
  };

  const redirectUpdate = async () => {
    if (!sessionStorage.getItem("admin")) {
      alert("어드민이 아닙니다");
      return;
    }
    router.push(
      {
        pathname: "/notice/update",
        query: {
          title: postData?.title,
          content: postData?.content,
          id: postData?.id,
          fileName: postData?.fileName,
          fileId: postData?.fileId
        },
      },
      "notice/update"
    );
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <div>
      <h1>{postData?.title}</h1>
      <h4>작성일: {postData && `${postData.createdAt}`.slice(0, 6)}</h4>
      <h4>조회수: {postData ? postData.view + 1 : 0}</h4>
      <h4>
        첨부파일:
        {postData?.fileData ? (
          <a href={postData.fileData} target="_blanc">
            {postData.fileName}
          </a>
        ) : (
          "파일이 없습니다"
        )}
      </h4>
      <div>{postData && <Viewer initialValue={postData?.content} />}</div>
      <button type="button" onClick={deletePost}>
        삭제하기
      </button>
      <button type="button" onClick={redirectUpdate}>
        수정하기
      </button>
    </div>
  );
};

export default PostDetail;
