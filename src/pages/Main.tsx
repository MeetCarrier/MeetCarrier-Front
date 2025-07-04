import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../Utils/hooks';
import toast from 'react-hot-toast';
import { initializeFirebase } from '../Utils/fcm';
import {
  setStatus,
  setSocketConnected,
  setMatchingTimeoutId,
  clearMatchingTimeout,
  setSuccessData,
  setFailData,
} from '../Utils/matchingSlice';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import btn1 from '../assets/img/button/btn1.webp';
import btn2 from '../assets/img/button/btn2.webp';
import bell_default from '../assets/img/icons/NavIcon/bell_default.webp';
import bell_alarm from '../assets/img/icons/NavIcon/bell_alarm.webp';
import NavBar from '../components/NavBar';
import Modal from '../components/Modal';
import MainModal from '../Modal/MainModal';
import IsTestModal from '../Modal/IsTestModal';
import RecommendModal from '../Modal/RecommendModal';
import PhoneAuthModal from '../Modal/PhoneAuthModal';
import IsPhoneAuthModal from '../Modal/IsPhoneAuthModal';
import { fetchUser, UserState } from '../Utils/userSlice';
import { fetchSelfTestList } from '../Utils/selfTestSlice';
import { startMatchingClient } from '../Utils/Matching';
import {
  setMatchingClient,
  getMatchingClient,
  clearMatchingClient,
} from '../Utils/matchingClientInstance';
import { MatchingContent, type MatchingStatus } from '../Utils/MatchingContent';
import { useUnreadAlarm } from '../Utils/useUnreadAlarm';

