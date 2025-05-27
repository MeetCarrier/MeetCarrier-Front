import React from "react";
import arrowIcon from "../../assets/img/icons/HobbyIcon/back_arrow.svg";

const tests = [
  { title: "자가평가 테스트", onClick: () => {} },
  { title: "대인관계 테스트", onClick: () => {} },
  { title: "우울증 테스트", onClick: () => {} },
];

function PsychTestList() {
  return (
    <div className="w-full bg-white rounded-xl px-5 py-4 shadow-sm">
      <h2 className="text-[15px] font-semibold text-[#333] mb-3">
        심리 테스트
      </h2>

      <div className="flex flex-col divide-y divide-[#f0f0f0]">
        {tests.map((test, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-2 cursor-pointer"
            onClick={test.onClick}
          >
            <span className="text-sm text-[#666666]">{test.title}</span>
            <img
              src={arrowIcon}
              alt="arrow"
              className="w-[12px] h-[12px] transform scale-x-[-1]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PsychTestList;
