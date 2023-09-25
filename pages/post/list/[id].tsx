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
import { dbService } from "../../api/firebase";
import { useRouter } from "next/router";
import { Viewer } from "@toast-ui/react-editor";

const PostDetail: NextPage = () => {
  const [postData, setPostData] = useState<PostData>();
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
    await updateDoc(doc(dbService, "meta", "boardCount"), {
      total: increment(-1),
    });
    alert("게시물이 삭제되었습니다");
    router.push("/post/list");
  };

  const redirectUpdate = async () => {
    if (prompt("비밀번호를 입력해주세요") !== postData?.password) {
      alert("비밀번호가 다릅니다.");
      return;
    }
    router.push(
      {
        pathname: "/post/update",
        query: {
          title: postData?.title,
          content: postData?.content,
          id: postData?.id,
        },
      },
      "post/update"
    );
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <div>
      <h1>{postData?.title}</h1>
      <h4>작성일: {postData && `${postData.createdAt}`.slice(0, 6)}</h4>
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
