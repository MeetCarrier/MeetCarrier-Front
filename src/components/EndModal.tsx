import { useState } from "react";
import Modal from "./Modal";
import checkBoxIcon from "../assets/img/icons/Report/check_box.svg";
import uncheckBoxIcon from "../assets/img/icons/Report/uncheck_box.svg";

interface EndModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reasons: string[], content: string) => void;
}

const END_REASONS = [
  {
    title: "대화 불평",
    description: "말투, 화법, 표현 방식 등이 나와 잘 맞지 않음",
  },
  {
    title: "공감 부족",
    description: "감정이나 관심사가 잘 통하지 않는다고 느낌",
  },
  {
    title: "불편한 말투",
    description: "공격적이거나 자랑, 편견, 무시 같은 뉘앙스의 답변",
  },
  {
    title: "성의 없는 답변",
    description: "단답, 무반응 등 대화에 적극적이지 않은 태도",
  },
  {
    title: "그 외 다른 것",
    description: "",
  },
];

const EndModal = ({
  isOpen,
  onClose,
  onSubmit,
}: EndModalProps) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [description, setDescription] = useState("");

  const toggleReason = (reasonTitle: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reasonTitle)
        ? prev.filter((r) => r !== reasonTitle)
        : [...prev, reasonTitle]
    );
  };

  const handleSubmit = () => {
    onSubmit(selectedReasons, description);
    setSelectedReasons([]);
    setDescription("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">만남 종료 사유를 알려주세요</h2>
        <p className="text-sm text-gray-500">
          종료 시, 현재 대화 중인 친구와 더이상 이어 나갈 수 없으며
          다시는 만날 수 없어요.
        </p>

        <div className="space-y-4 pt-2">
          {END_REASONS.map((reason) => (
            <label
              key={reason.title}
              className="flex flex-col gap-1 text-sm cursor-pointer select-none"
              onClick={() => toggleReason(reason.title)}
            >
              <div className="flex items-center gap-2">
                <img
                  src={
                    selectedReasons.includes(reason.title)
                      ? checkBoxIcon
                      : uncheckBoxIcon
                  }
                  alt={selectedReasons.includes(reason.title) ? "체크됨" : "미체크"}
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
          className="w-full border rounded p-2 text-sm resize-none font-GanwonEduAll_Light bg-gray-100"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-black px-3 py-1"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className={`text-sm px-4 py-1.5 rounded ${selectedReasons.length > 0 ? 'bg-[#D1582C] text-white' : 'bg-[#F1C4B5] text-[#714E45]'}`}
            disabled={selectedReasons.length === 0}
          >
            만남 종료
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EndModal; 