import {
  query,
  collection,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
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
  const [totalPageNum, setTotalPageNum] = useState(0);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const getPosts = async () => {
    setPostList([]);
    const queryList = query(
      collection(dbService, "free"),
      limit(10),
      orderBy("createdAt")
    );
    const data = await getDocs(queryList);
    data.forEach((docs) => {
      const postData = { ...docs.data(), id: docs.id } as PostData;
      setPostList((state) => [...state, postData]);
    });
    const total = await getDoc(doc(dbService, "meta", "boardCount"));
    setTotalNum(total.data()?.total);
    setTotalPageNum(Math.ceil(total.data()?.total/10));
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
      <p>현재 페이지 {currentPageNum}/{totalPageNum}</p>
      <button type="button">prev</button>
      <button type="button">next</button>
    </div>
  );
};

export default PostList;
