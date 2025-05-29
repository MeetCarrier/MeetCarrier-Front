import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../Utils/hooks';
import { setSelectedStamp } from '../../Utils/diarySlice';
import Modal from '../../components/Modal';
import StampModal from '../../Modal/StampModal';
import NavBar from '../../components/NavBar';
import btn3 from '../../assets/img/button/btn3.webp';
import btn4 from '../../assets/img/button/btn4.webp';

import { stampMap } from '../../Utils/StampMap';

function Stamp() {
  const selected = useAppSelector((state) => state.diary.selectedStamp);
  const dateLabel = useAppSelector((state) => state.diary.dateLabel);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isModalOpen = searchParams.get('modal') === 'true';

  const stampCount = 16;
  const stamps = Array.from({ length: stampCount });

  return (
    <>
      <NavBar />

      <div className="absolute top-[50px] text-[#333333] left-0 right-0 px-6 text-center">
        <p className="text-[20px] font-MuseumClassic_L italic">
          칭찬 도장 등록하기
        </p>
      </div>

      <div className="flex flex-col w-full h-[calc(100%-200px)] px-4">
        <div className="flex justify-center mb-3">
          <div className="w-[200px] h-[60px] bg-white" />
        </div>

        <div className="w-full max-w-md mx-auto flex flex-col flex-1 min-h-0">
          <div className="mb-3">
            <p className="text-[18px] text-center font-GanwonEduAll_Bold">
              오늘도 훌륭했어요!
            </p>
            <p className="text-[14px] text-right font-GanwonEduAll_Light text-[#333333]/50">
              {dateLabel}
            </p>
          </div>
          <div className="w-full flex-1 min-h-0 overflow-y-auto p-3 mb-3">
            <div className="grid grid-cols-4 gap-3">
              {stamps.map((_, index) => {
                const stampNum = index + 1;
                const isActive = selected === stampNum;
                const stampSrc =
                  stampMap[stampNum]?.[isActive ? 'activate' : 'deactivate'];

                return (
                  <button
                    key={index}
                    className="aspect-square w-full"
                    onClick={() => dispatch(setSelectedStamp(stampNum))}
                  >
                    <img
                      src={stampSrc}
                      alt={`스탬프 ${stampNum}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                );
              })}
            </div>
          </div>
          {/* 버튼 */}
          <div className="flex justify-between w-full mb-3">
            <button
              className="relative mr-1"
              onClick={() => navigate('/Diary')}
            >
              <img src={btn4} alt="버튼2" className="w-full" />
              <span className="absolute inset-0 flex items-center justify-center font-GanwonEduAll_Bold cursor-pointer">
                이전
              </span>
            </button>
            <button
              className="relative ml-1"
              onClick={() => navigate('/Stamp?modal=true')}
            >
              <img src={btn3} alt="버튼1" className="w-full" />
              <span className="absolute inset-0 flex items-center justify-center font-GanwonEduAll_Bold cursor-pointer">
                다음
              </span>
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => navigate('/Stamp')}>
        <StampModal />
      </Modal>
    </>
  );
}

export default Stamp;
