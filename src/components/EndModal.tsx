import { useState } from "react";
import Modal from "./Modal";
import checkBoxIcon from "../assets/img/icons/Report/check_box.svg";
import uncheckBoxIcon from "../assets/img/icons/Report/uncheck_box.svg";

interface EndModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reasonCodes: string[], customReason: string) => void;
}

const END_REASONS = [
  {
    code: "VALUE_GAP",
    title: "가치관 충돌",
    description: "서로의 가치관이나 생각이 맞지 않음",
  },
  {
    code: "RUDENESS",
    title: "불성실한 태도",
    description: "말투나 태도가 불성실하거나 불편함",
  },
  {
    code: "NO_RESPONSE",
    title: "답변 없음",
    description: "상대방이 답변을 하지 않거나 응답이 늦음",
  },
  {
    code: "ILLOGICAL",
    title: "불합리한 답변",
    description: "논리적이지 않거나 이해할 수 없는 답변",
  },
  {
    code: "ETC",
    title: "기타",
    description: "위 사유에 해당하지 않는 경우",
  },
];

const EndModal = ({ isOpen, onClose, onSubmit }: EndModalProps) => {
  const [selectedReasonCodes, setSelectedReasonCodes] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState("");

  const toggleReason = (reasonCode: string) => {
    setSelectedReasonCodes((prev) =>
      prev.includes(reasonCode)
        ? prev.filter((r) => r !== reasonCode)
        : [...prev, reasonCode]
    );
  };

  const handleSubmit = () => {
    onSubmit(selectedReasonCodes, customReason);
    setSelectedReasonCodes([]);
    setCustomReason("");
    onClose();
  };

  return (
    <Modal  hideCloseButton={true} isOpen={isOpen} onClose={onClose}>
      <div className="space-y-3 ">
        <h2 className="text-lg font-semibold ">만남 종료 사유를 알려주세요</h2>
        <p className="text-sm text-gray-500">
          종료 시, 현재 대화 중인 친구와 더이상 이어 나갈 수 없으며 다시는 만날
          수 없어요.
        </p>

        <div className="space-y-1 pt-2">
          {END_REASONS.map((reason) => (
            <label
              key={reason.code}
              className="flex flex-col gap-1 text-sm cursor-pointer select-none"
              onClick={() => toggleReason(reason.code)}
            >
              <div className="flex items-center gap-2">
                <img
                  src={
                    selectedReasonCodes.includes(reason.code)
                      ? checkBoxIcon
                      : uncheckBoxIcon
                  }
                  alt={
                    selectedReasonCodes.includes(reason.code)
                      ? "체크됨"
                      : "미체크"
                  }
                  className="w-5 h-5 mt-0.5 flex-shrink-0"
                />
                <span className="font-semibold text-[#333]">
                  {reason.title}
                </span>
              </div>
              {reason.description && (
                <p className="text-xs text-gray-500 ml-7">
                  {reason.description}
                </p>
              )}
            </label>
          ))}
        </div>

        <textarea
          placeholder="서로에게 도움이 될 수 있도록 상기보다 이해가 남을 수 있는 솔직한 이유를 적어주세요."
          className="w-full border border-gray-200 rounded p-2 text-sm resize-none font-GanwonEduAll_Light bg-gray-100"
          rows={5}
          value={customReason}
          onChange={(e) => setCustomReason(e.target.value)}
        />

        <div className="text-sm flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className=" text-gray-600 hover:text-black px-3 py-1"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className={` px-4 py-1.5 rounded ${
              selectedReasonCodes.length > 0
                ? "bg-[#D1582C] text-white"
                : "bg-[#F1C4B5] text-white"
            }`}
            disabled={selectedReasonCodes.length === 0}
          >
            만남 종료
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EndModal;
