import React from "react";
import Modal from "./Modal";
import stampImage from "../assets/img/stamp.svg";
import defaultProfileImg from "../assets/img/sample/sample_profile.svg";

export type UserProfileData = {
  userId: number;
  nickname: string;
  imgUrl?: string | null;
  age?: number;
  gender?: string;
  footprint?: number;
  interests?: string;
  question?: string;
};

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfileData;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const { nickname, age, gender, footprint, imgUrl, interests, question } =
    user;
  const footprintGoal = 1000;
  const percentage = Math.min(((footprint ?? 0) / footprintGoal) * 100, 100);

  const profileImageUrl = imgUrl || defaultProfileImg;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center w-full space-y-4 font-GanwonEduAll_Light">
        {/* 프로필 */}
        <div className="flex items-center gap-3 w-full">
          <div
            className="relative w-[50px] h-[50px]"
            style={{
              backgroundImage: `url(${stampImage})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <img
              src={profileImageUrl}
              alt="profile"
              className="absolute top-[6%] left-[6%] w-[88%] h-[88%] object-cover rounded-[2px]"
            />
          </div>

          <div className="flex flex-col text-left">
            <p className="text-[16px] text-[#333] font-GanwonEduAll_Bold">
              {nickname}
            </p>
            <p className="text-sm text-[#999999]">
              {age}세 · {gender === "Male" ? "남성" : "여성"}
            </p>
          </div>
        </div>

        {/* 발자국 */}
        <div className="w-full bg-[#F9F9F9] rounded-xl px-5 py-3">
          <div className="flex justify-between text-sm text-[#666] mb-1">
            <span>만남 발자국</span>
            <span className="text-[#BD4B2C] font-GanwonEduAll_Bold">
              {Math.floor(footprint ?? 0)}보
            </span>
          </div>
          <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-2 bg-[#BD4B2C] rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* 관심사 */}
        <div className="w-full bg-[#F9F9F9] rounded-xl px-5 py-3">
          <p className="text-sm font-GanwonEduAll_Bold mb-2">관심사</p>
          {interests ? (
            <p className="text-sm text-[#666] whitespace-pre-wrap">
              {interests?.replace(/,/g, ", ")}
            </p>
          ) : (
            <p className="text-sm text-[#aaa]">관심사가 없습니다.</p>
          )}
        </div>

        {/* 질문 */}
        <div className="w-full bg-[#F9F9F9] rounded-xl px-5 py-3">
          <p className="text-sm font-GanwonEduAll_Bold mb-2">
            친구에게 물어보고 싶은 질문
          </p>
          {question ? (
            <p className="text-sm text-[#666] whitespace-pre-wrap">
              "{question}"
            </p>
          ) : (
            <p className="text-sm text-[#aaa]">등록된 질문이 없습니다.</p>
          )}
        </div>

        {/* 후기 */}
        <div className="w-full bg-[#F9F9F9] rounded-xl px-5 py-3">
          <p className="text-sm font-GanwonEduAll_Bold mb-2">받은 후기</p>
          <p className="text-sm text-[#aaa]">아직 후기가 없어요.</p>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileModal;
