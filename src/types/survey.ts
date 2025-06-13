export interface Question {
  questionId: number;
  content: string;
}

export interface Answer {
  content: string;
  questionId: number;
  userId: number;
}

export interface MatchData {
  user1Id: number;
  user1Nickname: string;
  user2Id: number;
  user2Nickname: string;
  agreed: boolean;
  matchedAt?: string;
  status: string;
  id: number;
  sessionId: number;
}
