import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import modalbtn_icon from '../assets/img/icons/ModalBtn/modalbtn_icon.svg';

interface MatchingFail2ModalProps {
  onClose: () => void;
}

const MatchingFail2Modal: FC<MatchingFail2ModalProps> = ({ onClose }) => {
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
        주변에 친구가 아무도 없어 찾지 못했어요...
        <br />
        우리 다음에 한번 더 도전해봐요!
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
            확인
          </span>
        </button>
      </div>
    </>
  );
};

export default MatchingFail2Modal;
