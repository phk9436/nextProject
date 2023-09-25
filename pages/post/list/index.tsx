import {
  query,
  collection,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
  startAt,
  startAfter
} from "firebase/firestore";
import type { NextPage } from "next";
import { dbService } from "../../api/firebase";
import { useState, useEffect } from "react";
import Link from "next/link";

export interface PostData {
  title: string;
  content: string;
  password: string;
  id: string;
  createdAt: number;
}

const PostList: NextPage = () => {
  const [postList, setPostList] = useState<PostData[]>([]);
  const [totalNum, setTotalNum] = useState(0);
  const [pageNum, setPageNum] = useState(0);
  const getPosts = async () => {
    setPostList([]);
    const pageData = await getDoc(doc(dbService, "meta", "page2"));
    const pageValue = JSON.parse(pageData.data()?.data);
    const queryList = query(
      collection(dbService, "free"),
      limit(10),
      orderBy("createdAt"),
      startAfter(pageValue) //11번째 게시물부터 보기 임시
    );
    const data = await getDocs(queryList);
    data.forEach((docs) => {
      const postData = { ...docs.data(), id: docs.id } as PostData;
      setPostList((state) => [...state, postData]);
    });
    const total = await getDoc(doc(dbService, "meta", "boardCount"));
    setTotalNum(total.data()?.total);
  };

  const renderPagination = () => {
    const totalPage = Math.ceil(totalNum / 10);
    const rederArr = [];
    for (let i = 1; i <= totalPage; i++) {
      rederArr.push(i);
    }
    return rederArr;
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      <ul>
        {postList.length
          ? postList.map((e: PostData) => (
              <li key={e.id}>
                <Link href={`/post/list/${e.id}`}>
                  <a>
                    <h2>{e.title}</h2>
                  </a>
                </Link>
              </li>
            ))
          : "게시글이 없습니다..."}
      </ul>
      <ul style={{ marginTop: "40px", display: "flex", gap: "10px" }}>
        {renderPagination().map((e) => (
          <li
            key={`page${e}`}
            style={{
              backgroundColor: "#eee",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            {e}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
