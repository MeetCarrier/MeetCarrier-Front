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

  useEffect(() => {
    const fetchInvitationStatus = async () => {
      if (!matchData?.id || !myId) {
        setNotificationType("NO_INVITATION");
        return;
      }

      try {
        const response = await axios.get(`/api/invitation/${matchData.id}`);
        const invitation = response.data;

        if (invitation.status === "PENDING") {
          setNotificationType("PENDING");
        } else if (invitation.status === "ACCEPTED") {
          try {
            const meetingResponse = await axios.get(
              `/api/meetings/${matchData.id}`
            );
            setMeetingDate(new Date(meetingResponse.data.date));
            setMeetingId(meetingResponse.data.id);
            setNotificationType("SCHEDULED");
          } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
              setNotificationType("NEED_SCHEDULE");
            }
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setNotificationType("NO_INVITATION");
        }
      }
    };

    fetchInvitationStatus();
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

  const handleSendInvitation = async () => {
    try {
      await axios.post(`/api/invitation/${matchData?.id}`);
      setNotificationType("PENDING");
    } catch (error) {
      console.error("초대장 전송 실패:", error);
    }
  };

  const handleAcceptInvitation = async () => {
    try {
      await axios.put(`/api/invitation/${matchData?.id}/accept`);
      setNotificationType("NEED_SCHEDULE");
    } catch (error) {
      console.error("초대장 수락 실패:", error);
    }
  };

  const handleRejectInvitation = async () => {
    try {
      await axios.put(`/api/invitation/${matchData?.id}/reject`);
      setNotificationType("NO_INVITATION");
    } catch (error) {
      console.error("초대장 거절 실패:", error);
    }
  };

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
    <ChatNotificationBar
      type={notificationType}
      isSender={isSender}
      senderName={myNickname}
      recipientName={otherNickname}
      remainingTime={remainingTime}
      meetingDate={meetingDate}
      onSendInvitation={handleSendInvitation}
      onAcceptInvitation={handleAcceptInvitation}
      onRejectInvitation={handleRejectInvitation}
      onScheduleMeeting={handleScheduleMeeting}
      onModifySchedule={handleModifySchedule}
    />
  );
};

export default ChatNotificationHandler;
