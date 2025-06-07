import { FC } from 'react';
import axios from 'axios';
import { useAppSelector } from '../Utils/hooks';
import { useNavigate } from 'react-router-dom';
import modalbtn_icon from '../assets/img/icons/ModalBtn/modalbtn_icon.svg';

const DiaryDeleteModal: FC = () => {
  const navigate = useNavigate();

  const journalId = useAppSelector((state) => state.diary.journalId);

  // console.log('등록할 내용', text, selectedStamp, isEditingToday);

  // 일기랑 스탬프 등록
  const handleDiaryRegister = async () => {
    try {
      await axios.delete(
        `https://www.mannamdeliveries.link/api/journals/${journalId}`,
        { withCredentials: true }
      );
      alert('삭제 완료!');
      navigate('/Calendar');
    } catch (error) {
      console.error('삭제 실패', error);
      alert('삭제에 실패했어요.');
    }
  };

  return (
    <>
      <h2 className="mb-3 text-[20px] font-GanwonEduAll_Bold">
        일기를 삭제하시겠어요?
      </h2>
      <p className="text-xs font-GanwonEduAll_Light mb-3 text-[#333333]/80">
        삭제하면 되돌릴 수 없어요. 일기는 당일에만 등록할 수 있기에 날짜가
        지났다면, 다시 작성할 수 없어요.
      </p>
      <p></p>
      <div className="flex items-center justify-end">
        <button
          className="mr-3 font-GanwonEduAll_Light cursor-pointer"
          onClick={() => navigate('/ViewDiary')}
        >
          취소
        </button>
        <button
          className="relative cursor-pointer"
          onClick={handleDiaryRegister}
        >
          <img src={modalbtn_icon} alt="modalbtn" />
          <span className="absolute inset-0 flex items-center justify-center font-GanwonEduAll_Light text-[#FAFAFA]">
            삭제하기
          </span>
        </button>
      </div>
    </>
  );
};

export default DiaryDeleteModal;
