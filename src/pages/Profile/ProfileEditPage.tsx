import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import NavBar from "../../components/NavBar";

import { RootState, AppDispatch } from "../../Utils/store";
import { fetchUser, UserState, resetUser } from "../../Utils/userSlice";

import arrowIcon from "../../assets/img/icons/HobbyIcon/back_arrow.svg";
import stampImage from "../../assets/img/stamp.svg";
import defaultProfileImg from "../../assets/img/sample/sample_profile.svg";
import cameraIcon from "../../assets/img/icons/Profile/pic_change.svg";

function ProfileEditPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(
    (state: RootState) => state.user
  ) as UserState | null;

  useEffect(() => {
    if (!user) dispatch(fetchUser());
  }, [dispatch, user]);

  const displayUser = user || {
    nickname: "로딩 중",
    imgUrl: "",
    age: 0,
    gender: "",
  }; // 로딩 또는 에러 시 표시할 더미 데이터

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://www.mannamdeliveries.link/api/user/logout",
        {},
        {
          withCredentials: true,
        }
      );

      // localStorage에서 설문 관련 데이터 삭제
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          (key.startsWith("survey_") || key.startsWith("chatRoomId_"))
        ) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));

      dispatch(resetUser());
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 중 오류가 발생했습니다:", error);
    }
  };

  const handleWithdrawal = async () => {
    if (
      window.confirm("정말로 회원 탈퇴하시겠습니까? 모든 정보가 삭제됩니다.")
    ) {
      try {
        await axios.delete(
          "https://www.mannamdeliveries.link/api/user/withdrawal",
          {
            withCredentials: true,
          }
        );
        alert("회원 탈퇴가 완료되었습니다.");
        dispatch(resetUser());
        navigate("/login");
      } catch (error) {
        console.error("회원 탈퇴 중 오류가 발생했습니다:", error);
        alert("회원 탈퇴에 실패했습니다.");
      }
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center w-full h-screen relative">
        {/* 상단 헤더 */}

        <div className="flex flex-col items-center w-[90%] max-w-md pt-[100px] space-y-4">
          {/* 프로필 이미지 영역 */}
          <div
            className="relative w-[100px] h-[100px] mb-4 cursor-pointer"
            onClick={() => alert("프로필 사진 변경 기능 개발 예정")}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${stampImage})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <img
              src={displayUser.imgUrl || defaultProfileImg}
              alt="profile"
              className="absolute top-[6%] left-[6%] w-[88%] h-[88%] object-cover rounded-[2px]"
            />
            <button
              onClick={(e) => {
                e.stopPropagation(); // 부모의 onClick 무시
                alert("프로필 사진 변경 기능 개발 예정");
              }}
              className="absolute bottom-0 right-0 bg-white rounded-full shadow-md w-8 h-8 flex items-center justify-center"
            >
              <img
                src={cameraIcon}
                alt="카메라 아이콘"
                className="w-full h-full object-fill"
              />
            </button>
          </div>

          {/* 닉네임 */}
          <div className="w-full bg-white rounded-xl px-5 py-4 shadow-sm">
            <button
              onClick={() => alert("닉네임 변경 기능 개발 예정")}
              className="w-full flex justify-between items-center"
            >
              <span className="text-sm text-[#333] font-medium">닉네임</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#333] font-medium">
                  {displayUser.nickname}
                </span>
                <img
                  src={arrowIcon}
                  alt="수정"
                  className="w-4 h-4 transform scale-x-[-1]"
                />
              </div>
            </button>
          </div>

          {/* 로그아웃 */}
          <div className="w-full bg-white rounded-xl px-5 py-4 shadow-sm">
            <button
              onClick={handleLogout}
              className="w-full flex justify-between items-center"
            >
              <span className="text-sm text-[#333] font-medium">로그아웃</span>
              <img
                src={arrowIcon}
                alt="arrow"
                className="w-4 h-4 transform scale-x-[-1]"
              />
            </button>

            <button
              onClick={handleWithdrawal}
              className="w-full flex justify-between items-center mt-4"
            >
              <span className="text-sm text-[#BD4B2C] font-medium">
                회원탈퇴
              </span>
              <img
                src={arrowIcon}
                alt="arrow"
                className="w-4 h-4 transform scale-x-[-1]"
              />
            </button>
          </div>
        </div>
      </div>
      {/* 상단 제목 */}
      <div className="absolute top-[50px] text-[#333333] left-0 right-0 px-5 text-center">
        <img
          src={arrowIcon}
          alt="arrowIcon"
          className="absolute top-1/2 -translate-y-1/2 left-6 w-[9px] h-[20px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <p className="text-[20px] font-MuseumClassic_L italic">계정 관리</p>
      </div>
    </>
  );
}

export default ProfileEditPage;