function Main() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAlarm = useUnreadAlarm();
  const [searchParams] = useSearchParams();
  const isModalOpen = searchParams.get('modal') === 'true';
  const [isTestModal, setIsTestModal] = useState(false);
  const location = useLocation();
  const fromMatching = location.state?.fromMatching === true;
  const status = useAppSelector((state) => state.matching.status);
  const user = useAppSelector((state) => state.user) as UserState | null;
  const isSocketConnected = useAppSelector(
    (state) => state.matching.isSocketConnected
  );
  const [locationAllowed, setLocationAllowed] = useState(false);

  const [recommededUser, setRecommendedUser] = useState<number[]>([]);
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);
  const [isPhoneAuthModalOpen, setIsPhoneAuthModalOpen] = useState(false);
  const [isIsPhoneAuthModalOpen, setIsIsPhoneAuthModalOpen] = useState(false);

  const successData = useAppSelector((state) => state.matching.successData);
  const failData = useAppSelector((state) => state.matching.failData);
  const selfTestList = useAppSelector((state) => state.selfTest.list);
  const isTest = selfTestList.length > 0;

  // 페이지 진입 시 유저 정보 요청 실패 시 로그인 요청
  useEffect(() => {
    const fetchData = async () => {
      // try {
      //   await dispatch(fetchUser()).unwrap();
      //   console.log('로그인 성공');
      //   await dispatch(fetchSelfTestList()).unwrap();
      // } catch (error) {
      //   console.warn('유저 정보 불러오기 실패 → 로그인 페이지로 이동', error);
      //   navigate('/Login');
      //   return;
      // }
      await dispatch(fetchUser());
      await dispatch(fetchSelfTestList());

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

      await initializeFirebase();
    };

    fetchData();
  }, [dispatch, navigate]);

  // 매칭 시작
  const handleStartMatching = () => {
    dispatch(setStatus('matching'));

    const timeoutId = window.setTimeout(() => {
      console.log('매칭 시간 초과');
      dispatch(setStatus('fail2'));
      dispatch(clearMatchingTimeout());
    }, 600000);

    dispatch(setMatchingTimeoutId(timeoutId));

    const client = startMatchingClient({
      onSuccess: (data) => {
        console.log('매칭 성공', data);
        dispatch(clearMatchingTimeout());
        dispatch(setSuccessData(data));
        dispatch(setStatus('success'));
      },
      onFail: (data) => {
        console.log('매칭 실패', data);
        dispatch(clearMatchingTimeout());
        dispatch(setFailData(data));
        const isEmpty =
          Array.isArray(data?.recommendedUserIds) &&
          data.recommendedUserIds.length === 0;
        dispatch(setStatus(isEmpty ? 'fail2' : 'fail'));
      },
      onConnected: () => {
        dispatch(setSocketConnected(true)); // 연결 완료 시점
      },
    });
    setMatchingClient(client);
  };

  const handleButton1ClickByStatus: Record<MatchingStatus, () => void> = {
    default: async () => {
      // 자가 평가 점수가 없다면? -> X
      // 위치 설정 X -> X
      // 이미 매칭이 있다면? -> X
      if (!locationAllowed) {
        toast.error('위치 권한이 허용되어야 매칭을 시작할 수 있어요.');
        return;
      }

      if (!user?.phone) {
        setIsIsPhoneAuthModalOpen(true);
        return;
      }

      if (!isTest) {
        setIsTestModal(true);
        return;
      }

      try {
        const res = await axios.get(
          'https://www.mannamdeliveries.link/api/matches/can-request',
          { withCredentials: true }
        );

        if (res.data === false) {
          toast.error('이미 진행 중인 만남이 있어요.');
          return;
        }

        handleStartMatching();
      } catch (error) {
        console.error(error);
        toast.error('매칭 가능 여부 확인에 실패했어요.');
      }
    },
    matching: () => {
      const client = getMatchingClient();
      // 소켓 연결 중 해제
      if (!isSocketConnected) {
        console.log('아직 연결되지 않았습니다.');
        return;
      }
      if (client) {
        client.disconnect();
        clearMatchingClient();
      }
      dispatch(clearMatchingTimeout());
      dispatch(setStatus('default'));
      dispatch(setSocketConnected(false));
    },
    success: () => {
      dispatch(setStatus('default'));
      navigate(`/survey/${successData?.surveySessionId}`, {
        state: {
          sessionId: successData?.surveySessionId,
        },
      });
    },
    fail: () => {
      const ids = failData?.recommendedUserIds;
      if (Array.isArray(ids) && ids.length > 0) {
        setRecommendedUser(ids);
        setIsRecommendModalOpen(true);
      } else {
        toast.error('추천 유저에 문제가 생겼어요');
      }
    },
    fail2: async () => {
      // 자가 평가 점수가 없다면? -> X
      // 위치 설정 X -> X
      // 이미 매칭이 있다면? -> X
      if (!locationAllowed) {
        toast.error('위치 권한이 허용되어야 매칭을 시작할 수 있습니다.');
        return;
      }

      if (!user?.phone) {
        setIsIsPhoneAuthModalOpen(true);
        return;
      }

      if (!isTest) {
        setIsTestModal(true);
        return;
      }

      try {
        const res = await axios.get(
          'https://www.mannamdeliveries.link/api/matches/can-request',
          { withCredentials: true }
        );

        if (res.data === false) {
          toast.error('이미 진행 중인 만남이 있어요.');
          return;
        }

        handleStartMatching();
      } catch (error) {
        console.error(error);
        toast.error('매칭 가능 여부 확인에 실패했어요.');
      }
    },
  };

  const handleButton2ClickByStatus: Record<MatchingStatus, () => void> = {
    default: () => {
      navigate('/main?modal=true');
    },
    matching: () => {
      navigate('/main?modal=true', { state: { fromMatching: true } });
    },
    success: () => {
      const id = successData?.matchedUserId;
      console.log('성공', id);
      if (typeof id === 'number') {
        setRecommendedUser([id]);
        setIsRecommendModalOpen(true);
      } else {
        toast.error('유저에 정보에 문제가 생겼어요');
      }
    },
    fail: () => {
      const client = getMatchingClient();
      if (client) {
        client.disconnect();
        clearMatchingClient();
      }
      dispatch(clearMatchingTimeout());
      dispatch(setStatus('default'));
      dispatch(setSocketConnected(false));
    },
    fail2: () => {
      const client = getMatchingClient();
      if (client) {
        client.disconnect();
        clearMatchingClient();
      }
      dispatch(clearMatchingTimeout());
      dispatch(setStatus('default'));
      dispatch(setSocketConnected(false));
    },
  };

  const handlebellClick = () => {
    navigate('/Alarm');
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
          src={isAlarm ? bell_alarm : bell_default}
          alt="bell_default"
          className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px] cursor-pointer"
          onClick={handlebellClick}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => navigate('/main')}>
        <MainModal fromMatching={fromMatching} />
      </Modal>

      <Modal isOpen={isTestModal} onClose={() => setIsTestModal(false)}>
        <IsTestModal />
      </Modal>

      <Modal
        isOpen={isRecommendModalOpen}
        onClose={() => setIsRecommendModalOpen(false)}
      >
        <RecommendModal userIds={recommededUser} status={status} />
      </Modal>

      <Modal
        isOpen={isIsPhoneAuthModalOpen}
        onClose={() => setIsIsPhoneAuthModalOpen(false)}
      >
        <IsPhoneAuthModal
          onClose={() => {
            setIsIsPhoneAuthModalOpen(false);
            setIsPhoneAuthModalOpen(true);
          }}
        />
      </Modal>

      <Modal
        isOpen={isPhoneAuthModalOpen}
        onClose={() => setIsPhoneAuthModalOpen(false)}
      >
        <PhoneAuthModal
          onClose={() => {
            setIsPhoneAuthModalOpen(false);
          }}
        />
      </Modal>
    </>
  );
}

export default Main;
