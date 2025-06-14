import { ResponsiveRadar } from "@nivo/radar";
import selfefficacy_icon from "../../assets/img/icons/Test/selfefficacy_icon.svg";
import interpersonalskill_icon from "../../assets/img/icons/Test/interpersonalskill_icon.svg";
import depression_icon from "../../assets/img/icons/Test/depression_icon.svg";

interface PsychTestResultDetailProps {
  testResult: {
    depressionScore: number;
    efficacyScore: number;
    relationshipScore: number;
  };
}

function PsychTestDetail({ testResult }: PsychTestResultDetailProps) {
  const { depressionScore, efficacyScore, relationshipScore } = testResult;

  const getSelfEfficacyText = (score: number) => {
    if (score <= 10) {
      return "10점 이하는 가장 낮은 수치로, 현재 자신의 수행 능력에 관한 믿음이 많이 낮은 상태에요. 해당 점수에 있는 사람은 도전보다 회피를 선택할 가능성이 커요.";
    } else if (score <= 15) {
      return "11~15점 사이는 보통 이하의 수치로, 현재 자신의 수행 능력에 관한 믿음이 낮은 상태에요. 해당 점수의 사람은 자기 신뢰에 흔들림이 있을 확률이 커요.";
    } else if (score <= 20) {
      return "16~20점 사이는 보통 이상의 수치로, 현재 자신의 수행 능력에 관한 믿음이 적당한 상태에요. 해당 점수의 사람은 대부분의 상황에서 자신감을 가지는 편이에요.";
    } else {
      return "21~25점 사이는 매우 높은 수치로, 현재 자신의 수행 능력에 관한 믿음이 가득찬 상태에요. 해당 점수의 사람은 어떤 상황에 닥치더라도 자신감 있고 도전적인 경향을 가지고 있어요.";
    }
  };

  const getInterpersonalSkillText = (score: number) => {
    if (score <= 10) {
      return "5~10점 사이는 가장 낮은 수치로, 현재 긍정적인 인간관계 형성에 극심한 어려움을 겪고 있는 상태에요. 해당 점수의 사람은 관계 형성이나 유지에 어려움을 느끼는 경우가 빈번해요.";
    } else if (score <= 15) {
      return "11~15점 사이는 개선이 필요한 수치로, 현재 긍정적인 인간관계 형성에 불편함을 겪고 있는 상태에요. 해당 점수의 사람은 소통 시, 표현이 서툴거나 어려워 하는 경향이 있어요.";
    } else if (score <= 20) {
      return "16~20점 사이는 양호한 수치로, 현재 긍정적인 인간관계를 적당히 형성하고 있는 상태에요. 해당 점수의 사람은 일상에서 무리 없이 소통이 가능한 편이에요.";
    } else {
      return "21~25점 사이는 매우 높은 수치로, 현재 긍정적인 인간관계를 매우 잘 형성하고 있는 상태에요. 해당 점수의 사람은 대화할 때 친화적이고 뛰어난 소통이 두드러져요.";
    }
  };

  const getDepressionText = (score: number) => {
    if (score <= 10) {
      return "5~10점 사이는 가장 낮은 수치로, 현재 큰 우울감 없이 건강한 정서 상태를 지니고 있는 상태입니다. 스트레스 관리를 매우 잘하고 있으며 해당 상태를 유지하는 것이 중요해요.";
    } else if (score <= 15) {
      return "11~15점 사이는 경미한 불안정 수치로, 기분이 나빠지는 일이 잦으며 슬픔이나 비관적인 생각이 가끔 들기도 합니다. 일상 속에서 받는 스트레스를 신경 쓸 필요가 있어요.";
    } else if (score <= 20) {
      return "16~20점 사이는 조금 위험한 수치로, 현재 상태가 2주 이상 지속될 경우 일상 생활에 어려움을 겪을 수도 있어요. 정서적 회복 상태를 다시 되돌아보며 휴식을 가질 필요가 있어요.";
    } else {
      return "21~25점 사이는 가장 위험한 수치로, 현재 전문가 상담이 권장되는 수준의 극심한 우울감을 가지고 있는 상태에요. 해당 점수의 사람은 일상 생활이 힘들 정도로 견디기 어려운 상황이에요.";
    }
  };

  const data = [
    {
      category: "자기효능감",
      점수: efficacyScore,
      최대값: 25,
    },
    {
      category: "우울·정서상태",
      점수: depressionScore,
      최대값: 25,
    },
    {
      category: "대인관계 능력",
      점수: relationshipScore,
      최대값: 25,
    },
  ];

  const keys = ["점수"];

  return (
    <div className="flex flex-col w-full h-auto">
      <div className="relative w-[250px] h-[280px] mx-auto shrink-0 pointer-events-none">
        <ResponsiveRadar
          data={data}
          keys={keys}
          indexBy="category"
          maxValue={25}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          curve="linearClosed"
          borderWidth={2}
          borderColor={() => "#BD4B2C"}
          gridLevels={5}
          gridShape="linear"
          gridLabelOffset={-999}
          enableDots={false}
          colors={() => "rgba(189, 75, 44, 0.3)"}
          fillOpacity={10}
          blendMode="multiply"
          animate={true}
          motionConfig="wobbly"
        />
        <div className="absolute font-GanwonEduAll_Light left-1/2 top-[2%] -translate-x-1/2 text-xs text-[#333]">
          자기효능감
        </div>
        <div className="absolute font-GanwonEduAll_Light left-[4%] bottom-[20%] text-xs text-[#333] text-center">
          대인관계능력
        </div>
        <div className="absolute font-GanwonEduAll_Light right-[4%] bottom-[20%] text-xs text-[#333] text-center">
          우울감·정서상태
        </div>
      </div>
      <div className="flex flex-col px-4">
        <div className="flex items-center gap-2">
          <img src={selfefficacy_icon} alt="질문" className="w-4.5 h-4.5" />
          <span className="font-GanwonEduAll_Bold text-[#333333] text-base">
            자기 효능감 {efficacyScore}/25점
          </span>
        </div>
        <p className="font-GanwonEduAll_Light text-sm mt-2 mb-4">
          {getSelfEfficacyText(efficacyScore)}
        </p>
        <div className="flex items-center gap-2">
          <img
            src={interpersonalskill_icon}
            alt="질문"
            className="w-4.5 h-4.5"
          />
          <span className="font-GanwonEduAll_Bold text-[#333333] text-base">
            대인관계 능력 {relationshipScore}/25점
          </span>
        </div>
        <p className="font-GanwonEduAll_Light text-sm mt-2 mb-4">
          {getInterpersonalSkillText(relationshipScore)}
        </p>
        <div className="flex items-center gap-2">
          <img src={depression_icon} alt="질문" className="w-4.5 h-4.5" />
          <span className="font-GanwonEduAll_Bold text-[#333333] text-base">
            우울감·정서상태 {depressionScore}/25점
          </span>
        </div>
        <p className="font-GanwonEduAll_Light text-sm mt-2 mb-4">
          {getDepressionText(depressionScore)}
        </p>
      </div>
    </div>
  );
}

export default PsychTestDetail;
