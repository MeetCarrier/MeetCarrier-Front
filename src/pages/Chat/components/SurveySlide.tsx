import React from "react";
import { Question, Answer, MatchData } from "../../../types/survey";
// import { SurveyState } from "../../../Utils/surveySlice"; // 이 임포트는 더 이상 사용되지 않습니다.

import lockIcon from "../../../assets/img/icons/Survey/lock.svg";

// 세션별 설문 데이터의 인터페이스를 정의합니다.
interface SessionSurveyData {
  isSubmitted: boolean;
  isOtherSubmitted: boolean;
  hasJoinedChat: boolean;
  answers: { [questionId: number]: string };
}

interface SurveySlideProps {
  question: Question;
  index: number;
  questionsLength: number;
  allAnswers: Answer[];
  myId: number | null;
  myNickname: string;
  otherNickname: string;
  isEditing: boolean;
  surveyState: SessionSurveyData; // 여기에서 정의한 SessionSurveyData 타입을 사용합니다.
  editedContent: string;
  setEditedContent: (content: string) => void;
  setIsEditing: (isEditing: boolean) => void;
  matchData: MatchData | null;
  onProfileClick: (opponentId: number) => void;
}

const SurveySlide: React.FC<SurveySlideProps> = ({
  question,
  index,
  questionsLength,
  allAnswers,
  myId,
  myNickname,
  otherNickname,
  isEditing,
  surveyState,
  editedContent,
  setEditedContent,
  setIsEditing,
  matchData,
  onProfileClick,
}) => {
  const myAnswer = allAnswers.find((a) => Number(a.userId) === myId);
  const otherAnswer = allAnswers.find((a) => Number(a.userId) !== myId);

  const showOther = !isEditing;
  const currentAnswer =
    surveyState?.answers[question.questionId] || myAnswer?.content || "";

  const getLabeledQuestionTitle = (idx: number, total: number) => {
    const labels = ["첫", "두", "세", "네"];
    return idx === total - 1 ? "마지막-질문" : `${labels[idx]}번째-질문`;
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <p className="mt-6 text-md font-GanwonEduAll_Bold mb-1 text-[#333]">
        {question.content}
      </p>

      <div className="flex justify-between items-end mb-4">
        <div className="flex items-center text-sm text-[#333] font-GanwonEduAll_Bold">
          {getLabeledQuestionTitle(index, questionsLength)
            .split("")
            .map((char, i) =>
              char === "-" ? (
                <span key={i} className="mx-[2px]">
                  {char}
                </span>
              ) : (
                <span
                  key={i}
                  className="border border-[#BD4B2C] px-2 py-[4px] mx-[1px] tracking-wide"
                >
                  {char}
                </span>
              )
            )}
        </div>
        <p className="text-xs text-gray-400">
          {matchData?.matchedAt
            ? new Date(matchData.matchedAt).toLocaleDateString("ko-KR")
            : ""}
        </p>
      </div>

      {/* 내 답변 */}
      <div
        className={`bg-white rounded min-h-[100px] p-4 shadow-sm border border-gray-200 mb-3 ${
          !surveyState?.isSubmitted && matchData?.status === "Surveying"
            ? "cursor-pointer"
            : ""
        }`}
        onClick={() => {
          if (
            !isEditing &&
            !surveyState?.isSubmitted &&
            matchData?.status === "Surveying"
          ) {
            setIsEditing(true);
            setEditedContent(currentAnswer);
          }
        }}
      >
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm font-semibold text-gray-800">{myNickname}</p>
        </div>

        {isEditing ? (
          <div className="relative">
            <textarea
              maxLength={150}
              rows={5}
              className="w-full h-[120px] border rounded p-2 text-sm resize-none"
              value={editedContent}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 150) {
                  setEditedContent(value);
                }
              }}
            />
            <div className="absolute bottom-1 right-2 text-xs text-gray-400">
              {editedContent.length}/150
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-600 line-clamp-5 break-words">
            {currentAnswer ? (
              currentAnswer
            ) : (
              <>
                이곳을 눌러 떠오르는 생각을 남겨보세요.
                <br />
                친구는 답변을 통해 당신을 알아가게 될 거예요.
              </>
            )}
          </p>
        )}
      </div>

      {/* 상대방 답변 (수정 중이면 숨김) */}
      {showOther && (
        <div className="bg-white rounded min-h-[100px] p-4 shadow-sm border border-gray-200 mb-3">
          <div className="flex justify-between items-center mb-1 w-full">
            <p
              className="text-sm font-semibold text-gray-800 cursor-pointer"
              onClick={() => {
                const opponentId =
                  myId === matchData?.user1Id
                    ? matchData?.user2Id
                    : matchData?.user1Id;
                if (opponentId) {
                  onProfileClick(opponentId);
                }
              }}
            >
              {otherNickname}
            </p>
          </div>
          {surveyState?.isSubmitted ? (
            <p className="text-xs text-gray-600 w-full">
              {otherAnswer?.content ?? "아직 작성하지 않았어요."}
            </p>
          ) : otherAnswer?.content ? (
            <div className="flex flex-col items-center justify-center text-center py-4">
              <img src={lockIcon} alt="lock" className="w-7 h-7 mb-1" />
              <p className="text-sm font-GanwonEduAll_Bold text-[#333] mb-1">
                상대방의 답변을 보고 싶다면? <br /> 나도 답변을 작성해야 해요!
              </p>
              <p className="text-xs text-gray-500"></p>
            </div>
          ) : (
            <p className="text-xs text-gray-600 w-full">
              아직 작성하지 않았어요.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SurveySlide;
