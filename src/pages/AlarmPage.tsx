import NavBar from '../components/NavBar';
import { FormatTimestamp } from '../Utils/FormatTimeStamp';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import RecFriendModal from '../Modal/RecFriendModal';
import axios from 'axios';
import back_arrow from '../assets/img/icons/HobbyIcon/back_arrow.svg';
import check_icon from '../assets/img/icons/MainPageIcon/check_icon.svg';
import person_icon from '../assets/img/icons/Test/interpersonalskill_icon.svg';
import delete_icon from '../assets/img/icons/Dairy/delete_icon.svg';
import toast from 'react-hot-toast';
import { number } from 'motion/react';

interface Notification {
  id: number;
  referenceId?: number;
  type: string;
  message: string;
  createdAt: string;
  read: boolean;
}

function AlarmPage() {
  const navigate = useNavigate();
  const [alarms, setAlarms] = useState<Notification[]>([]);
  const [activeNotificationId, setActiveNotificationId] = useState<
    number | null
  >(null);
  const [isRecFriendModal, setIsRecFriendModal] = useState(false);
  const [requestId, setRequestId] = useState<number | null>(null);

  // 삭제되면 안되는 알림
  const nonDeletableTypes = new Set([
    'Request',
    'InvitationRequest',
    'InvitationAccepted',
    'InvitationRejected',
  ]);

  useEffect(() => {
    const fetchAlarms = async () => {
      try {
        const response = await axios.get(
          'https://www.mannamdeliveries.link/api/notification',
          { withCredentials: true }
        );
        console.log(response.data);
        setAlarms(response.data);
      } catch (error) {
        console.error('알림을 가져오지 못했어요', error);
      }
    };
    fetchAlarms();
  }, []);

  const handleBackClick = () => {
    navigate('/main');
  };

  // 리뷰
  const handleReview = (notification: Notification) => {
    // TODO: Review 알림 처리
  };
  // 신고에 대한 처리
  const handleReport = (notification: Notification) => {
    // TODO: Report 알림 처리
  };
  // 칭찬 일기
  const handleJournal = (notification: Notification) => {
    navigate('/Calendar');
  };
  // 만남 일수? 알려주는 것
  const handleMeeting = (notification: Notification) => {
    // TODO: Meeting 알림 처리
  };
  // 추천 친구 매칭 요청
  const handleRequest = async (notification: Notification) => {
    if (notification.referenceId == null || notification.id == null) {
      toast('유효하지 않은 친구 요청입니다.');
      return;
    }
    setRequestId(notification.referenceId);
    // 활성화 후 알림 지우기 위해서
    setActiveNotificationId(notification.id);
    setIsRecFriendModal(true);
  };
  // 매칭이 성사되면 오는 것
  const handleMatch = (notification: Notification) => {
    // TODO: Match 알림 처리
  };
  // 만남 초대장 요청
  const handleInvitationRequest = (notification: Notification) => {
    // TODO: InvitationRequest 알림 처리
  };
  // 상대가 만남 초대장 수락
  const handleInvitationAccepted = (notification: Notification) => {
    // TODO: InvitationAccepted 알림 처리
  };
  // 상대가 만남 초대장 거절
  const handleInvitationRejected = (notification: Notification) => {
    // TODO: InvitationRejected 알림 처리
  };
  // 만남 확정
  const handleMeetingAccepted = (notification: Notification) => {
    // TODO: InvitationRejected 알림 처리
  };
  // 일정 조정 요청
  const handleMeetingRejected = (notification: Notification) => {
    // TODO: InvitationRejected 알림 처리
  };

  const handleDeleteAlarm = async (notification: Notification) => {
    try {
      await axios.delete(
        `https://www.mannamdeliveries.link/api/notification/${notification.id}`,
        { withCredentials: true }
      );
      setAlarms((prev) => prev.filter((a) => a.id !== notification.id));
    } catch (error) {
      console.error('삭제 실패', error);
      toast.error('삭제에 실패했어요.');
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    const handlers: Record<string, (n: Notification) => void> = {
      Review: handleReview,
      Report: handleReport,
      Journal: handleJournal,
      Meeting: handleMeeting,
      Request: handleRequest,
      Match: handleMatch,
      InvitationRequest: handleInvitationRequest,
      InvitationAccepted: handleInvitationAccepted,
      InvitationRejected: handleInvitationRejected,
      MeetingAccepted: handleMeetingAccepted,
      MeetingRejected: handleMeetingRejected,
    };

    const handler = handlers[notification.type];
    if (handler) {
      handler(notification);
    } else {
      console.warn('정의되지 않은 알림 타입:', notification.type);
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
        <p className="text-[20px] font-MuseumClassic_L italic">알림</p>
      </div>

      <div className="flex flex-col w-full h-[calc(100%-200px)] px-4 overflow-y-auto">
        {[...alarms].reverse().map((alarm) => {
          const isDeletable = !nonDeletableTypes.has(alarm.type);
          const isPersonIcon = [
            'InvitationRequest',
            'InvitationAccepted',
            'InvitationRejected',
          ].includes(alarm.type);

          const icon = isPersonIcon ? person_icon : check_icon;
          const formattedDate = FormatTimestamp(alarm.createdAt);

          return (
            <div key={alarm.id} className="py-3 flex justify-between gap-3">
              <div className="flex gap-3 flex-1">
                <img src={icon} alt="icon" className="w-5 h-5 mt-1 shrink-0" />
                <div className="flex flex-col">
                  <p
                    className="font-GanwonEduAll_Bold text-[#333333] cursor-pointer"
                    onClick={() => handleNotificationClick(alarm)}
                  >
                    {alarm.message}
                  </p>
                  <p className="text-xs font-GanwonEduAll_Light text-[#333333]/80">
                    {formattedDate}
                  </p>
                </div>
              </div>

              {isDeletable && (
                <button
                  onClick={() => handleDeleteAlarm(alarm)}
                  className="w-4 h-4 cursor-pointer"
                >
                  <img
                    src={delete_icon}
                    alt="delete_icon"
                    className="w-4 h-4 mt-1"
                  />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 모달 작성 */}
      <Modal
        isOpen={isRecFriendModal}
        onClose={() => setIsRecFriendModal(false)}
      >
        <RecFriendModal
          notificationId={activeNotificationId}
          requestId={requestId}
          onClosed={() => setIsRecFriendModal(false)}
          onHandled={(notificationId) => {
            setAlarms((prev) => prev.filter((a) => a.id !== notificationId));
          }}
        />
      </Modal>
    </>
  );
}

export default AlarmPage;
