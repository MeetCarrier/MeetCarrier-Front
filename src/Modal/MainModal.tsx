import type { FC } from 'react';

import icon_like from '../assets/img/icons/MainPageIcon/like_icon.svg';
import icon_vector from '../assets/img/icons/MainPageIcon/vector_icon.svg';
import icon_cloud from '../assets/img/icons/MainPageIcon/cloud_icon.svg';
import icon_check from '../assets/img/icons/MainPageIcon/check_icon.svg';

const MainModal: FC = () => {
  return (
    <div className="w-full">
      <h2 className="text-center text-base font-semibold mb-4">
        나의 매칭 정보
      </h2>

      <ul className="divide-y divide-gray-200">
        <li className="py-3">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <img src={icon_like} alt="관심사" className="w-4.5 h-4.5" />
              <span className="font-medium font-GanwonEduAll_Bold text-[#333333] text-sm">
                관심사
              </span>
            </div>
            <span className="text-gray-400 text-xl">›</span>
          </div>
          <div>
            <span className="text-gray-500 text-xs font-GanwonEduAll_Light">
              무관
            </span>
          </div>
        </li>

        <li className="py-3">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <img src={icon_vector} alt="거리" className="w-4.5 h-4.5" />
              <span className="font-medium font-GanwonEduAll_Bold text-[#333333] text-sm">
                거리
              </span>
            </div>
            <span className="text-gray-400 text-xl">›</span>
          </div>
          <div>
            <span className="text-gray-500 text-xs font-GanwonEduAll_Light">
              10km
            </span>
          </div>
        </li>

        <li className="py-3">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <img src={icon_cloud} alt="질문" className="w-4.5 h-4.5" />
              <span className="font-medium font-GanwonEduAll_Bold text-[#333333] text-sm">
                친구에게 물어보고 싶은 질문
              </span>
            </div>
            <span className="text-gray-400 text-xl">›</span>
          </div>
          <div>
            <span className="text-gray-500 text-xs font-GanwonEduAll_Light">
              없음
            </span>
          </div>
        </li>

        <li className="py-3">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <img
                src={icon_check}
                alt="자기 평가 테스트"
                className="w-4.5 h-4.5"
              />
              <span className="font-medium text-sm font-GanwonEduAll_Bold text-[#333333]">
                자기 평가 테스트
              </span>
            </div>
            <span className="text-gray-400 text-xl">›</span>
          </div>
          <div>
            <span className="text-gray-500 text-xs font-GanwonEduAll_Light">
              아직 '자기 평가 테스트'를 하지 않았어요!
            </span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default MainModal;
