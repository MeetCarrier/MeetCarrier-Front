import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../Utils/store';
import { UserState } from '../Utils/userSlice';
import axios from 'axios';
import NavBar from '../components/NavBar';
import check_icon from '../assets/img/icons/HobbyIcon/check.svg';
import back_arrow from '../assets/img/icons/HobbyIcon/back_arrow.svg';

function SurveyQ() {
  const [inputValue, setInputValue] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  // 질문 토글 부분
  const [selectedQuestion, setSelectedQuestions] = useState<string | null>(
    null
  );

  const user = useSelector(
    (state: RootState) => state.user
  ) as UserState | null;

  useEffect(() => {
    if (user?.questionList) {
      const parseQuestions = user.questionList
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag != '');
      setQuestions(parseQuestions);
      setSelectedQuestions(user?.question);
    }
  }, [user]);

  const addQuestion = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !questions.includes(trimmed)) {
      setQuestions((prev) => [...prev, trimmed]);
      setSelectedQuestions(trimmed); // 추가된 질문을 바로 선택
      setInputValue('');
    }
  };

  const deleteQuestion = (q: string) => {
    setQuestions((prev) => prev.filter((item) => item !== q));
    if (selectedQuestion === q) {
      setSelectedQuestions(null); // 선택된 질문이면 선택 해제
    }
  };

  const toggleSelect = (q: string) => {
    setSelectedQuestions((prev) => (prev === q ? null : q));
  };

  // 나중에 수정
  const handleSubmit = async () => {
    const questionStr = questions.join(',');
    const selectedQuestionStr = selectedQuestion;
    try {
      await axios.patch(
        'https://www.mannamdeliveries.link/api/user',
        { question: selectedQuestionStr, questionList: questionStr },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      alert('저장 완료!');
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했어요.');
    }
  };

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/main?modal=true');
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
          설문지 질문 수정
        </p>
        <img
          src={check_icon}
          alt="check_icon"
          className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px] cursor-pointer"
          onClick={handleSubmit}
        />
      </div>
      <div className="flex flex-col w-full h-[calc(100%-240px)] overflow-y-auto p-4 z-0 bg-[#F2F2F2]">
        {questions.length === 0 ? (
          <div className="flex-1 flex justify-center items-center text-sm text-gray-400">
            등록한 질문이 없어요...
          </div>
        ) : (
          <ul className="space-y-2">
            {questions.map((q, idx) => (
              <li
                key={idx}
                onClick={() => toggleSelect(q)}
                className={`px-4 py-3 rounded text-sm cursor-pointer flex justify-between items-center
            ${
              selectedQuestion === q
                ? 'border-2 border-red-400 text-red-500'
                : 'border border-gray-200'
            }`}
              >
                <span className="line-clamp-2">{q}</span>
                <span
                  className="text-xs text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteQuestion(q);
                  }}
                >
                  수정
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col mb-2 w-full">
        <p className="text-xs font-GanwonEduAll_Light text-gray-500 pl-3">
          등록한 질문은 비대면 설문지 단계에서 사용돼요
        </p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            if (e.target.value.length <= 40) setInputValue(e.target.value);
          }}
          onKeyDown={(e) => e.key === 'Enter' && addQuestion()}
          placeholder="예) 제일 잘맞는다고 생각하는 MBTI와 이유는?"
          className=" bg-white rounded-md text-xs mx-3 mt-2 px-3 py-2 border border-white placeholder:text-gray-400"
        />
      </div>
    </>
  );
}

export default SurveyQ;
