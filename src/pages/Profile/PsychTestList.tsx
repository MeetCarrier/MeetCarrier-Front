import { useNavigate } from 'react-router-dom';
import arrowIcon from '../../assets/img/icons/HobbyIcon/back_arrow.svg';

function PsychTestList() {
  const navigate = useNavigate();

  const tests = [
    { title: '테스트', onClick: () => navigate('/SelfEvaluation') },
    { title: '결과 이력', onClick: () => alert('결과 이력으로 이동 예정') },
  ];

  return (
    <div className="w-full bg-white rounded-xl px-5 py-4 shadow-sm">
      <h2 className="text-[15px] font-GanwonEduAll_Bold text-[#333] mb-3">
        자기 평가 테스트
      </h2>

      <div className="flex flex-col">
        {tests.map((test, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-2 cursor-pointer"
            onClick={test.onClick}
          >
            <span className="text-sm text-[#666666] font-GanwonEduAll_Light">
              {test.title}
            </span>
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
