// RecommendModal.tsx
import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import sample_profile from '../assets/img/sample/sample_profile.svg';
import { useAppDispatch } from '../Utils/hooks';
import { setStatus } from '../Utils/matchingSlice';
import { useNavigate } from 'react-router-dom';

interface RecommendModalProps {
  userIds: number[];
  status?: string;
}

interface UserInfo {
  userId: number;
  socialType: string;
  nickname: string;
  gender: string;
  latitude: number;
  longitude: number;
  age: number;
  interests: string;
  footprint: number;
  question: string;
  questionList: string;
  imgUrl: string;
  maxAgeGap: number;
  allowOppositeGender: boolean;
  maxMatchingDistance: number;
}

const RecommendModal: FC<RecommendModalProps> = ({ userIds, status }) => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const results = await Promise.all(
          userIds.map((id) =>
            axios
              .get(`https://www.mannamdeliveries.link/api/user/${id}`, {
                withCredentials: true,
              })
              .then((res) => res.data)
          )
        );
        setUsers(results);
      } catch (error) {
        console.error('상대 유저 정보 로딩 실패:', error);
        toast.error('유저 정보에 문제가 발생했습니다');
      }
    };

    fetchUsers();
  }, [userIds]);

  const handleMatchRequest = async (receiverId: number) => {
    try {
      await axios.post(
        `https://www.mannamdeliveries.link/api/matches/request`,
        {},
        {
          params: { receiverId },
          withCredentials: true,
        }
      );
      dispatch(setStatus('default'));
      toast.success('매칭 요청이 전송되었습니다!');
      navigate('/main');
    } catch (error) {
      console.error('매칭 요청 실패:', error);
      toast.error('매칭 요청에 실패했어요.');
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-GanwonEduAll_Bold text-center">추천 친구</h2>
      {users.map((user) => (
        <div
          key={user.userId}
          className="flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-2"
        >
          <img
            src={user.imgUrl || sample_profile}
            onError={(e) => (e.currentTarget.src = sample_profile)}
            alt={`${user.nickname}의 프로필`}
            className="w-12 h-12 rounded-full object-cover border"
          />
          <div className="flex-1">
            <p className="text-sm font-GanwonEduAll_Light leading-4">
              {user.nickname}
            </p>
            <p className="text-xs font-GanwonEduAll_Light text-gray-500">
              {user.gender} · {user.age}세
            </p>
          </div>
          {status !== 'success' && (
            <button
              onClick={() => handleMatchRequest(user.userId)}
              className="text-xs font-GanwonEduAll_Bold bg-blue-500 hover:bg-blue-300 text-white px-2 py-1 rounded-lg"
            >
              매칭 요청
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default RecommendModal;
