import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { UserState } from '../Utils/userSlice';
import { useAppSelector } from '../Utils/hooks';
import { formatDate } from '../Utils/FormatDate';

import icon_like from '../assets/img/icons/MainPageIcon/like_icon.svg';
import icon_vector from '../assets/img/icons/MainPageIcon/vector_icon.svg';
import icon_cloud from '../assets/img/icons/MainPageIcon/cloud_icon.svg';
import icon_check from '../assets/img/icons/MainPageIcon/check_icon.svg';

type MainModalProps = {
  fromMatching?: boolean;
};

const MainModal: FC<MainModalProps> = ({ fromMatching = false }) => {
  const navigate = useNavigate();

  const handleHobbyClick = () => {
    navigate('/Hobby');
  };

  const handleSurveyQClick = () => {
    navigate('/SurveyQuestion');
  };

  const handleRangeSettingClick = () => {
    navigate('/RangeSetting');
  };

  const handleTestClick = () => {
    navigate('/SelfEvaluation');
  };

  const selfTestList = useAppSelector((state) => state.selfTest.list);

  const latestTestDate =
    selfTestList.length > 0
      ? formatDate(new Date(selfTestList[0].createdAt))
      : null;

  const user = useAppSelector((state) => state.user) as UserState | null;

  const interestsText =
    user?.interests && user.interests.trim() !== '' ? user.interests : '무관';

  // 수정..?
  const questionsText =
    user?.question && user.question.trim() !== '' ? user.question : '없음';

  // 거리 텍스트
  const distanceText =
    user?.maxMatchingDistance !== undefined
      ? `${user.maxMatchingDistance}km`
      : '정보 없음';

  // 연령차이 텍스트
  const ageGapText =
    user?.maxAgeGap !== undefined ? `±${user.maxAgeGap}세` : '정보 없음';

  // 이성 매칭 허용 여부 텍스트
  const genderAllowText =
    user?.allowOppositeGender === true ? '허용' : '비허용';

  useEffect(() => {
    if (user) {
      console.log('✅ 메인 모달에서 유저 정보:', user);
    }
  }, [user]);

  return (
    <div className="w-full">
      <h2 className="text-center text-[20px] text-base font-GanwonEduAll_Bold mb-4">
        나의 매칭 정보
      </h2>

      <ul className="divide-y divide-gray-200">
        <li className="py-3">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <img src={icon_like} alt="관심사" className="w-5 h-5 mt-1" />
              <span className="font-medium font-GanwonEduAll_Bold text-[#333333] text-[18px]">
                관심사
              </span>
            </div>
            {!fromMatching && (
              <span
                className="text-gray-400 text-xl cursor-pointer"
                onClick={handleHobbyClick}
              >
                ›
              </span>
            )}
          </div>
          <div>
            <span className="text-gray-500 mt-1 text-[14px] font-GanwonEduAll_Light line-clamp-3">
              {interestsText}
            </span>
          </div>
        </li>

        <li className="py-3">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <img src={icon_cloud} alt="질문" className="w-6 h-6 mt-1" />
              <span className="font-medium font-GanwonEduAll_Bold text-[#333333] text-[18px]">
                친구에게 물어보고 싶은 질문
              </span>
            </div>
            {!fromMatching && (
              <span
                className="text-gray-400 text-xl cursor-pointer"
                onClick={handleSurveyQClick}
              >
                ›
              </span>
            )}
          </div>
          <div>
            <span className="text-gray-500 mt-1 text-[14px] font-GanwonEduAll_Light line-clamp-3">
              {questionsText}
            </span>
          </div>
        </li>

        <li className="py-3">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <img src={icon_vector} alt="거리" className="w-5 h-5 mt-1" />
              <span className="font-medium font-GanwonEduAll_Bold text-[#333333] text-[18px]">
                범위 설정
              </span>
            </div>
            {!fromMatching && (
              <span
                className="text-gray-400 text-xl cursor-pointer"
                onClick={handleRangeSettingClick}
              >
                ›
              </span>
            )}
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-gray-500 text-[14px] font-GanwonEduAll_Light">
              매칭 거리
            </span>
            <span className="text-gray-500 text-[14px] font-GanwonEduAll_Light">
              {distanceText}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-gray-500 text-[14px] font-GanwonEduAll_Light">
              상대와 연령 차이
            </span>
            <span className="text-gray-500 text-[14px] font-GanwonEduAll_Light">
              {ageGapText}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-gray-500 text-[14px] font-GanwonEduAll_Light">
              이성 매칭 허용
            </span>
            <span className="text-gray-500 text-[14px] font-GanwonEduAll_Light">
              {genderAllowText}
            </span>
          </div>
        </li>

        <li className="py-3">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <img
                src={icon_check}
                alt="자기 평가 테스트"
                className="w-5 h-5 mt-1"
              />
              <span className="font-medium text-[18px] font-GanwonEduAll_Bold text-[#333333]">
                자기 평가 테스트
              </span>
            </div>
            {!fromMatching && (
              <span
                className="text-gray-400 text-xl cursor-pointer"
                onClick={handleTestClick}
              >
                ›
              </span>
            )}
          </div>
          <div>
            <span className="text-gray-500 text-[14px] font-GanwonEduAll_Light">
              {latestTestDate
                ? `${latestTestDate}`
                : "아직 '자기 평가 테스트'를 하지 않았어요!"}
            </span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default MainModal;
