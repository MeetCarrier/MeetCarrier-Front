import React from "react";

const Login: React.FC = () => {
  const handleLogin = (provider: "google" | "kakao") => {
    const baseUrl = "https://www.mannamdeliveries.link/oauth2/authorization";
    window.location.href = `${baseUrl}/${provider}`;
  };

  return (
    <>
      <div className="absolute top-[50px] text-[#333333] left-0 right-0 px-6 text-center">
        <p className="text-[20px] font-MuseumClassic_L italic">만남 </p>
      </div>
      <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-100px)] bg-[#F2F2F2]">
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
      </div>
    </>
  );
};

export default Login;
