export interface ChatMessage {
  type: string;
  message: string;
  imageUrl: string | null;
  sender: number;
  sentAt: string;
  read: boolean;
  visible: boolean;
  chatbot: boolean;
}

export interface LocationState {
  roomId: number;
  showInviteModal?: boolean;
}

export interface MatchData {
  id: number;
  user1Id: number;
  user1Nickname: string;
  user1ImageUrl?: string;
  user2Id: number;
  user2Nickname: string;
  user2ImageUrl?: string;
  agreed: boolean;
  matchedAt?: string;
  status: string;
  sessionId: number;
  roomId: number;
}

export interface RoomInfo {
  status: "Activate" | "Deactivate";
  deactivationTime: string;
}
