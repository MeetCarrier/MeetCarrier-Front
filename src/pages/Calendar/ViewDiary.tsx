import { useState } from 'react';
import { useAppSelector } from '../../Utils/hooks';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import menu_icon from '../../assets/img/icons/Dairy/menu_icon.svg';
import back_arrow from '../../assets/img/icons/HobbyIcon/back_arrow.svg';
import modify_icon from '../../assets/img/icons/Dairy/modify_icon.svg';
import delete_icon from '../../assets/img/icons/Dairy/delete_icon.svg';
import Modal from '../../components/Modal';
import DiaryDeleteModal from '../../Modal/DiaryDeleteModal';
import { stampMap } from '../../Utils/StampMap';

function ViewDiary() {
  const [showSelector, setShowSelector] = useState(false);
  const text = useAppSelector((state) => state.diary.text);
  const selectedStamp = useAppSelector((state) => state.diary.selectedStamp);
  const stampImage = stampMap[selectedStamp ?? 1]?.activate;
  const dateLabel = useAppSelector((state) => state.diary.dateLabel);
  const isEditingToday = useAppSelector((state) => state.diary.isEditingToday);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isModalOpen = searchParams.get('modal') === 'true';

  const handleBackClick = () => {
    navigate('/Calendar');
  };

  const handleMenuClick = () => {
    setShowSelector(!showSelector);
  };

  const handleModifyClick = () => {
    navigate('/Diary');
  };

  const handleDeleteClick = () => {
    navigate('/ViewDiary?modal=true');
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
        <p className="text-[20px] font-MuseumClassic_L italic">
          칭찬 일기 작성하기
        </p>
        {isEditingToday ? (
          <img
            src={menu_icon}
            alt="menu_icon"
            onClick={handleMenuClick}
            className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px] cursor-pointer"
          />
        ) : (
          <img
            src={delete_icon}
            alt="delete_icon"
            onClick={handleDeleteClick}
            className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px] cursor-pointer"
          />
        )}
        {showSelector && (
          <div className="absolute top-[110%] right-4 bg-white shadow-lg rounded-md z-50 p-3 text-sm">
            <button
              className="flex items-center space-x-2 px-2 py-1 font-GanwonEduAll_Light hover:bg-gray-100 rounded-md"
              onClick={handleModifyClick}
            >
              <img src={modify_icon} alt="수정" className="w-[16px] h-[16px]" />
              <span>수정</span>
            </button>
            <button
              className="flex items-center space-x-2 px-2 py-1 font-GanwonEduAll_Light hover:bg-red-50 rounded-md text-[#BD4B2C]"
              onClick={handleDeleteClick}
            >
              <img src={delete_icon} alt="삭제" className="w-[16px] h-[16px]" />
              <span>삭제</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col w-full h-[calc(100%-200px)] px-4">
        <div className="flex justify-center mb-3">
          <div className="w-[200px] h-[60px] bg-white" />
        </div>

        <div className="w-full max-w-md min-h-0 mx-auto flex flex-col flex-1">
          <div className="mb-3">
            <p className="text-[18px] font-GanwonEduAll_Bold text-center">
              오늘의 나를 칭찬하자면?
            </p>
            <p className="text-[14px] font-GanwonEduAll_Light text-right text-[#333333]/50">
              {dateLabel}
            </p>
          </div>

          {/* text가 나머지 공간 전부 차지 */}
          <div className="w-full flex-1 bg-white rounded-t-[10px] overflow-y-auto p-3">
            <p className="text-[14px] whitespace-pre-wrap">{text}</p>
          </div>
          <div className="flex justify-end rounded-b-[10px] bg-white p-3 mb-4">
            <img src={stampImage} alt="스탬프" className="w-[70px] h-[70px]" />
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => navigate('/ViewDiary')}>
        <DiaryDeleteModal />
      </Modal>
    </>
  );
}

export default ViewDiary;
