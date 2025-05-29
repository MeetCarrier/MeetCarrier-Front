import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

const Login: React.FC = () => {
  const handleLogin = (provider: "google" | "kakao") => {
    const baseUrl = "https://www.mannamdeliveries.link/oauth2/authorization";
    window.location.href = `${baseUrl}/${provider}`;
  };

  const handleTestLogin = async () => {
    try {
      const loginRes = await axios.post(
        "https://www.mannamdeliveries.link/api/auth/test/login",
        null,
        { withCredentials: true }
      );
      console.log("로그인 성공", loginRes.data);

      setTimeout(async () => {
        const userRes = await axios.get(
          "https://www.mannamdeliveries.link/api/user",
          { withCredentials: true }
        );
        console.log("유저 정보:", userRes.data);
        navigate("/main");
      }, 200);
    } catch (err) {
      console.error("에러:", err);
    }
  };

  return (
    <>
      {/* <NavBar /> */}
      <div className="absolute top-[50px] text-[#333333] left-0 right-0 px-6 text-center">
        <p className="text-[20px] font-MuseumClassic_L italic">만남 </p>
      </div>
      <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-100px)]">
        <button
          onClick={() => handleLogin("google")}
          className="w-[80%] max-w-xs py-3 mb-4 rounded-lg bg-white shadow font-GanwonEduAll_Bold text-[#333] border border-gray-200 text-lg cursor-pointer hover:bg-[#f0f0f0] hover:shadow-md transition"
        >
          구글로 계속하기
        </button>
        <button
          onClick={() => handleLogin("kakao")}
          className="w-[80%] max-w-xs py-3 rounded-lg bg-[#FEE500] shadow font-GanwonEduAll_Bold text-[#3C1E1E] border border-gray-200 text-lg cursor-pointer hover:bg-[#e6cc00] hover:shadow-md transition"
        >
          카카오로 계속하기
        </button>
        <button
          onClick={handleTestLogin}
          className="w-[80%] max-w-xs py-3 mt-4 rounded-lg bg-blue-500 shadow font-GanwonEduAll_Bold text-white text-lg cursor-pointer hover:bg-blue-600 hover:shadow-md transition"
        >
          테스트 유저로 로그인
        </button>
      </div>
    </>
  );
};

export default Login;
