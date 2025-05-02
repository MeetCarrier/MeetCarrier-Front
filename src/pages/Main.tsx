import { useState } from 'react';
import chMeetCarrier from '../assets/img/character/MeetCarrier_character.gif';
import btn1 from '../assets/img/button/btn1.webp';
import btn2 from '../assets/img/button/btn2.webp';
import bell_default from '../assets/img/icons/NavIcon/bell_default.svg';

import NavBar from '../components/NavBar';
import Modal from '../components/Modal';
import MainModal from '../Modal/MainModal';

function Main() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <NavBar />

      <div className="w-[80%] max-w-md flex flex-col items-center space-y-3 mb-4">
        <button
          className="relative w-full max-w-md"
          onClick={() => setIsModalOpen(true)}
        >
          <img src={btn1} alt="버튼1" className="w-full" />
          <span className="absolute inset-0 flex items-center justify-center font-GanwonEduAll_Bold">
            친구 찾기
          </span>
        </button>
        <button className="relative w-full max-w-md">
          <img src={btn2} alt="버튼2" className="w-full" />
          <span className="absolute inset-0 flex items-center justify-center font-GanwonEduAll_Bold">
            내 매칭 정보 수정하기
          </span>
        </button>
      </div>

      <img
        src={chMeetCarrier}
        alt="캐릭터"
        className="w-[309px] h-[309px] mb-4"
      />

      <div className="absolute top-[50px] left-0 right-0 px-6 text-center">
        <p className="text-[20px] font-MuseumClassic_L italic">만남 배달부</p>
        <img
          src={bell_default}
          alt="bell_default"
          className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px]"
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <MainModal />
      </Modal>
    </>
  );
}

export default Main;
