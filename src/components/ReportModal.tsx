import { useState } from "react";
import Modal from "./Modal";
import checkBoxIcon from "../assets/img/icons/Report/check_box.svg";
import uncheckBoxIcon from "../assets/img/icons/Report/uncheck_box.svg";
import axios from "axios";
import toast from "react-hot-toast";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reasons: string[], content: string) => void;
  reportType: "User" | "Question"; // Question 타입 추가
  targetUser?: number; // 선택적으로 변경
}

type ReportContent =
  | "INAPPROPRIATE_PROFILE"
  | "HARASSMENT"
  | "PROMOTION"
  | "PRIVACY_INVASION"
  | "ILLEGAL_REQUEST"
  | "FORCED_CONVERSATION"
  | "ETC";

// ✅ 한국어 → ENUM 변환 매핑
const REASON_MAP: Record<string, ReportContent> = {
  "부적절한 프로필 사진, 닉네임 사용": "INAPPROPRIATE_PROFILE",
  "욕설, 비방, 혐오 표현": "HARASSMENT",
  "종교, 포교 시도": "PROMOTION",
  "과도한 개인정보 요구": "PRIVACY_INVASION",
  "약속 미이행": "ILLEGAL_REQUEST",
  "연애 목적으로 원하지 않는 대화 시도": "FORCED_CONVERSATION",
  "그 외 다른 것": "ETC",
};

const REPORT_REASONS = Object.keys(REASON_MAP);

const ReportModal = ({
  isOpen,
  onClose,
  onSubmit,
  reportType,
  targetUser,
}: ReportModalProps) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [showReportContentModal, setShowReportContentModal] = useState(false);

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmit = async () => {
    const enumReasons: ReportContent[] = selectedReasons.map(
      (r) => REASON_MAP[r]
    );

    // 신고 내용 로깅
    console.log("[신고 내용]", {
      reportType,
      targetUser: targetUser || null,
      reportContent: enumReasons.join(","),
      reportDescription: description,
    });

    const reportData = {
      reportType,
      targetUser: targetUser || null,
      reportContent: enumReasons.join(","),
      reportDescription: description,
    };

    try {
      await axios.post(
        "https://www.mannamdeliveries.link/api/reports/register",
        reportData,
        { withCredentials: true }
      );
      toast.success("신고가 접수되었습니다.");
      onSubmit(selectedReasons, description);
      onClose();
    } catch (error) {
      console.error("신고 처리 실패:", error);
      toast.error("신고 처리에 실패했습니다.");
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">신고 사유를 알려주세요</h2>
          <p className="text-sm text-gray-500">
            허위 신고일 경우 신고자가 제재받을 수 있어요.
          </p>

          <div className="space-y-2 ">
            {REPORT_REASONS.map((reason) => (
              <label
                key={reason}
                className="flex items-center gap-2 text-sm cursor-pointer font-GanwonEduAll_Light select-none"
                onClick={() => toggleReason(reason)}
              >
                <img
                  src={
                    selectedReasons.includes(reason)
                      ? checkBoxIcon
                      : uncheckBoxIcon
                  }
                  alt={selectedReasons.includes(reason) ? "체크됨" : "미체크"}
                  className="w-5 h-5 mt-0.5"
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>

          <textarea
            placeholder="자세한 내용을 입력해주세요."
            className="w-full border rounded p-1 text-sm resize-none font-GanwonEduAll_Light"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2 font-GanwonEduAll_Light">
            <button
              onClick={onClose}
              className="text-sm text-gray-600 hover:text-black px-3 py-1"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              className={`text-sm px-4 py-1.5 rounded ${
                selectedReasons.length > 0
                  ? "bg-[#D1582C] text-white"
                  : "bg-[#F1C4B5] text-white"
              }`}
              disabled={selectedReasons.length === 0}
            >
              신고
            </button>
          </div>
        </div>
      </Modal>

      {/* 신고 내용 확인 모달 */}
      <Modal
        isOpen={showReportContentModal}
        onClose={() => {
          setShowReportContentModal(false);
          onSubmit(selectedReasons, description);
          onClose();
        }}
      >
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-GanwonEduAll_Bold mb-4">신고 내용</h3>
          <div className="w-full space-y-3 mb-6">
            <div className="text-sm">
              <p className="font-GanwonEduAll_Bold mb-2">신고 사유:</p>
              <ul className="list-disc pl-5 space-y-1">
                {selectedReasons.map((reason) => (
                  <li key={reason} className="text-gray-700">
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
            {description && (
              <div className="text-sm">
                <p className="font-GanwonEduAll_Bold mb-2">상세 내용:</p>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {description}
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-center w-full">
            <button
              className="px-6 py-2 bg-[#C67B5A] text-white text-sm rounded"
              onClick={() => {
                setShowReportContentModal(false);
                onSubmit(selectedReasons, description);
                onClose();
              }}
            >
              확인
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReportModal;
