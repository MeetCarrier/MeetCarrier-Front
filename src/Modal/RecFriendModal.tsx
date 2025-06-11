import { FC } from 'react';
import axios from 'axios';
import modalbtn_icon from '../assets/img/icons/ModalBtn/modalbtn_icon.svg';
import toast from 'react-hot-toast';

interface RecFriendModalProps {
  notificationId: number | null;
  requestId: number | null;
  onClosed: () => void;
  onHandled: (notificationId: number) => void;
}

const RecFriendModal: FC<RecFriendModalProps> = ({
  notificationId,
  requestId,
  onClosed,
  onHandled,
}) => {
  // 추천 친구 수락&거절
  const handleMatching = async (accepted: boolean) => {
    try {
      if (accepted) {
        const res = await axios.get(
          'https://www.mannamdeliveries.link/api/matches/can-request',
          {
            withCredentials: true,
          }
        );
        console.log(res.data);

        if (res.data === false) {
          toast.error('이미 진행 중인 만남이 있어 수락할 수 없어요.');
          await axios.post(
            'https://www.mannamdeliveries.link/api/matches/respond',
            {
              requestId: requestId,
              accepted: false,
            },
            { withCredentials: true }
          );
          if (notificationId != null) {
            await axios.delete(
              `https://www.mannamdeliveries.link/api/notification/${notificationId}`,
              { withCredentials: true }
            );
            onHandled(notificationId);
          }
          return;
        }
      }

      await axios.post(
        'https://www.mannamdeliveries.link/api/matches/respond',
        {
          requestId: requestId,
          accepted: accepted,
        },
        { withCredentials: true }
      );
      toast.success(accepted ? '수락했어요!' : '거절했어요!');

      // 알림 삭제
      if (notificationId != null) {
        await axios.delete(
          `https://www.mannamdeliveries.link/api/notification/${notificationId}`,
          { withCredentials: true }
        );
        onHandled(notificationId);
      }
    } catch (error) {
      console.error(error);
      toast.error('요청 실패했어요 다음에 시도해 주세요');
    } finally {
      onClosed();
    }
  };

  return (
    <>
      <h2 className="mb-3 text-[20px] font-GanwonEduAll_Bold">
        추천 친구와 만남을 수락하시겠어요?
      </h2>
      <p className="text-xs font-GanwonEduAll_Light mb-3 text-[#333333]/80">
        수락하면 만남 센터에서 친구와 질문지를 작성할 수 있어요.
      </p>
      <div className="flex items-center justify-end">
        <button
          className="mr-3 font-GanwonEduAll_Light cursor-pointer"
          onClick={() => {
            handleMatching(false);
          }}
        >
          거절
        </button>
        <button
          className="relative cursor-pointer"
          onClick={() => {
            handleMatching(true);
          }}
        >
          <img src={modalbtn_icon} alt="modalbtn" />
          <span className="absolute inset-0 flex items-center justify-center font-GanwonEduAll_Light text-[#FAFAFA]">
            수락
          </span>
        </button>
      </div>
    </>
  );
};

export default RecFriendModal;
