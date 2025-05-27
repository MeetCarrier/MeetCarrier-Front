import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Utils/store";
import { UserState } from "../Utils/userSlice";
import { motion } from "motion/react";
import axios from "axios";
import NavBar from "../components/NavBar";
import check_icon from "../assets/img/icons/HobbyIcon/check.svg";
import back_arrow from "../assets/img/icons/HobbyIcon/back_arrow.svg";

function RangeSetting() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/main?modal=true");
  };

  const [isOn, setIsOn] = useState(true);
  const [distance, setDistance] = useState(10);
  const [age, setAge] = useState(5);

  const user = useSelector(
    (state: RootState) => state.user
  ) as UserState | null;

  useEffect(() => {
    if (user) {
      setDistance(user.maxMatchingDistance);
      setAge(user.maxAgeGap);
      setIsOn(user.allowOppositeGender);
    }
  }, [user]);

  const handleSubmit = async () => {
    try {
      await axios.patch(
        "https://www.mannamdeliveries.link/api/user",
        {
          maxMatchingDistance: distance,
          maxAgeGap: age,
          allowOppositeGender: isOn,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      alert("저장 완료!");
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했어요.");
    }
  };

  return (
    <>
      <NavBar />
      <div className="absolute top-[50px] text-[#333333] left-0 right-0 px-6 text-center">
        <img
          src={back_arrow}
          alt="back_arrow"
          className="absolute top-1/2 -translate-y-1/2 left-6 w-[9px] h-[20px] cursor-pointer"
          onClick={handleBackClick}
        />
        <p className="text-[20px] font-MuseumClassic_L italic">
          범위 설정 수정
        </p>
        <img
          src={check_icon}
          alt="check_icon"
          className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px] cursor-pointer"
          onClick={handleSubmit}
        />
      </div>
      <div className="flex flex-col w-full h-[calc(100%-200px)] overflow-y-auto p-4 z-0 space-y-4 bg-[#F2F2F2]">
        {/* 매칭 거리 */}
        <div className="bg-white rounded-md p-4 shadow-sm">
          <p className="text-sm font-GanwonEduAll_Bold text-[#333] mb-2">
            매칭 거리
          </p>
          <div className="flex justify-between items-center">
            <span className="text-xs font-GanwonEduAll_Light text-gray-500 mb-2">
              {distance}km
            </span>
            <input
              type="range"
              min={10}
              max={30}
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="
                w-[40%]
                appearance-none bg-transparent
                [&::-webkit-slider-runnable-track]:h-1
                [&::-webkit-slider-runnable-track]:rounded-full
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:border
                [&::-webkit-slider-thumb]:border-gray-300
                [&::-webkit-slider-thumb]:shadow-md
                [&::-webkit-slider-thumb]:mt-[-6px]
              "
              style={{
                // ((distance - min) / (max - min)) * 100;
                background: `linear-gradient(to right, #BD4B2C 0%, #BD4B2C ${
                  (distance - 10) * 5
                }%, #e5e7eb ${(distance - 10) * 5}%, #e5e7eb 100%)`,
                borderRadius: "9999px",
              }}
            />
          </div>
        </div>

        {/* 상대와 연령 차이 */}
        <div className="bg-white rounded-md p-4 shadow-sm">
          <p className="text-sm font-GanwonEduAll_Bold text-[#333] mb-2">
            상대와 연령 차이
          </p>
          <div className="flex justify-between items-center">
            <span className="text-xs font-GanwonEduAll_Light text-gray-500 mb-2">
              ± {age}세
            </span>
            <input
              type="range"
              min={0}
              max={10}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="
                w-[40%]
                appearance-none bg-transparent
                [&::-webkit-slider-runnable-track]:h-1
                [&::-webkit-slider-runnable-track]:rounded-full
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:border
                [&::-webkit-slider-thumb]:border-gray-300
                [&::-webkit-slider-thumb]:shadow-md
                [&::-webkit-slider-thumb]:mt-[-6px]
              "
              style={{
                background: `linear-gradient(to right, #BD4B2C 0%, #BD4B2C ${
                  (age - 0) * 10
                }%, #e5e7eb ${(age - 0) * 10}%, #e5e7eb 100%)`,
                borderRadius: "9999px",
              }}
            />
          </div>
        </div>

        {/* 이성 매칭 허용 */}
        <div className="bg-white rounded-md p-4 shadow-sm">
          <p className="text-sm font-GanwonEduAll_Bold text-[#333] mb-2">
            이성 매칭 허용
          </p>
          <div className="flex justify-between items-center">
            <span className="text-xs font-GanwonEduAll_Light text-gray-500">
              동성과 이성 모두 매칭
            </span>
            <div
              onClick={() => setIsOn((prev) => !prev)}
              className={`w-12 h-5.5 flex items-center rounded-full cursor-pointer px-1 transition-colors duration-300 ${
                isOn ? "bg-[#BD4B2C]" : "bg-gray-300"
              }`}
            >
              <motion.div
                className="w-4.5 h-4.5 bg-white rounded-full shadow"
                animate={{
                  x: isOn ? 22 : 0,
                }}
                transition={{
                  type: "tween",
                  duration: 0.1,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col mb-2 w-full">
        <p className="text-xs font-GanwonEduAll_Light text-gray-500 pl-3">
          어떤 친구와 매칭될 지 설정할 수 있어요
        </p>
      </div>
    </>
  );
}

export default RangeSetting;
