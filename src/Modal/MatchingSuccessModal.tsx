import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import modalbtn_icon from '../assets/img/icons/ModalBtn/modalbtn_icon.svg';

interface MatchingSuccessModalProps {
  onClose: () => void;
}

const MatchingSuccessModal: FC<MatchingSuccessModalProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handlebtnClick = () => {
    onClose();
    navigate('/main');
  };

  return (
    <>
      <h2 className="mb-3 text-[20px] font-GanwonEduAll_Bold">
        친구 매칭 성공!
      </h2>
      <p className="text-xs font-GanwonEduAll_Light mb-3 text-[#333333]/80">
        맞춤 친구 매칭이 성공적으로 완료되었어요!
        <br />
        친구와 질문지 작성하러 바로 가볼까요?
      </p>
      <div className="flex items-center justify-end">
        <button
          className="mr-3 font-GanwonEduAll_Light cursor-pointer"
          onClick={onClose}
        >
          취소
        </button>
        <button className="relative cursor-pointer" onClick={handlebtnClick}>
          <img src={modalbtn_icon} alt="modalbtn" />
          <span className="absolute inset-0 flex items-center justify-center font-GanwonEduAll_Light text-[#FAFAFA]">
            질문지 작성
          </span>
        </button>
      </div>
    </>
  );
};

export default MatchingSuccessModal;
