import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import btn1 from '../assets/img/button/btn1.webp';
import btn2 from '../assets/img/button/btn2.webp';
import bell_default from '../assets/img/icons/NavIcon/bell_default.svg';

import NavBar from '../components/NavBar';
import Modal from '../components/Modal';
import MainModal from '../Modal/MainModal';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../Utils/store';
import { fetchUser } from '../Utils/userSlice';

import { MatchingContent, type MatchingStatus } from '../Utils/MatchingContent';
import { startMatchingClient, type MatchingClient } from '../Utils/Matching';

function Main() {
  const dispatch = useDispatch<AppDispatch>();

  // 페이지 진입 시 유저 정보 요청
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isModalOpen = searchParams.get('modal') === 'true';
  const [status, setStatus] = useState<MatchingStatus>('default');
  const [matchingClient, setMatchingClient] = useState<MatchingClient | null>(
    null
  );

  // 매칭 시작
  const handleStartMatching = () => {
    setStatus('matching');
    const client = startMatchingClient({
      onSuccess: (data) => {
        console.log('매칭 성공', data);
        setStatus('success');
      },
      onFail: (data) => {
        console.log('매칭 실패', data);
        setStatus('fail');
      },
    });
    setMatchingClient(client);
  };

  // 수정해야 함.
  const handleButton1ClickByStatus: Record<MatchingStatus, () => void> = {
    default: () => {
      handleStartMatching();
    },
    matching: () => {
      matchingClient?.disconnect();
      setStatus('default');
    },
    success: () => {
      setStatus('fail');
    },
    fail: () => {
      handleStartMatching();
    },
  };

  const handleButton2ClickByStatus: Record<MatchingStatus, () => void> = {
    default: () => {
      navigate('/?modal=true');
    },
    matching: () => {
      navigate('/?modal=true');
    },
    success: () => {
      navigate('/?modal=true');
    },
    fail: () => {
      matchingClient?.disconnect();
      setStatus('default');
    },
  };

  return (
    <>
      <NavBar />

      <div className="w-[80%] max-w-md flex flex-col items-center space-y-3 mb-4">
        {/* 친구 찾기 버튼 */}
        <button
          className="relative w-full max-w-md"
          onClick={handleButton1ClickByStatus[status]}
        >
          <img src={btn1} alt="버튼1" className="w-full" />
          <span className="absolute inset-0 flex items-center justify-center font-GanwonEduAll_Bold cursor-pointer">
            {MatchingContent[status].buttonText1}
          </span>
        </button>
        <button
          className="relative w-full max-w-md"
          onClick={handleButton2ClickByStatus[status]}
        >
          <img src={btn2} alt="버튼2" className="w-full" />
          <span className="absolute inset-0 flex items-center justify-center font-GanwonEduAll_Bold cursor-pointer">
            {MatchingContent[status].buttonText2}
          </span>
        </button>
      </div>

      {/* 캐릭터 */}
      <div className="relative w-[309px] h-[309px] mb-4">
        <p className="absolute top-10 left-1/2 -translate-x-1/2 w-[250px] text-center text-[#333333] font-GanwonEduAll_Light underline decoration-1 underline-offset-4">
          {MatchingContent[status].text}
        </p>
        <img
          src={MatchingContent[status].image}
          alt="캐릭터"
          className="absolute inset-0 w-full h-full"
        />
      </div>

      <div className="absolute top-[50px] text-[#333333] left-0 right-0 px-6 text-center">
        <p className="text-[20px] font-MuseumClassic_L italic">만남 배달부</p>
        <img
          src={bell_default}
          alt="bell_default"
          className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px]"
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => navigate('/')}>
        <MainModal />
      </Modal>
    </>
  );
}

export default Main;
