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

interface PageProps {
  dataList: PostData[];
}

const PostList: NextPage<PageProps> = ({ dataList }) => {
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
    if (isNext) {
      queryList = query(
        collection(dbService, "notice"),
        limit(10),
        orderBy("createdAt"),
        startAfter(lastData)
      );
    } else {
      queryList = query(
        collection(dbService, "notice"),
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

    const total = await getDoc(doc(dbService, "meta", "noticeCount"));
    setTotalNum(total.data()?.total);
    setTotalPageNum(Math.ceil(total.data()?.total / 10));
  };

  const setPropsData = async () => {
    setPostList(dataList);
    const total = await getDoc(doc(dbService, "meta", "noticeCount"));
    setTotalNum(total.data()?.total);
    setTotalPageNum(Math.ceil(total.data()?.total / 10));
  };

  const getNextPage = async () => {
    if (currentPageNum < totalPageNum) {
      setIsNext(true);
      lastData && setIsRefetch((state) => !state);
      setCurrentPageNum((state) => state + 1);

      if (!lastData) {
        //최초 다음페이지 호출 시 lastData세팅
        const queryList = query(
          collection(dbService, "notice"),
          limit(10),
          orderBy("createdAt")
        );
        const data = await getDocs(queryList);
        setLastData(data.docs.at(-1));
        setIsRefetch((state) => !state);
      }
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
    isNext || isPrev ? getPosts() : setPropsData();
  }, [isRefetch]);

  return (
    <div>
      <ul>
        {postList.length
          ? postList.map((e: PostData) => (
              <li key={e.id}>
                <Link href={`/notice/list/${e.id}`}>
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

export const getServerSideProps = async () => {
  const queryList = query(
    collection(dbService, "notice"),
    limit(10),
    orderBy("createdAt")
  );
  const data = await getDocs(queryList);
  const dataList: PostData[] = [];
  data.forEach((docs) => {
    const postData = { ...docs.data(), id: docs.id } as PostData;
    dataList.push(postData);
  });
  return { props: { dataList } };
};
