import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import doneIcon from "../assets/img/icons/Login/done.svg"; // 완료 페이지에 사용할 이미지 경로
import largeNextButton from "../assets/img/icons/Login/l_btn_fill.svg";
import smallNextButtonEmpty from "../assets/img/icons/Login/s_btn_empty.svg";
import smallNextButtonFill from "../assets/img/icons/Login/s_btn_fill.svg";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0); // 0: Nickname, 1: Gender, 2: Birthdate, 3: Complete
  const [formData, setFormData] = useState({
    nickname: "",
    gender: "", // 'Male' or 'Female'
    birthdate: "", // YYYY/MM/DD format
  });
  const [isNicknameUnique, setIsNicknameUnique] = useState(false);
  const [nicknameError, setNicknameError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === "nickname") {
      setNicknameError("");
    }
  };

  const handleGenderSelect = (gender: string) => {
    setFormData((prev) => ({ ...prev, gender }));
  };

  const handleNicknameCheck = async () => {
    if (!formData.nickname.trim()) {
      setNicknameError("닉네임을 입력해주세요.");
      return;
    }
    try {
      // 닉네임 중복 확인 API 호출
      await axios.get(
        `https://www.mannamdeliveries.link/api/oauth/signup/nick/check`,
        {
          params: { nickname: formData.nickname },
          withCredentials: true,
        }
      );

      // 성공 = 사용 가능
      setIsNicknameUnique(true);
      setNicknameError("사용 가능한 닉네임입니다.");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          setIsNicknameUnique(false);
          setNicknameError("이미 사용 중인 닉네임입니다.");
        } else {
          setIsNicknameUnique(false);
          setNicknameError("닉네임 중복 확인 중 오류가 발생했습니다.");
        }
      } else {
        console.error("알 수 없는 에러:", error);
      }
    }
  };

  const handleNextStep = () => {
    if (currentStep === 0) {
      // 닉네임 단계 유효성 검사
      if (!isNicknameUnique) {
        setNicknameError("닉네임 중복 확인이 필요합니다.");
        return;
      }
    } else if (currentStep === 1) {
      // 성별 단계 유효성 검사
      if (!formData.gender) {
        alert("성별을 선택해주세요.");
        return;
      }
    } else if (currentStep === 2) {
      // 생년월일 단계 유효성 검사 (YYYY/MM/DD 형식 확인)
      const dateRegex = /^\d{8}$/;
      if (!formData.birthdate.match(dateRegex)) {
        ("생년월일을 YYYYMMDD 형식으로 입력해주세요.");
        return;
      }
      // TODO: 실제 날짜 유효성 (예: 유효한 월, 일, 미래 날짜 아님) 검사 추가
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 생년월일로부터 나이 계산
      const birthYear = parseInt(formData.birthdate.substring(0, 4));
      const birthMonth = parseInt(formData.birthdate.substring(4, 6));
      const birthDay = parseInt(formData.birthdate.substring(6, 8));

      console.log("=== 생년월일 파싱 ===");
      console.log("년:", birthYear);
      console.log("월:", birthMonth);
      console.log("일:", birthDay);

      const today = new Date();
      const birthDate = new Date(birthYear, birthMonth - 1, birthDay);

      console.log("=== 날짜 객체 ===");
      console.log("오늘:", today);
      console.log("생년월일:", birthDate);

      // 만 나이 계산
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      console.log("=== 나이 계산 과정 ===");
      console.log("기본 나이:", age);
      console.log("월 차이:", monthDiff);
      console.log("오늘 날짜:", today.getDate());
      console.log("생일 날짜:", birthDate.getDate());

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
        console.log("생일이 지나지 않아 나이 -1");
      }

      // 나이가 0보다 작거나 100보다 크면 에러
      if (age < 0 || age > 100) {
        alert("유효하지 않은 생년월일입니다.");
        return;
      }

      const submitData = {
        nickname: formData.nickname,
        gender: formData.gender,
        age: Number(age), // 명시적으로 숫자 타입으로 변환
      };

      console.log("=== 회원가입 데이터 ===");
      console.log("닉네임:", formData.nickname);
      console.log("성별:", formData.gender);
      console.log("생년월일:", formData.birthdate);
      console.log("계산된 나이:", age);
      console.log("전송할 데이터:", submitData);

      await axios.post(
        "https://www.mannamdeliveries.link/api/oauth/signup/detail",
        submitData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("회원가입 완료!");
      navigate("/main"); // 회원가입 완료 후 메인 페이지로 이동
    } catch (error) {
      console.error(error);
      alert("회원가입에 실패했습니다.");
    }
  };

  // 현재 단계에 따른 UI 렌더링
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="flex flex-col h-screen px-6 pt-[130px] w-full">
            <div className="w-full mx-auto">
              {/* 상단 텍스트 */}
              <h2 className="text-xl font-GanwonEduAll_Bold mb-2 text-[#333]">
                사용할 닉네임은 무엇인가요?
              </h2>
              <p className="text-sm text-gray-500 mb-6 font-GanwonEduAll_Light">
                설정한 닉네임은 언제든지 변경할 수 있어요.
              </p>

              {/* 닉네임 입력 + 버튼 */}
              <div className="relative mb-1">
                <input
                  type="text"
                  name="nickname"
                  placeholder="닉네임 입력"
                  value={formData.nickname}
                  onChange={handleChange}
                  className="w-full px-0 py-1 border-b-2 border-gray-300 focus:outline-none focus:border-[#C67B5A] text-lg font-GanwonEduAll_Light"
                  required
                />
                <button
                  onClick={handleNicknameCheck}
                  disabled={!formData.nickname.trim()} // 입력이 없으면 비활성화
                  className={`absolute right-0 bottom-[-36px] px-5 py-1 text-sm rounded font-GanwonEduAll_Bold transition
       ${
         formData.nickname.trim()
           ? "bg-[#BD4B2C] text-white hover:bg-[#a03e24]"
           : "bg-gray-200 text-gray-400 cursor-not-allowed"
       }`}
                >
                  중복 확인
                </button>
              </div>
            </div>

            {/* 하단 버튼 영역 */}

            <div className="mt-auto mb-[90px] flex flex-col justify-center items-center w-full">
              {nicknameError && (
                <p className="mb-2 text-center text-[#BD4B2C] text-s mt-[40px] font-GanwonEduAll_Light">
                  {nicknameError}
                </p>
              )}
              <button
                onClick={handleNextStep}
                disabled={!isNicknameUnique}
                className={`relative w-full max-w-[400px] h-[45px] flex items-center justify-center overflow-hidden transition-opacity duration-200 ${
                  !isNicknameUnique
                    ? "opacity-50 cursor-not-allowed"
                    : "opacity-100"
                }`}
              >
                <img
                  src={largeNextButton}
                  alt="다음"
                  className="absolute inset-0 w-full h-full object-fill"
                />
                <span className="relative z-10 font-GanwonEduAll_Bold text-white">
                  다음
                </span>
              </button>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col h-screen px-6 pt-[130px] w-full">
            <div className="w-full mx-auto">
              <h2 className="text-xl font-GanwonEduAll_Bold mb-2 text-[#333]">
                성별은 무엇인가요?
              </h2>
              <p className="text-sm text-gray-500 mb-6 font-GanwonEduAll_Light">
                매칭할 때 사용되며, <br />
                이후엔 변경할 수 없어요
              </p>
              <div className="flex flex-col space-y-4 mb-8">
                <button
                  onClick={() => handleGenderSelect("Female")}
                  className={`w-full py-1 rounded-lg border-3 font-GanwonEduAll_Bold text-lg transition ${
                    formData.gender === "Female"
                      ? "border-[#BD4B2C]"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  여성
                </button>
                <button
                  onClick={() => handleGenderSelect("Male")}
                  className={`w-full py-1 rounded-lg border-3 font-GanwonEduAll_Bold text-lg transition ${
                    formData.gender === "Male"
                      ? "border-[#BD4B2C]"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  남성
                </button>
              </div>
            </div>

            <div className="mt-auto mb-[90px] flex justify-center gap-4 w-full">
              <button
                onClick={handlePrevStep}
                className="relative w-1/2 h-[50px] flex items-center justify-center overflow-hidden"
              >
                <img
                  src={smallNextButtonEmpty}
                  alt="이전"
                  className="absolute inset-0 w-full h-full object-fill"
                />
                <span className="relative z-10 font-GanwonEduAll_Bold text-[#333333] whitespace-nowrap">
                  이전
                </span>
              </button>
              <button
                onClick={handleNextStep}
                disabled={!formData.gender}
                className={`relative w-1/2 h-[50px] flex items-center justify-center overflow-hidden transition-opacity duration-200 ${
                  !formData.gender
                    ? "opacity-50 cursor-not-allowed"
                    : "opacity-100"
                }`}
              >
                <img
                  src={smallNextButtonFill}
                  alt="다음"
                  className="absolute inset-0 w-full h-full object-fill"
                />
                <span className="relative z-10 font-GanwonEduAll_Bold text-white">
                  다음
                </span>
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col h-screen px-6 pt-[130px] w-full">
            <div className="w-full mx-auto">
              <h2 className="text-xl font-GanwonEduAll_Bold mb-2 text-[#333]">
                생년월일은 무엇인가요?
              </h2>
              <p className="text-sm text-gray-500 mb-6 font-GanwonEduAll_Light">
                매칭할 때 사용되며, <br />
                이후엔 변경할 수 없어요
              </p>
              <div className="mb-8">
                <input
                  type="text"
                  name="birthdate"
                  placeholder="YYYYMMDD"
                  value={formData.birthdate}
                  onChange={handleChange}
                  className="w-full px-0 py-1 border-b-2 border-gray-300 focus:outline-none focus:border-[#C67B5A] text-lg font-GanwonEduAll_Light"
                  maxLength={8} // YYYY/MM/DD 형식 (8자)
                  required
                />
              </div>
            </div>
            <div className="mt-auto mb-[90px] flex justify-center gap-4 w-full">
              <button
                onClick={handlePrevStep}
                className="relative w-1/2 h-[50px] flex items-center justify-center overflow-hidden"
              >
                <img
                  src={smallNextButtonEmpty}
                  alt="이전"
                  className="absolute inset-0 w-full h-full object-fill"
                />
                <span className="relative z-10 font-GanwonEduAll_Bold text-[#333333] whitespace-nowrap">
                  이전
                </span>
              </button>
              <button
                onClick={handleNextStep} // 이 버튼이 마지막 제출로 이어짐
                disabled={!formData.birthdate} // 생년월일이 입력되었을 때만 활성화
                className={`relative w-1/2 h-[50px] flex items-center justify-center overflow-hidden ${
                  !formData.birthdate ? "cursor-not-allowed" : ""
                }`}
              >
                <img
                  src={smallNextButtonFill}
                  alt="완료"
                  className={`absolute inset-0 w-full h-full object-fill ${
                    !formData.birthdate ? "opacity-50" : ""
                  }`}
                />
                <span className="relative z-10 font-GanwonEduAll_Bold text-[white] whitespace-nowrap">
                  완료
                </span>
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col justify-between h-screen px-6 pt-[130px] w-full">
            {/* 중앙 콘텐츠 */}
            <div className="flex flex-col items-center text-center mt-15">
              <img
                src={doneIcon}
                alt="Completion"
                className="mb-8 w-[200px] h-[200px]"
              />
              <h2 className="text-xl font-GanwonEduAll_Bold mb-2 text-[#333]">
                등록이 끝났어요!
              </h2>
              <p className="text-sm text-gray-500 mb-8 font-GanwonEduAll_Light">
                정밀한 맞춤 친구 매칭으로
                <br />
                나랑 딱 맞는 친구를 만들어 보세요
              </p>
            </div>

            {/* 하단 버튼 */}
            <div className="mb-[90px] flex justify-center w-full">
              <button
                onClick={handleSubmit}
                className="relative w-full max-w-[400px] h-[50px] flex items-center justify-center overflow-hidden cursor-pointer"
              >
                <img
                  src={largeNextButton}
                  alt="만남 배달부 시작하기"
                  className="absolute inset-0 w-full h-full object-fill"
                />
                <span className="relative z-10 font-GanwonEduAll_Bold text-[#333333]">
                  만남 배달부 시작하기
                </span>
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-[90%]">
      <div className="absolute top-[50px] text-[#333333] left-0 right-0 px-6 text-center">
        <p className="text-[20px] font-MuseumClassic_L italic">만남 배달부</p>
      </div>
      {/* 진행률 표시줄 */}
      {currentStep < 3 && (
        <div className="absolute top-[95px] left-0 right-0 h-1.5 bg-[#BD4B2C33]">
          <div
            className="h-full bg-[#BD4B2C] transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep + 1) / 3) * 100}%` }} // 0→1/3, 1→2/3, 2→3/3
          ></div>
        </div>
      )}
      {renderStep()}
    </div>
  );
};

export default Register;
