import { FC } from 'react';

import img1 from '../assets/img/icons/Survey/1.svg';
import img2 from '../assets/img/icons/Survey/2.svg';
import img3 from '../assets/img/icons/Survey/3.svg';
import img4 from '../assets/img/icons/Survey/4.svg';
import img5 from '../assets/img/icons/Survey/5.svg';

const countImageMap: Record<number, string> = {
  1: img1,
  2: img2,
  3: img3,
  4: img4,
  5: img5,
};

interface SurveyRoomProps {
  countImage?: number;
  name: string;
  message: string;
  time: string;
  unreadCount?: number;
}

const SurveyRoom: FC<SurveyRoomProps> = ({
  countImage = 1,
  name,
  message,
  time,
  unreadCount = 0,
}) => {
  return (
    <div className="flex items-center bg-white rounded-xl p-3 shadow mb-2">
      <img
        src={countImageMap[countImage] || img1}
        alt="숫자 이미지"
        className="w-12 h-12 rounded-md object-cover mr-3"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className="font-GanwonEduAll_Bold text-sm truncate mr-2">
            {name}
          </span>
          <span className="text-xs font-GanwonEduAll_Light text-gray-500">
            {time}
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs font-GanwonEduAll_Light text-gray-400 truncate mr-2">
            {message}
          </span>
          {unreadCount > 0 && (
            <span className=" bg-[#BD4B2C] text-white font-GanwonEduAll_Light text-xs px-1 py-[1px] rounded-full">
              N
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyRoom;
