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
        console.log(
          "[초대장 상태] 초기 상태: NO_INVITATION (매치 데이터 또는 사용자 ID 없음)",
          { matchData, myId }
        );
        setNotificationType("NO_INVITATION");
        return;
      }

      try {
        console.log("[초대장 상태] 초대장 상태 조회 시작", {
          matchId: matchData.id,
        });
        const response = await axios.get(
          `https://www.mannamdeliveries.link/api/invitation/${matchData.id}`,
          { withCredentials: true }
        );
        const invitation = response.data;
        console.log("[초대장 상태] 초대장 데이터:", invitation);

        if (invitation.status === "PENDING") {
          console.log("[초대장 상태] 초대장 대기 중: PENDING");
          setNotificationType("PENDING");
        } else if (invitation.status === "ACCEPTED") {
          console.log("[초대장 상태] 초대장 수락됨: ACCEPTED");
          try {
            console.log("[초대장 상태] 만남 일정 조회 시작");
            const meetingResponse = await axios.get(
              `https://www.mannamdeliveries.link/api/meetings/${matchData.id}`,
              { withCredentials: true }
            );
            console.log(
              "[초대장 상태] 만남 일정 데이터:",
              meetingResponse.data
            );
            setMeetingDate(new Date(meetingResponse.data.date));
            setMeetingId(meetingResponse.data.id);
            console.log("[초대장 상태] 만남 일정 잡힘: SCHEDULED");
            setNotificationType("SCHEDULED");
          } catch (error) {
            console.error("[초대장 상태] 만남 일정 조회 실패:", error);
            if (axios.isAxiosError(error) && error.response?.status === 404) {
              console.log("[초대장 상태] 만남 일정 없음: NEED_SCHEDULE");
              setNotificationType("NEED_SCHEDULE");
            } else {
              console.error("[초대장 상태] 만남 일정 조회 중 오류 발생");
              setNotificationType("NEED_SCHEDULE");
            }
          }
        }
      } catch (error) {
        console.error("[초대장 상태] 초대장 상태 조회 실패:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            console.log("[초대장 상태] 초대장 없음: NO_INVITATION");
            setNotificationType("NO_INVITATION");
          } else {
            console.error("[초대장 상태] 서버 오류:", error.response?.status);
            setNotificationType("NO_INVITATION");
          }
        } else {
          console.error("[초대장 상태] 네트워크 오류");
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
      await axios.post(
        `https://www.mannamdeliveries.link/api/invitation/${matchData?.id}`,
        {},
        {
          withCredentials: true,
        }
      );
      setNotificationType("PENDING");
    } catch (error) {
      console.error("[초대장 상태] 초대장 전송 실패:", error);
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        console.error("[초대장 상태] 인증이 필요합니다.");
      }
    }
  };

  const handleAcceptInvitation = async () => {
    try {
      await axios.put(
        `https://www.mannamdeliveries.link/api/invitation/${matchData?.id}/accept`,
        {},
        {
          withCredentials: true,
        }
      );
      setNotificationType("NEED_SCHEDULE");
    } catch (error) {
      console.error("[초대장 상태] 초대장 수락 실패:", error);
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        console.error("[초대장 상태] 인증이 필요합니다.");
      }
    }
  };

  const handleRejectInvitation = async () => {
    try {
      await axios.put(
        `https://www.mannamdeliveries.link/api/invitation/${matchData?.id}/reject`,
        {},
        {
          withCredentials: true,
        }
      );
      setNotificationType("NO_INVITATION");
    } catch (error) {
      console.error("[초대장 상태] 초대장 거절 실패:", error);
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        console.error("[초대장 상태] 인증이 필요합니다.");
      }
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
      deactivationTime={roomInfo?.deactivationTime}
      onSendInvitation={handleSendInvitation}
      onAcceptInvitation={handleAcceptInvitation}
      onRejectInvitation={handleRejectInvitation}
      onScheduleMeeting={handleScheduleMeeting}
      onModifySchedule={handleModifySchedule}
      matchId={matchData?.id}
      myId={myId}
      roomId={roomInfo?.id}
    />
  );
};

export default ChatNotificationHandler;
