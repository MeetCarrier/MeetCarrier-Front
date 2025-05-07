import ch_default from '../assets/img/character/MeetCarrier_character.gif';
import ch_matching from '../assets/img/character/MeetCarrier_character2.gif';
import ch_success from '../assets/img/character/MeetCarrier_character3.gif';

export type MatchingStatus = 'default' | 'matching' | 'success' | 'fail';

export const MatchingContent = {
  default: {
    text: '여기야, 여기~~',
    image: ch_default,
    buttonText: '친구 찾기',
  },
  matching: {
    text: '내가 딱 맞는 친구를 찾아줄께!!!',
    image: ch_matching,
    buttonText: '취소',
  },
  success: {
    text: '딱 맞는 친구를 찾았어요~',
    image: ch_success,
    buttonText: '비대면 설문지 작성하러 가기',
  },
  fail: {
    text: '맞춤 친구를 찾지 못했어요...',
    image: ch_default,
    buttonText: '매칭 추천 친구 고르기',
  },
} satisfies Record<
  MatchingStatus,
  {
    text: string;
    image: string;
    buttonText: string;
  }
>;
