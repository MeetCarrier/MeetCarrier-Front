import ch_default from '../assets/img/character/MeetCarrier_character.gif';
import ch_matching from '../assets/img/character/MeetCarrier_character2.gif';

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
    text: '성공',
    image: ch_default,
    buttonText: '아아아',
  },
  fail: {
    text: '실패',
    image: ch_default,
    buttonText: '이이이',
  },
} satisfies Record<
  MatchingStatus,
  {
    text: string;
    image: string;
    buttonText: string;
  }
>;
