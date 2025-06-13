import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import NavBar from "../../components/NavBar";
import imageCompression from "browser-image-compression";

import { RootState, AppDispatch } from "../../Utils/store";
import { fetchUser, UserState, resetUser } from "../../Utils/userSlice";

import arrowIcon from "../../assets/img/icons/HobbyIcon/back_arrow.svg";
import stampImage from "../../assets/img/stamp.svg";
import defaultProfileImg from "../../assets/img/sample/sample_profile.svg";
import cameraIcon from "../../assets/img/icons/Profile/pic_change.svg";

function ProfileEditPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 타입 검사: 이미지 파일인지 확인
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있습니다.");
      if (e.target) {
        e.target.value = "";
      }
      return;
    }

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: 0.8,
        alwaysKeepResolution: true,
        fileType: file.type,
      };

      console.log("이미지 압축 시작");
      const compressedFile = await imageCompression(file, options);
      console.log("압축된 파일 타입:", compressedFile.type);

      // 압축된 파일을 새로운 File 객체로 변환
      const finalFile = new File([compressedFile], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });

      // 이미지 서버 업로드
      const formData = new FormData();
      formData.append("multipartFile", finalFile);

      console.log("이미지 서버 업로드 시작");
      const response = await axios.post(
        "https://www.mannamdeliveries.link/api/file/profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log("이미지 서버 업로드 성공:", response.data);
      const imageUrl = response.data;

      // 프로필 URL 업데이트
      await axios.patch(
        "https://www.mannamdeliveries.link/api/user",
        { imgUrl: imageUrl },
        { withCredentials: true }
      );
      console.log("프로필 URL 업데이트 성공");

      // 사용자 정보 새로고침
      dispatch(fetchUser());
      alert("프로필 사진이 변경되었습니다.");
    } catch (error) {
      console.error("이미지 처리 중 오류 발생:", error);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      if (e.target) {
        e.target.value = "";
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
            onClick={() => fileInputRef.current?.click()}
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
                e.stopPropagation();
                fileInputRef.current?.click();
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

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

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
