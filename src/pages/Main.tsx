import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import btn1 from '../assets/img/button/btn1.webp';
import btn2 from '../assets/img/button/btn2.webp';
import bell_default from '../assets/img/icons/NavIcon/bell_default.svg';

import NavBar from '../components/NavBar';
import Modal from '../components/Modal';
import MainModal from '../Modal/MainModal';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../Utils/store';
import { fetchUser } from '../Utils/userSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../Utils/store';
import { UserState } from '../Utils/userSlice';
import { startMatchingClient, type MatchingClient } from '../Utils/Matching';
import { MatchingContent, type MatchingStatus } from '../Utils/MatchingContent';

function Main() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isModalOpen = searchParams.get('modal') === 'true';
  const [status, setStatus] = useState<MatchingStatus>('default');
  const matchingClientRef = useRef<MatchingClient | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const user = useSelector(
    (state: RootState) => state.user
  ) as UserState | null;

  // 페이지 진입 시 유저 정보 요청 실패 시 로그인 요청
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchUser()).unwrap();
        console.log('로그인 성공');

        if (!navigator.geolocation) {
          console.error('위치 정보 지원 안됨');
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            console.log('위치:', { latitude, longitude });
            setLocationAllowed(true);

            try {
              await axios.patch(
                'https://www.mannamdeliveries.link/api/user',
                { latitude: latitude, longitude: longitude },
                {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  withCredentials: true,
                }
              );
              console.log('위치 전송 완료');
            } catch (error) {
              console.error('위치 전송 실패', error);
            }
          },
          (error) => {
            console.error('위치 정보 실패', error.message);
          }
        );
      } catch (error) {
        console.warn('유저 정보 불러오기 실패 → 로그인 페이지로 이동', error);
        navigate('/Login');
      }
    };

    fetchData();
  }, [dispatch, navigate]);

  // 자가 평가 점수가 없다면?(매칭 정보 설정을 안한 상태라면) -> 매칭 시작 전에 한번 물어보기
  // 매칭 시작
  const handleStartMatching = () => {
    setStatus('matching');

    timeoutRef.current = setTimeout(() => {
      console.log('매칭 시간 초과');
      setStatus('fail');
    }, 360000);

    const client = startMatchingClient({
      onSuccess: (data) => {
        console.log('매칭 성공', data);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setTimeout(() => {
          setStatus('success');
        }, 5000);
      },
      onFail: (data) => {
        console.log('매칭 실패', data);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setStatus('fail');
      },
      onConnected: () => {
        setIsSocketConnected(true); // 연결 완료 시점
      },
    });
    matchingClientRef.current = client;
  };

  // 수정해야 함.
  const handleButton1ClickByStatus: Record<MatchingStatus, () => void> = {
    default: () => {
      if (!locationAllowed) {
        alert('위치 권한이 허용되어야 매칭을 시작할 수 있습니다.');
        return;
      }

      if (!user?.personalities || user.personalities.trim() === '') {
        alert('자가 평가 테스트를 먼저 완료해주세요.');
        return;
      }
      handleStartMatching();
    },
    matching: () => {
      // 소켓 연결 중 해제
      if (!isSocketConnected) {
        console.log('아직 연결되지 않았습니다.');
        return;
      }

      matchingClientRef.current?.disconnect();
      matchingClientRef.current = null; // 연결 종료 후 초기화
      setIsSocketConnected(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
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
      navigate('/main?modal=true');
    },
    matching: () => {
      navigate('/main?modal=true');
    },
    success: () => {
      navigate('/main?modal=true');
    },
    fail: () => {
      matchingClientRef.current?.disconnect();
      matchingClientRef.current = null; // 연결 종료 후 초기화
      setIsSocketConnected(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
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

      <Modal isOpen={isModalOpen} onClose={() => navigate('/main')}>
        <MainModal />
      </Modal>
    </>
  );
}

export default Main;
