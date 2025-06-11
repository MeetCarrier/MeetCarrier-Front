import { useAppDispatch, useAppSelector } from '../../Utils/hooks';
import { saveAnswer } from '../../Utils/testSlice';
import yes_icon from '../../assets/img/icons/Test/yes_icon.svg';
import normal_icon from '../../assets/img/icons/Test/normal_icon.svg';
import no_icon from '../../assets/img/icons/Test/no_icon.svg';

interface Question {
  id: number;
  text: string;
}

const questions: Question[] = [
  { id: 1, text: '요즘 들어 매사에 의욕이 없다.' },
  { id: 2, text: '평소 즐기던 일에도 흥미가 없다.' },
  { id: 3, text: '나는 자주 피곤하고 기운이 없다.' },
  { id: 4, text: '나는 최근 이유 없이 슬픈 감정이 든다.' },
  { id: 5, text: '나는 스스로 가치 없는 사람이라고 느낀다.' },
];

const Depression = () => {
  const options = ['그렇다', '', '', '', '그렇지 않다'];
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.test.answers.depression);

  const handleSelect = (questionId: number, scoreIndex: number) => {
    dispatch(
      saveAnswer({
        category: 'depression',
        questionId,
        score: 5 - scoreIndex,
      })
    );
  };

  const circleStyle = (idx: number) => {
    switch (idx) {
      case 0:
        return 'w-8 h-8 border-[#BD4B2C]';
      case 1:
        return 'w-6 h-6 border-[#BD4B2C]';
      case 2:
        return 'w-4 h-4 border-[#333333]/50';
      case 3:
        return 'w-6 h-6 border-[#C0A386]';
      case 4:
        return 'w-8 h-8 border-[#C0A386]';
    }
  };

  const imgStyle = (idx: number) => {
    switch (idx) {
      case 0:
        return <img src={yes_icon} alt="yes_icon" className="w-8 h-8" />;
      case 1:
        return <img src={yes_icon} alt="yes_icon" className="w-6 h-6" />;
      case 2:
        return <img src={normal_icon} alt="normal_icon" className="w-7 h-7" />;
      case 3:
        return <img src={no_icon} alt="no_icon" className="w-6 h-6" />;
      case 4:
        return <img src={no_icon} alt="no_icon" className="w-8 h-8" />;
    }
  };

  const textStyle = (idx: number) => {
    switch (idx) {
      case 0:
        return 'text-[#BD4B2C]';
      case 4:
        return 'text-[#C0A386]';
      default:
        return 'invisible';
    }
  };

  return (
    <div className="flex flex-col">
      {questions.map((q) => (
        <div key={q.id} className="bg-[#F2F2F2] p-4">
          <p className="mb-4 text-center font-GanwonEduAll_Bold text-sm">
            {q.text}
          </p>
          <div className="flex justify-between items-center">
            {options.map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center w-[20%]"
                onClick={() => handleSelect(q.id, idx)}
              >
                {5 - selected[q.id] === idx ? (
                  imgStyle(idx)
                ) : (
                  <div
                    className={`rounded-full border-2 ${circleStyle(idx)}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between items-end">
            {options.map((option, idx) => (
              <div key={idx} className="flex flex-col items-center w-[20%]">
                <span
                  className={`mt-1 text-[12px] font-GanwonEduAll_Bold ${textStyle(
                    idx
                  )}`}
                >
                  {option}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <div className=" w-[95%] my-[1%] border-[1px] border-[#333333]/50"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Depression;
