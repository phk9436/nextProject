import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Login: NextPage = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const onChangeId = (e: React.ChangeEvent<HTMLInputElement>) =>
    setId(e.target.value);
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const loginAdmin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (id !== "admin1234" || password !== "adminlogin153246") {
      alert("아이디와 패스워드를 확인해주세요");
      return;
    }
    alert("로그인 성공!");
    sessionStorage.setItem("admin", "adminLoginSuccess");
    router.push("/");
  };

  useEffect(() => {
    if (sessionStorage.getItem("admin")) {
      alert("이미 로그인되어 있습니다");
      router.push("/");
    }
  }, []);

  return (
    <div>
      <h1>로그인하기</h1>
      <form action="" onSubmit={loginAdmin}>
        <ul>
          <li>
            아이디: <input type="text" value={id} onChange={onChangeId} />
          </li>
          <li>
            비밀번호:
            <input
              type="password"
              value={password}
              onChange={onChangePassword}
            />
          </li>
        </ul>
        <button>로그인</button>
      </form>

      <p>아이디 : admin1234 / 비밀번호 : adminlogin153246</p>
    </div>
  );
};

export default Login;
