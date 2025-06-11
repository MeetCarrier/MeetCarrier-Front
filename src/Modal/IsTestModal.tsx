import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import modalbtn_icon from '../assets/img/icons/ModalBtn/modalbtn_icon.svg';

const IsTestModal: FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <h2 className="mb-3 text-[20px] font-GanwonEduAll_Bold">
        자기평가 테스트
      </h2>
      <p className="text-xs font-GanwonEduAll_Light mb-3 text-[#333333]/80">
        현재 어떤 상태이고 무슨 감정을 가지고 있는 지 궁금해요!
        <br />
        결과는 적절한 친구를 찾는 데 사용되며 최소 1번은 시행해야 해요.
      </p>
      <div className="flex items-center justify-end">
        <button
          className="relative cursor-pointer"
          onClick={() => navigate('/SelfEvaluation')}
        >
          <img src={modalbtn_icon} alt="modalbtn" />
          <span className="absolute inset-0 flex items-center justify-center font-GanwonEduAll_Light text-[#FAFAFA]">
            테스트 하기
          </span>
        </button>
      </div>
    </>
  );
};

export default IsTestModal;
