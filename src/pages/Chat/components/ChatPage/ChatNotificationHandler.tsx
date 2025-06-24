import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { NotificationType } from "../ChatNotificationBar";
import ChatNotificationBar from "../ChatNotificationBar";

interface ChatNotificationHandlerProps {
  matchData: any;
  myId: number | undefined;
  myNickname: string;
  otherNickname: string;
  isSender: boolean;
  roomInfo: any;
}

const ChatNotificationHandler: React.FC<ChatNotificationHandlerProps> = ({
  matchData,
  myId,
  myNickname,
  otherNickname,
  isSender,
  roomInfo,
}) => {
  const navigate = useNavigate();
  const [notificationType, setNotificationType] =
    useState<NotificationType>("NO_INVITATION");
  const [meetingDate, setMeetingDate] = useState<Date | undefined>();
  const [remainingTime, setRemainingTime] = useState<string>("");
  const [meetingId, setMeetingId] = useState<number | null>(null);
  const [isMeetingSender, setIsMeetingSender] = useState<boolean>(false);
  const [updateCount, setUpdateCount] = useState<number | undefined>();

  useEffect(() => {
    const fetchMeetingStatus = async () => {
      if (!matchData?.id || !myId) {
        setNotificationType("NO_INVITATION");
        return;
      }
      try {
        const response = await axios.get(
          `https://www.mannamdeliveries.link/api/meetings/${matchData.id}`,
          { withCredentials: true }
        );
        const meetingInfo = response.data;
        console.log("[ChatNotificationHandler] meetingInfo:", meetingInfo);
        setMeetingId(meetingInfo.id);
        setUpdateCount(meetingInfo.updateCount);
        if (meetingInfo.date) setMeetingDate(new Date(meetingInfo.date));
        // 일정 등록자 구분 (meetingInfo.nickname은 받는 사람)
        setIsMeetingSender(meetingInfo.nickname !== myNickname);
        // status 분기
        if (meetingInfo.status === "PENDING") {
          setNotificationType("PENDING_SCHEDULE");
        } else if (meetingInfo.status === "ACCEPTED") {
          setNotificationType("SCHEDULED");
        } else if (meetingInfo.status === "REJECTED") {
          setNotificationType("NEED_SCHEDULE");
        } else {
          setNotificationType("NEED_SCHEDULE");
        }
      } catch (error) {
        // 404 등 에러 시 NEED_SCHEDULE
        setNotificationType("NEED_SCHEDULE");
      }
    };
    fetchMeetingStatus();
  }, [matchData?.id, myId]);

  useEffect(() => {
    const updateRemainingTime = () => {
      if (roomInfo?.deactivationTime) {
        const now = new Date();
        const deactivation = new Date(roomInfo.deactivationTime);
        const diff = deactivation.getTime() - now.getTime();
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setRemainingTime(`${hours}시간 ${minutes}분 ${seconds}초`);
        } else {
          setRemainingTime("00시간 00분 00초");
        }
      }
    };
    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000);
    return () => clearInterval(interval);
  }, [roomInfo?.deactivationTime]);

  const handleScheduleMeeting = () => {
    navigate("/meeting-schedule", {
      state: {
        senderName: myNickname,
        recipientName: otherNickname,
        matchId: matchData?.id,
        receiverId: myId || 0,
        roomId: roomInfo?.id,
      },
    });
  };

  const handleModifySchedule = () => {
    navigate("/meeting-schedule", {
      state: {
        senderName: myNickname,
        recipientName: otherNickname,
        matchId: matchData?.id,
        receiverId: myId || 0,
        roomId: roomInfo?.id,
        isModify: true,
        meetingId,
      },
    });
  };

  return (
    <>
      {roomInfo?.status === "Activate" && (
        <ChatNotificationBar
          type={notificationType}
          isSender={isSender}
          senderName={myNickname}
          recipientName={otherNickname}
          remainingTime={remainingTime}
          meetingDate={meetingDate}
          deactivationTime={roomInfo.deactivationTime}
          onScheduleMeeting={handleScheduleMeeting}
          onModifySchedule={handleModifySchedule}
          matchId={matchData?.id}
          myId={myId}
          roomId={roomInfo?.id}
          meetingId={meetingId ?? undefined}
          isMeetingSender={isMeetingSender}
          updateCount={updateCount}
        />
      )}
    </>
  );
};

export default ChatNotificationHandler;
