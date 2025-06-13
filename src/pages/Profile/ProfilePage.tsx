import { useEffect } from "react";
import NavBar from "../../components/NavBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../Utils/store";
import { fetchUser, UserState } from "../../Utils/userSlice";
import { useNavigate } from "react-router-dom";

import bellIcon from "../../assets/img/icons/NavIcon/bell_default.svg";
import arrowIcon from "../../assets/img/icons/HobbyIcon/back_arrow.svg";
import stampImage from "../../assets/img/stamp.svg";
import defaultProfileImg from "../../assets/img/sample/sample_profile.svg";

import PsychTestList from "./PsychTestList";
import ReviewList from "./ReviewList";

function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector(
    (state: RootState) => state.user
  ) as UserState | null;

  useEffect(() => {
    if (!user) dispatch(fetchUser());
  }, [dispatch, user]);

  // 더미 데이터 대체용
  const fallbackUser: UserState = {
    userId: 0,
    socialType: "KAKAO",
    nickname: "밥만 잘먹더라",
    gender: "Male",
    latitude: 0,
    longitude: 0,
    age: 21,
    interests: "",
    footprint: 245,
    question: "",
    questionList: "",
    imgUrl: "",
    maxAgeGap: 0,
    allowOppositeGender: true,
    maxMatchingDistance: 0,
  };

  const displayUser = user || fallbackUser;
  const footprint = displayUser.footprint ?? 0;
  const footprintGoal = 1000;
  const percentage = Math.min((footprint / footprintGoal) * 100, 100);

  useEffect(() => {
    console.log("닉네임:", displayUser.nickname);
    console.log("성별:", displayUser.gender);
  }, [displayUser]);

  return (
    <>
      <NavBar />

      <div className="w-[100%] px-4 max-w-md h-[calc(100vh-100px)] overflow-y-auto flex flex-col items-center space-y-3 mt-26">
        {" "}
        {/* 내 정보 요약 */}
        <button
          onClick={() => navigate("/profile/edit")}
          className="flex items-center justify-between w-full px-4 py-2 cursor-pointer"
        >
          {/* 우표형 프로필 */}
          <div className="flex items-center gap-3">
            <div
              className="relative w-[50px] h-[50px]"
              style={{
                backgroundImage: `url(${stampImage})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            >
              <img
                src={displayUser.imgUrl || defaultProfileImg}
                alt="profile"
                className="absolute top-[6%] left-[6%] w-[88%] h-[88%] object-cover rounded-[2px]"
              />
            </div>

            <div className="flex flex-col text-left">
              <div className="text-[16px] text-[#333] font-GanwonEduAll_Bold">
                {displayUser.nickname}
              </div>
              <div className="text-sm text-[#999999] font-GanwonEduAll_Light">
                {displayUser.age}세 ·{" "}
                {displayUser.gender === "Male" ? "남성" : "여성"}
              </div>
            </div>
          </div>

          {/* 반전된 화살표 */}
          <img
            src={arrowIcon}
            alt="arrow"
            className="w-4 h-4 transform scale-x-[-1]"
          />
        </button>
        {/* 만남 발자국 */}
        <div className="w-full bg-white rounded-xl px-5 py-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <div className="text-sm text-[#666666] font-GanwonEduAll_Light">
              만남 발자국 <span className="text-[#bbb] text-xs">ⓘ</span>
            </div>
            <div className="text-sm text-[#BD4B2C] font-GanwonEduAll_Bold">
              {Math.floor(footprint)}보
            </div>
          </div>
          <div className="w-full h-2 bg-gray-300 rounded-full">
            <div
              className="h-2 bg-[#BD4B2C] rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <PsychTestList />
        <ReviewList
          reviews={[
            { content: "친절하고 배려심 있어요", count: 11 },
            { content: "재밌어요", count: 9 },
            { content: "말이 잘 통해요", count: 1 },
          ]}
        />
      </div>

      {/* 상단 제목 */}
      <div className="absolute top-[50px] text-[#333333] left-0 right-0 px-6 text-center">
        <p className="text-[20px] font-MuseumClassic_L italic">마이페이지</p>
        <img
          src={bellIcon}
          alt="bell_default"
          className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px]"
        />
      </div>
    </>
  );
}

export default ProfilePage;
