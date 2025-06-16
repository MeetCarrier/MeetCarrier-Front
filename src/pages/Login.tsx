import React from "react";
import googleIcon from "../assets/img/icons/Login/google.svg";
import kakaoIcon from "../assets/img/icons/Login/kakao.svg";

const Login: React.FC = () => {
  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      console.log("알림 권한 상태:", permission);
    } catch (e) {
      console.warn("알림 권한 요청 실패", e);
    }
  };

  const handleLogin = async (provider: "google" | "kakao") => {
    await requestNotificationPermission();
    const baseUrl = "https://www.mannamdeliveries.link/oauth2/authorization";
    window.location.href = `${baseUrl}/${provider}`;
  };

  return (
    <>
      <div className="flex flex-col items-left justify-between w-[90%] h-screen px-6">
        <div className="text-left mt-40">
          <p className="text-md font-GanwonEduAll_Light text-gray-600 mt-2">
            <span className="text-[30px] font-MuseumClassic_B text-[#BD4B2C] leading-none">
              만남 배달부
            </span>
            와 함께
          </p>
          <p className="text-md font-GanwonEduAll_Light text-gray-600 mt-2">
            깊이 있는 친구 관계를 만들어 보세요!
          </p>
          <p className="text-md font-GanwonEduAll_Light text-gray-500 mt-4">
            친구가 필요한 순간,
            <br />
            마음을 배달해드려요.{" "}
            <span role="img" aria-label="delivery-box">
              📦
            </span>
          </p>
        </div>

        <div className="flex flex-col items-center mb-[120px] w-full">
          <button
            onClick={() => handleLogin("google")}
            className="relative w-[100%] max-w-xs py-2 mb-4 rounded-lg bg-white shadow font-GanwonEduAll_Bold text-[#333] border border-gray-200 text-lg cursor-pointer hover:bg-[#f0f0f0] hover:shadow-md transition text-center"
          >
            <img
              src={googleIcon}
              alt="Google"
              className="absolute left-5 top-1/2 -translate-y-1/2 w-[18px] h-[18px]"
            />
            구글로 시작하기
          </button>

          <button
            onClick={() => handleLogin("kakao")}
            className="relative w-[100%] max-w-xs py-2 rounded-lg bg-[#FEE500] shadow font-GanwonEduAll_Bold text-[#3C1E1E] border border-gray-200 text-lg cursor-pointer hover:bg-[#e6cc00] hover:shadow-md transition text-center"
          >
            <img
              src={kakaoIcon}
              alt="Kakao"
              className="absolute left-5 top-1/2 -translate-y-1/2 w-[18px] h-[18px]"
            />
            카카오톡으로 시작하기
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
