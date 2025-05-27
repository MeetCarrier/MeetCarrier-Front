import { FC } from 'react';
import axios from 'axios';
import { useAppSelector } from '../Utils/hooks';
import { useNavigate } from 'react-router-dom';

const StampModal: FC = () => {
  const navigate = useNavigate();

  const journalId = useAppSelector((state) => state.diary.journalId);
  const text = useAppSelector((state) => state.diary.text);
  const selectedStamp = useAppSelector((state) => state.diary.selectedStamp);
  const isEditingToday = useAppSelector((state) => state.diary.isEditingToday);

  // console.log('등록할 내용', text, selectedStamp, isEditingToday);

  // 일기랑 스탬프 등록
  const handleDiaryRegister = async () => {
    try {
      if (isEditingToday) {
        await axios.patch(
          `https://www.mannamdeliveries.link/journals/${journalId}`,
          {
            content: text,
            stamp: selectedStamp,
          },
          { withCredentials: true }
        );
      } else {
        await axios.post(
          'https://www.mannamdeliveries.link/journals/register',
          {
            content: text,
            stamp: selectedStamp,
          },
          { withCredentials: true }
        );
      }

      alert('저장 완료!');
      navigate('/Calendar');
    } catch (error) {
      console.error('저장 실패', error);
      alert('저장에 실패했어요.');
    }
  };

  return (
    <>
      <h2 className="mb-3 text-[20px] font-GanwonEduAll_Bold">
        칭찬 일기를 등록하시겠어요?
      </h2>
      <p className="text-xs mb-3">
        오늘까진 수정할 수 있지만, 이후엔 수정이 불가능하고 삭제만 할 수 있어요.
      </p>
      <p></p>
      <div className="flex items-center justify-end">
        <button
          className="mr-3 cursor-pointer"
          onClick={() => navigate('/Stamp')}
        >
          취소
        </button>
        <button className="cursor-pointer" onClick={handleDiaryRegister}>
          등록하기
        </button>
      </div>
    </>
  );
};

export default StampModal;
