import { useState } from "react";
import Modal from "./Modal";
import checkBoxIcon from "../assets/img/icons/Report/check_box.svg";
import uncheckBoxIcon from "../assets/img/icons/Report/uncheck_box.svg";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reasons: string[], content: string) => void;
  reportType: ReportType;
}

type ReportType = "User" | "Bug" | "Chatbot" | "Question";

const REPORT_REASONS = [
  "부적절한 프로필 사진, 닉네임 사용",
  "욕설, 비방, 혐오 표현",
  "종교, 포교 시도",
  "과도한 개인정보 요구",
  "약속 미이행",
  "연애 목적으로 원하지 않는 대화 시도",
  "그 외 다른 것",
];

const ReportModal = ({
  isOpen,
  onClose,
  onSubmit,
  reportType,
}: ReportModalProps) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [description, setDescription] = useState("");

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmit = async () => {
    const reportContent = selectedReasons.join("/"); // 간단 사유 요약
    const reportDescription = description;

    try {
      const res = await fetch(
        "https://www.mannamdeliveries.link/api/reports/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reportType, // 상위 컴포넌트에서 전달받은 값
            reportContent,
            reportDescription,
            reportImages: [], // 현재 이미지 업로드 기능 없으니 빈 배열로 전송
          }),
        }
      );

      if (!res.ok) throw new Error(`신고 실패: ${res.status}`);
      alert("신고가 접수되었습니다.");
      onSubmit(selectedReasons, description);
      onClose();
    } catch (error) {
      console.error("신고 중 오류 발생:", error);
      alert("신고 처리에 실패했습니다.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">신고 사유를 알려주세요</h2>
        <p className="text-sm text-gray-500">
          허위 신고일 경우 신고자가 제재받을 수 있어요.
        </p>

        <div className="space-y-2 max-h-[160px] overflow-y-auto">
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
          className="w-full border rounded p-2 text-sm resize-none font-GanwonEduAll_Light"
          rows={3}
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
            className="bg-[#D1582C] text-white text-sm px-4 py-1.5 rounded"
          >
            신고
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReportModal;
