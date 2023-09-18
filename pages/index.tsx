import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div>
      <ul>
        <li>
          <Link href={"/post/create"}>
            <a>
              <h4>자유게시글 작성하기</h4>
            </a>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
