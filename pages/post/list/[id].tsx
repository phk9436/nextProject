import { NextPage } from "next";
import { PostData } from ".";
import { useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { dbService } from "../../api/firebase";
import { useRouter } from "next/router";
import { Viewer } from '@toast-ui/react-editor';

const PostDetail: NextPage = () => {
  const [postData, setPostData] = useState<PostData>();
  const router = useRouter();
  const getPost = async() => {
    const data = await getDoc(doc(dbService, "free", `${router.query.id}`));
    const dataObj = { ...data.data(), id: router.query.id} as PostData;
    setPostData(dataObj);
  };

  useEffect(() => {
    getPost();
  }, []);

  return (<div>
    <h1>{postData?.title}</h1>
    <h4>작성일: {postData && `${postData.createdAt}`.slice(0, 6)}</h4>
    <div>
        {postData && <Viewer initialValue={postData?.content} />}
    </div>
  </div>);
};

export default PostDetail;
