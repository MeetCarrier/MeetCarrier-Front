import React from "react";
import stamp from "../../../assets/img/stamp.svg"; // 발자국 스탬프
import activeFoot from "../../../assets/img/survey/footprint_red.svg";
import inactiveFoot from "../../../assets/img/survey/footprint_gray.svg";

interface FootPrintCheckProps {
  currentStep: number; // 1부터 시작
}

const FootPrintCheck: React.FC<FootPrintCheckProps> = ({ currentStep }) => {
  const totalSteps = 5;

  return (
    <div className="flex justify-center items-end mt-4">
      {Array.from({ length: totalSteps }, (_, idx) => {
        const step = idx + 1;
        const isActive = step <= currentStep;
        const isEven = step % 2 === 0;

        return (
          <img
            key={step}
            src={isActive ? activeFoot : inactiveFoot}
            alt={`foot-${step}`}
            className={`w-6 h-6 mx-4 ${
              isEven ? "scale-y-[-1] translate-y-1.5" : ""
            }`}
          />
        );
      })}
    </div>
  );
};

export default FootPrintCheck;
