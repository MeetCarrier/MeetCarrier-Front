import NavBar from '../../components/NavBar';
import Modal from '../../components/Modal';
import TestModal from '../../Modal/TestModal';
import SelfEfficacy from './SelfEfficacy';
import InterpersonalSkill from './InterpersonalSkill';
import Depression from './Depression';
import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../../Utils/hooks';
import back_arrow from '../../assets/img/icons/HobbyIcon/back_arrow.svg';
import btn1 from '../../assets/img/button/btn1.webp';
import btn3 from '../../assets/img/button/btn3.webp';
import btn4 from '../../assets/img/button/btn4.webp';
import toast from 'react-hot-toast';

function Test() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isModalOpen = searchParams.get('modal') === 'true';
  const scrollDivRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const steps = [<SelfEfficacy />, <InterpersonalSkill />, <Depression />];
  const answers = useAppSelector((state) => state.test.answers);

  const answeredCount =
    Object.keys(answers.selfEfficacy).length +
    Object.keys(answers.interpersonalSkill).length +
    Object.keys(answers.depression).length;

  const totalCount = 15;
  const progressPercent = Math.floor((answeredCount / totalCount) * 100);

  const handleBackClick = () => {
    navigate('/SelfEvaluation');
  };

  const handleCompleteClick = () => {
    if (answeredCount === 15) {
      navigate('/Test?modal=true');
    } else {
      toast('모두 작성해주세요.');
    }
  };

  const btnStyle = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className="flex justify-center w-full mb-3 pl-4 pr-4">
            <button
              className="relative w-full max-w-md"
              onClick={() => {
                setStep((prev) => prev + 1);
                scrollDivRef.current?.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                });
              }}
            >
              <img src={btn1} alt="버튼1" className="w-full" />
              <span className="absolute inset-0 flex items-center justify-center font-GanwonEduAll_Bold cursor-pointer">
                다음
              </span>
            </button>
          </div>
        );
      case 1:
        return (
          <div className="flex justify-between w-full mb-3 pl-4 pr-4">
            <button
              className="relative mr-1"
              onClick={() => setStep((prev) => prev - 1)}
            >
              <img src={btn4} alt="버튼2" className="w-full" />
              <span className="absolute inset-0 flex items-center justify-center font-GanwonEduAll_Bold cursor-pointer">
                이전
              </span>
            </button>
            <button
              className="relative ml-1"
              onClick={() => {
                setStep((prev) => prev + 1);
                scrollDivRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <img src={btn3} alt="버튼1" className="w-full" />
              <span className="absolute inset-0 flex items-center justify-center font-GanwonEduAll_Bold cursor-pointer">
                다음
              </span>
            </button>
          </div>
        );
      case 2:
        return (
          <div className="flex justify-between w-full mb-3 pl-4 pr-4">
            <button
              className="relative mr-3"
              onClick={() => setStep((prev) => prev - 1)}
            >
              <img src={btn4} alt="버튼2" className="w-full" />
              <span className="absolute inset-0 flex items-center justify-center font-GanwonEduAll_Bold cursor-pointer">
                이전
              </span>
            </button>
            <button className="relative ml-3" onClick={handleCompleteClick}>
              <img src={btn3} alt="버튼1" className="w-full" />
              <span className="absolute inset-0 flex items-center justify-center font-GanwonEduAll_Bold cursor-pointer">
                완료
              </span>
            </button>
          </div>
        );
    }
  };

  return (
    <>
      <NavBar />
      <div className="absolute top-[50px] text-[#333333] left-0 right-0 px-6 text-center">
        <img
          src={back_arrow}
          alt="back_arrow"
          className="absolute top-1/2 -translate-y-1/2 left-6 w-[9px] h-[20px] cursor-pointer"
          onClick={handleBackClick}
        />
        <p className="text-[20px] font-MuseumClassic_L italic">관심사</p>
      </div>

      <div
        ref={scrollDivRef}
        className="flex flex-col w-full h-[calc(100%-200px)] overflow-y-auto z-0 bg-[#F2F2F2]"
      >
        {steps[step]}
        {btnStyle(step)}
      </div>

      <div className="w-full px-4 mb-2">
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs font-GanwonEduAll_Light text-gray-500">
            {answeredCount} / {totalCount}
          </span>
          <div className="flex-1 h-2 rounded-full bg-[#D9D9D9] overflow-hidden">
            <div
              className="h-full bg-[#BD4B2C] rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => navigate('/Test')}>
        <TestModal />
      </Modal>
    </>
  );
}

export default Test;
