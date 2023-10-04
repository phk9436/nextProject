import {
  query,
  collection,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
  startAfter,
  QueryDocumentSnapshot,
  endBefore,
  limitToLast,
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
  view: number;
}

const PostList: NextPage = () => {
  const [postList, setPostList] = useState<PostData[]>([]);
  const [totalNum, setTotalNum] = useState(0);
  const [totalPageNum, setTotalPageNum] = useState(0);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [prevData, setPrevData] = useState<QueryDocumentSnapshot>();
  const [lastData, setLastData] = useState<QueryDocumentSnapshot>();
  const [isPrev, setIsPrev] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [isRefetch, setIsRefetch] = useState(false);
  const getPosts = async () => {
    setPostList([]);
    let queryList;
    if (!isPrev && !isNext) {
      queryList = query(
        collection(dbService, "free"),
        limit(10),
        orderBy("createdAt")
      );
    } else if (isNext) {
      queryList = query(
        collection(dbService, "free"),
        limit(10),
        orderBy("createdAt"),
        startAfter(lastData)
      );
    } else {
      queryList = query(
        collection(dbService, "free"),
        limitToLast(10),
        orderBy("createdAt"),
        endBefore(prevData)
      );
    }
    const data = await getDocs(queryList);
    const dataList: PostData[] = [];
    data.forEach((docs) => {
      const postData = { ...docs.data(), id: docs.id } as PostData;
      dataList.push(postData);
    });
    setPostList(dataList);
    setPrevData(data.docs[0]);
    setLastData(data.docs[data.docs.length - 1]);
    isNext && setIsNext(false);
    isPrev && setIsPrev(false);

    const total = await getDoc(doc(dbService, "meta", "boardCount"));
    setTotalNum(total.data()?.total);
    setTotalPageNum(Math.ceil(total.data()?.total / 10));
  };

  const getNextPage = () => {
    if (currentPageNum < totalPageNum) {
      setIsNext(true);
      setIsRefetch((state) => !state);
      setCurrentPageNum((state) => state + 1);
    }
  };

  const getPrevPage = () => {
    if (currentPageNum > 1) {
      setIsPrev(true);
      setIsRefetch((state) => !state);
      setCurrentPageNum((state) => state - 1);
    }
  };

  useEffect(() => {
    getPosts();
  }, [isRefetch]);

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
      <p>
        현재 페이지 {currentPageNum}/{totalPageNum}
      </p>
      <button type="button" onClick={getPrevPage}>
        prev
      </button>
      <button type="button" onClick={getNextPage}>
        next
      </button>
    </div>
  );
};

export default PostList;
