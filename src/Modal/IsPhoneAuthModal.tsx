import { FC } from 'react';
import modalbtn_icon from '../assets/img/icons/ModalBtn/modalbtn_icon.svg';

interface IsPhoneAuthModalProps {
  onClose: () => void;
}

const IsPhoneAuthModal: FC<IsPhoneAuthModalProps> = ({ onClose }) => {
  return (
    <>
      <h2 className="mb-3 text-[20px] font-GanwonEduAll_Bold">본인확인 인증</h2>
      <p className="text-xs font-GanwonEduAll_Light mb-3 text-[#333333]/80">
        안전한 매칭을 위해 '친구 찾기' 전, 본인확인 인증을 진행해주세요.
      </p>
      <p></p>
      <div className="flex items-center justify-end">
        <button
          className="relative cursor-pointer"
          onClick={() => {
            onClose();
          }}
        >
          <img src={modalbtn_icon} alt="modalbtn" />
          <span className="absolute inset-0 flex items-center justify-center font-GanwonEduAll_Light text-[#FAFAFA]">
            인증하기
          </span>
        </button>
      </div>
    </>
  );
};

export default IsPhoneAuthModal;
