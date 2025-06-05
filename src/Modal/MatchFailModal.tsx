import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import modalbtn_icon from '../assets/img/icons/ModalBtn/modalbtn_icon.svg';

interface MatchingFailModalProps {
  onClose: () => void;
}

const MatchingFailModal: FC<MatchingFailModalProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handlebtnClick = () => {
    onClose();
    navigate('/main');
  };

  return (
    <>
      <h2 className="mb-3 text-[20px] font-GanwonEduAll_Bold">
        친구 매칭 실패...
      </h2>
      <p className="text-xs font-GanwonEduAll_Light mb-3 text-[#333333]/80">
        적합한 친구를 찾지 못했어요...
        <br />그 대신 최대한 어울리는 2명을 추천해요!
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
            추천 친구
          </span>
        </button>
      </div>
    </>
  );
};

export default MatchingFailModal;
