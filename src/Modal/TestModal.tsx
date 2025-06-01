import { FC } from 'react';
import axios from 'axios';
import { useAppSelector } from '../Utils/hooks';
import { useNavigate } from 'react-router-dom';

const TestModal: FC = () => {
  const navigate = useNavigate();

  const calcTotal = (obj: Record<number, number>) =>
    Object.values(obj).reduce((sum, val) => sum + val, 0);

  const { selfEfficacy, interpersonalSkill, depression } = useAppSelector(
    (state) => state.test.answers
  );

  // 점수 등록
  const handleTestRegister = async () => {
    try {
      await axios.post(
        `https://www.mannamdeliveries.link/api/test/register`,
        {
          depressionScore: calcTotal(depression),
          efficacyScore: calcTotal(interpersonalSkill),
          relationshipScore: calcTotal(selfEfficacy),
        },
        { withCredentials: true }
      );
      alert('제출 완료!');
      navigate('/TestResult');
    } catch (error) {
      console.error('제출 실패', error);
      alert('제출에 실패했어요.');
    }
  };

  return (
    <>
      <h2 className="mb-3 text-[20px] font-GanwonEduAll_Bold">
        테스트를 제출하시겠어요?
      </h2>
      <p className="text-xs font-GanwonEduAll_Light mb-3">
        제출한 내용은 최적의 친구와 매칭하는 데 사용돼요.
        <br />
        제출하고 한 달 후에 다시 할 수 있기에 신중히 답변해주세요.
      </p>
      <p></p>
      <div className="flex items-center justify-end">
        <button
          className="mr-3 cursor-pointer"
          onClick={() => navigate('/Test')}
        >
          취소
        </button>
        <button className="cursor-pointer" onClick={handleTestRegister}>
          제출하기
        </button>
      </div>
    </>
  );
};

export default TestModal;
