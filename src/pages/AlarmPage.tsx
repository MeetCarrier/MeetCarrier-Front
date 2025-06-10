import NavBar from '../components/NavBar';
import { FormatTimestamp } from '../Utils/FormatTimeStamp';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import back_arrow from '../assets/img/icons/HobbyIcon/back_arrow.svg';
import check_icon from '../assets/img/icons/MainPageIcon/check_icon.svg';
import person_icon from '../assets/img/icons/Test/interpersonalskill_icon.svg';

interface Notification {
  id: number;
  type: string;
  message: string;
  createdAt: string;
  read: boolean;
}

function AlarmPage() {
  const navigate = useNavigate();
  const [alarms, setAlarms] = useState<Notification[]>([]);

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

  // 알림 타입별 핸들러 틀
  const handleReview = (notification: Notification) => {
    // TODO: Review 알림 처리
  };

  const handleReport = (notification: Notification) => {
    // TODO: Report 알림 처리
  };

  const handleJournal = (notification: Notification) => {
    navigate('/Calendar');
  };

  const handleMeeting = (notification: Notification) => {
    // TODO: Meeting 알림 처리
  };

  const handleRequest = (notification: Notification) => {
    // TODO: Request 알림 처리
  };

  const handleMatch = (notification: Notification) => {
    // TODO: Match 알림 처리
  };

  const handleInvitationRequest = (notification: Notification) => {
    // TODO: InvitationRequest 알림 처리
  };

  const handleInvitationAccepted = (notification: Notification) => {
    // TODO: InvitationAccepted 알림 처리
  };

  const handleInvitationRejected = (notification: Notification) => {
    // TODO: InvitationRejected 알림 처리
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
          const isPersonIcon = [
            'InvitationRequest',
            'InvitationAccepted',
            'InvitationRejected',
          ].includes(alarm.type);

          const icon = isPersonIcon ? person_icon : check_icon;
          const formattedDate = FormatTimestamp(alarm.createdAt);

          return (
            <div key={alarm.id} className="py-3 flex gap-3">
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
          );
        })}
      </div>
    </>
  );
}

export default AlarmPage;
