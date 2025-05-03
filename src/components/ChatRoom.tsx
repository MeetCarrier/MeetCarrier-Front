import { FC } from 'react';
import stamp from '../assets/img/stamp.svg';

interface ChatRoomProps {
  profileImage: string;
  name: string;
  message: string;
  time: string;
  unreadCount?: number;
}

const ChatRoom: FC<ChatRoomProps> = ({
  profileImage,
  name,
  message,
  time,
  unreadCount = 0,
}) => {
  const displayCount = unreadCount > 99 ? '99+' : unreadCount;

  return (
    <div className="flex items-center bg-white rounded-xl p-3 shadow mb-2">
      <div className="relative w-12 h-12 mr-3">
        <img
          src={stamp}
          alt="stamp"
          className="absolute inset-0 w-full h-full"
        />
        <img
          src={profileImage}
          alt={name}
          className="absolute inset-1 w-10 h-10 object-cover rounded-md"
        />
      </div>
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
              {displayCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
