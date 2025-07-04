import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import NavBar from "../../components/NavBar";
import imageCompression from "browser-image-compression";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";

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
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [nicknameError, setNicknameError] = useState("");

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
      localStorage.removeItem("hideChatGuideModal");

      dispatch(resetUser());
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 중 오류가 발생했습니다:", error);
    }
  };

  const handleWithdraw = async () => {
    if (
      window.confirm("정말로 회원 탈퇴하시겠습니까? 모든 정보가 삭제됩니다.")
    ) {
      try {
        console.log("회원탈퇴 요청 시작");
        console.log(
          "요청 URL:",
          "https://www.mannamdeliveries.link/api/user/withdraw"
        );
        console.log("요청 메서드:", "DELETE");
        console.log("요청 헤더:", { withCredentials: true });

        const response = await axios.delete(
          "https://www.mannamdeliveries.link/api/user/withdraw",
          {
            withCredentials: true,
          }
        );

        console.log("회원탈퇴 응답:", response.data);
        console.log("응답 상태 코드:", response.status);
        console.log("응답 헤더:", response.headers);

        toast.success("회원 탈퇴가 완료되었습니다.");
        dispatch(resetUser());
        navigate("/login");
      } catch (error) {
        console.error("회원 탈퇴 중 오류가 발생했습니다:", error);
        if (axios.isAxiosError(error)) {
          console.error("에러 응답 데이터:", error.response?.data);
          console.error("에러 상태 코드:", error.response?.status);
          console.error("에러 헤더:", error.response?.headers);
        }
        toast.error("회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
        return; // 에러 발생 시 함수 종료
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 타입 검사: 이미지 파일인지 확인
    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 선택할 수 있습니다.");
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
      toast.success("프로필 사진이 변경되었습니다.");
    } catch (error) {
      console.error("이미지 처리 중 오류 발생:", error);
      toast.error("이미지 업로드에 실패했습니다.");
    } finally {
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const handleNicknameChange = async () => {
    if (!newNickname.trim()) {
      setNicknameError("닉네임을 입력해주세요.");
      return;
    }

    if (newNickname.length > 10) {
      setNicknameError("닉네임은 10자 이내로 입력해주세요.");
      return;
    }

    try {
      // 닉네임 중복 확인
      const checkResponse = await axios.get(
        `https://www.mannamdeliveries.link/api/oauth/signup/nick/check?nickname=${newNickname}`
      );

      if (checkResponse.status === 200) {
        // 중복이 아니면 닉네임 업데이트 진행
        await axios.patch(
          "https://www.mannamdeliveries.link/api/user",
          { nickname: newNickname },
          { withCredentials: true }
        );
        console.log("닉네임 업데이트 성공");

        // 사용자 정보 새로고침
        dispatch(fetchUser());
        setShowNicknameModal(false);
        setNewNickname("");
        setNicknameError("");
        toast.success("닉네임이 변경되었습니다.");
      } else {
        // 그 외 상태 코드 (예: 409 외 다른 오류)
        setNicknameError("닉네임 중복 확인 중 오류가 발생했습니다.");
        toast.error("닉네임 중복 확인에 실패했습니다.");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setNicknameError("이미 사용 중인 닉네임입니다.");
        toast.error("이미 사용 중인 닉네임입니다.");
      } else {
        console.error("닉네임 변경 중 오류 발생:", error);
        setNicknameError("닉네임 변경에 실패했습니다.");
        toast.error("닉네임 변경에 실패했습니다.");
      }
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center w-full h-screen relative">
        {/* 상단 헤더 */}

        <div className="flex flex-col items-center w-[90%] max-w-md pt-[100px] space-y-4 font-GanwonEduAll_Light">
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
              onClick={() => {
                setNewNickname(displayUser.nickname);
                setShowNicknameModal(true);
              }}
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
              onClick={handleWithdraw}
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

      {/* 닉네임 수정 모달 */}
      <Modal
        isOpen={showNicknameModal}
        onClose={() => setShowNicknameModal(false)}
      >
        <div className="flex flex-col items-center p-4">
          <h3 className="text-lg font-GanwonEduAll_Bold mb-4">닉네임 수정</h3>
          <input
            type="text"
            value={newNickname}
            onChange={(e) => {
              setNewNickname(e.target.value);
              setNicknameError("");
            }}
            placeholder="새로운 닉네임을 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:border-[#BD4B2C]"
            maxLength={10}
          />
          {nicknameError && (
            <p className="text-red-500 text-sm mb-4">{nicknameError}</p>
          )}
          <div className="flex justify-center gap-4 w-full mt-4">
            <button
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
              onClick={() => {
                setShowNicknameModal(false);
                setNewNickname("");
                setNicknameError("");
              }}
            >
              취소
            </button>
            <button
              className="px-4 py-2 bg-[#BD4B2C] text-white text-sm rounded"
              onClick={handleNicknameChange}
            >
              변경하기
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ProfileEditPage;
