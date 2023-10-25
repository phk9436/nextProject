import { NextPage } from "next";
import { PostData } from ".";
import { useEffect } from "react";
import {
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { dbService } from "../../api/firebase";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const PostViewer = dynamic(() => import("../../../components/Viewer"), {
  ssr: false,
});

const PostDetail: NextPage<PostData> = (props) => {
  const router = useRouter();

  const getPost = async () => {
    if (!props) {
      router.push("/post/list");
      return;
    }
    await updateDoc(doc(dbService, "free", `${router.query.id}`), {
      view: increment(1),
    });
  };

  const deletePost = async () => {
    if (!sessionStorage.getItem("admin")) {
      if (prompt("비밀번호를 입력해주세요") !== props.password) {
        alert("비밀번호가 다릅니다.");
        return;
      }
    }

    await deleteDoc(doc(dbService, "free", `${router.query.id}`));
    await updateDoc(doc(dbService, "meta", "boardCount"), {
      total: increment(-1),
    });
    alert("게시물이 삭제되었습니다");
    router.push("/post/list");
  };

  const redirectUpdate = async () => {
    if (prompt("비밀번호를 입력해주세요") !== props.password) {
      alert("비밀번호가 다릅니다.");
      return;
    }
    router.push(
      {
        pathname: "/post/update",
        query: {
          title: props.title,
          content: props.content,
          id: router.query.id,
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
      <h1>{props.title}</h1>
      <h4>작성일: {props && `${props.createdAt}`.slice(0, 6)}</h4>
      <h4>조회수: {props ? props.view + 1 : 0}</h4>
      <div>{props && <PostViewer content={props.content} />}</div>
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

export const getServerSideProps = async ({ params }: { params: PostData }) => {
  const data = await getDoc(doc(dbService, "free", `${params.id}`));
  return { props: data.data() };
};
