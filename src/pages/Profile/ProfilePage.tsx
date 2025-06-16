import { useEffect } from "react";
import NavBar from "../../components/NavBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../Utils/store";
import { fetchUser, UserState } from "../../Utils/userSlice";
import { useNavigate } from "react-router-dom";
import { useUnreadAlarm } from "../../Utils/useUnreadAlarm";

import bell_default from "../../assets/img/icons/NavIcon/bell_default.webp";
import bell_alarm from "../../assets/img/icons/NavIcon/bell_alarm.webp";
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
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const isAlarm = useUnreadAlarm();

  const handlebellClick = () => {
    navigate("/Alarm");
  };

  if (!user) {
    return null; // 로그인 페이지로 리다이렉트되는 동안 아무것도 렌더링하지 않음
  }

  const footprint = user.footprint ?? 0;
  const footprintGoal = 1000;
  const percentage = Math.min((footprint / footprintGoal) * 100, 100);

  return (
    <>
      <NavBar />

      <div className="w-full px-4 max-w-md h-[calc(100vh-180px)] overflow-y-auto flex flex-col items-center space-y-3 mt-15">
        {" "}
        {/* 내 정보 요약 */}
        <button
          onClick={() => navigate("/profile/edit")}
          className="flex items-center justify-between w-full px-4 cursor-pointer"
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
                src={user.imgUrl || defaultProfileImg}
                alt="profile"
                className="absolute top-[6%] left-[6%] w-[88%] h-[88%] object-cover rounded-[2px]"
              />
            </div>

            <div className="flex flex-col text-left">
              <div className="text-[16px] text-[#333] font-GanwonEduAll_Bold">
                {user.nickname}
              </div>
              <div className="text-sm text-[#999999] font-GanwonEduAll_Light">
                {user.age}세 · {user.gender === "Male" ? "남성" : "여성"}
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
          <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-2 bg-[#BD4B2C] rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <PsychTestList />
        <ReviewList />
      </div>

      {/* 상단 제목 */}
      <div className="absolute top-[50px] text-[#333333] left-0 right-0 px-6 text-center">
        <p className="text-[20px] font-MuseumClassic_L italic">마이페이지</p>
        <img
          src={isAlarm ? bell_alarm : bell_default}
          alt="bell_default"
          className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px]"
          onClick={handlebellClick}
        />
      </div>
    </>
  );
}

export default ProfilePage;
