import { query, collection, orderBy, limit, getDocs } from "firebase/firestore";
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
  const getPosts = async () => {
    setPostList([]);
    const queryList = query(collection(dbService, "free"), limit(10), orderBy("createdAt"));
    const data = await getDocs(queryList);
    data.forEach((docs) => {
      const postData = { ...docs.data(), id: docs.id } as PostData;
      setPostList((state) => [...state, postData]);
    });
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      <ul>
        {postList.length ? postList.map((e:PostData) => (
            <li key={e.id}>
                <Link href={`/post/list/${e.id}`}><a><h2>{e.title}</h2></a></Link></li>
        )) : "게시글이 없습니다..."}
      </ul>
    </div>
  );
};

export default PostList;
