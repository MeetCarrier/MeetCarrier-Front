import React, { useState } from 'react';
import NavBar from '../../components/NavBar';
// import BottomNavBar from '../../components/BottomNavBar'; // 필요시 주석 해제
import bellIcon from '../../assets/img/icons/NavIcon/bell_default.svg';
import arrowIcon from '../../assets/img/icons/HobbyIcon/right_arrow.svg';
import profileImg from '../../assets/img/sample/sample_profile.svg';

function ProfilePage() {
  // 예시 데이터 (실제 데이터 연동 시 API로 대체)
  const [nickname] = useState('밥만 잘먹더라');
  const [age] = useState(21);
  const [footprint] = useState(245);
  const [footprintMax] = useState(300);
  const [reviews] = useState([
    { text: '친절하고 배려심 있어요', count: 11 },
    { text: '재미있어요', count: 9 },
    { text: '말이 잘 통해요', count: 1 },
  ]);
  const [contactExclude, setContactExclude] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-20">
      {/* 상단 헤더 */}
      <NavBar />
      <div className="relative flex items-center justify-center h-[50px] border-b border-gray-200 bg-white">
        <span className="text-[20px] font-MuseumClassic_L italic">마이페이지</span>
        <img
          src={bellIcon}
          alt="알림"
          className="absolute right-6 top-1/2 -translate-y-1/2 w-[20px] h-[20px] cursor-pointer"
        />
      </div>

      {/* 내 정보 요약 */}
      <div className="flex items-center bg-white px-6 py-4 border-b border-gray-100">
        <img src={profileImg} alt="프로필" className="w-16 h-16 rounded-[8px] object-cover" />
        <div className="ml-4 flex-1">
          <div className="text-lg font-bold text-[#333]">{nickname}, {age}</div>
          <div className="text-xs text-gray-500 mt-1">내 정보 • 계정 관리</div>
        </div>
        <img src={arrowIcon} alt=">" className="w-5 h-5 ml-2" />
      </div>

      {/* 활동 지표 */}
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#333] font-semibold">만남 발자국 <span className="text-xs text-gray-400 ml-1">ⓘ</span></span>
          <span className="text-xs text-[#BD4B2C] font-bold">{footprint}보</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#BD4B2C] rounded-full transition-all"
            style={{ width: `${(footprint / footprintMax) * 100}%` }}
          />
        </div>
      </div>

      {/* 심리 테스트 결과 */}
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="text-sm font-semibold text-[#333] mb-2">심리 테스트 결과</div>
        <ul>
          <li className="py-2 border-b border-gray-50 cursor-pointer flex items-center justify-between">
            <span>자기평가 테스트</span>
            <img src={arrowIcon} alt=">" className="w-4 h-4" />
          </li>
          <li className="py-2 border-b border-gray-50 cursor-pointer flex items-center justify-between">
            <span>대인관계 테스트</span>
            <img src={arrowIcon} alt=">" className="w-4 h-4" />
          </li>
          <li className="py-2 cursor-pointer flex items-center justify-between">
            <span>우울증 테스트</span>
            <img src={arrowIcon} alt=">" className="w-4 h-4" />
          </li>
        </ul>
      </div>

      {/* 받은 후기 */}
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="text-sm font-semibold text-[#333] mb-2">받은 후기</div>
        <ul>
          {reviews.map((review, idx) => (
            <li key={idx} className="flex items-center justify-between py-1 text-xs text-gray-700">
              <span>“{review.text}”</span>
              <span className="flex items-center ml-2">
                <svg className="w-4 h-4 text-[#BD4B2C] mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 016 6c0 4.418-6 10-6 10S4 12.418 4 8a6 6 0 016-6zm0 8a2 2 0 100-4 2 2 0 000 4z" /></svg>
                {review.count}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 매칭 설정 */}
      <div className="bg-white px-6 py-4 mt-2">
        <div className="text-sm font-semibold text-[#333] mb-2">매칭 설정</div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-700">연락처에 있는 사람 매칭 제외</span>
          <button
            className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${contactExclude ? 'bg-[#BD4B2C]' : 'bg-gray-300'}`}
            onClick={() => setContactExclude((prev) => !prev)}
          >
            <span
              className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${contactExclude ? 'translate-x-4' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* <BottomNavBar /> */}
    </div>
  );
}

export default ProfilePage;
