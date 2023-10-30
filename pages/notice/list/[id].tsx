import { GetServerSideProps, NextPage } from "next";
import { PostData } from ".";
import { useEffect } from "react";
import {
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { dbService, storageService } from "../../api/firebase";
import { useRouter } from "next/router";
import { deleteObject, ref } from "firebase/storage";
import dynamic from "next/dynamic";

interface NoticeData extends PostData {
  fileData: string;
  fileName: string;
  fileId: string;
  youtubeData: string;
}

const PostViewer = dynamic(() => import("../../../components/Viewer"), {
  ssr: false,
});

const PostDetail: NextPage<NoticeData> = (props) => {
  const router = useRouter();

  const getPost = async () => {
    if (!props) {
      router.push("/notice/list");
      return;
    }
    await updateDoc(doc(dbService, "notice", `${router.query.id}`), {
      view: increment(1),
    });
  };

  const deletePost = async () => {
    if (!sessionStorage.getItem("admin")) {
      alert("어드민이 아닙니다");
      return;
    }
    if (props.fileId) {
      const fileRef = ref(storageService, `notice/${props.fileId}`);
      await deleteObject(fileRef);
    }

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
          title: props.title,
          content: props.content,
          id: router.query.id,
          fileName: props.fileName,
          fileId: props.fileId,
          youtubeData: props.youtubeData,
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
      <h1>{props.title}</h1>
      <h4>작성일: {props && `${props.createdAt}`.slice(0, 6)}</h4>
      <h4>조회수: {props ? props.view + 1 : 0}</h4>
      <h4>
        첨부파일:
        {props?.fileData ? (
          <a href={props.fileData} target="_blanc">
            {props.fileName}
          </a>
        ) : (
          "파일이 없습니다"
        )}
      </h4>
      {props?.youtubeData && (
        <div style={{ width: "500px", height: "300px" }}>
          <iframe
            width="100%"
            height="100%"
            src={props.youtubeData}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

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

export const getServerSideProps = async ({
  params,
}: {
  params: NoticeData;
}) => {
  const data = await getDoc(doc(dbService, "notice", `${params?.id}`));
  return { props: data.data() };
};
