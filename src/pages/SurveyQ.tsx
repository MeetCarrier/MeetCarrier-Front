import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../Utils/store';
import { UserState } from '../Utils/userSlice';
import axios from 'axios';
import NavBar from '../components/NavBar';
import check_icon from '../assets/img/icons/HobbyIcon/check.svg';
import back_arrow from '../assets/img/icons/HobbyIcon/back_arrow.svg';
import toast from 'react-hot-toast';

function SurveyQ() {
  const [inputValue, setInputValue] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [selectedQuestion, setSelectedQuestions] = useState<string | null>(
    null
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const user = useSelector(
    (state: RootState) => state.user
  ) as UserState | null;

  useEffect(() => {
    if (user?.questionList) {
      const parseQuestions = user.questionList
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== '');
      setQuestions(parseQuestions);
      setSelectedQuestions(user?.question);
    }
  }, [user]);

  const addQuestion = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !questions.includes(trimmed)) {
      if (questions.length >= 5) {
        toast.error('질문은 최대 5개까지 등록할 수 있어요!');
        return;
      }
      setQuestions((prev) => [...prev, trimmed]);
      setSelectedQuestions(trimmed);
      setInputValue('');
    }
  };

  const deleteQuestion = (q: string) => {
    setQuestions((prev) => prev.filter((item) => item !== q));
    if (selectedQuestion === q) {
      setSelectedQuestions(null);
    }
  };

  const toggleSelect = (q: string) => {
    setSelectedQuestions((prev) => (prev === q ? null : q));
  };

  const startEdit = (index: number, value: string) => {
    setEditingIndex(index);
    setEditingValue(value);
  };

  const saveEdit = (index: number) => {
    const trimmed = editingValue.trim();
    if (!trimmed || questions.includes(trimmed)) {
      toast.error('중복이거나 빈 질문입니다');
      return;
    }
    const updated = [...questions];
    const old = updated[index];
    updated[index] = trimmed;
    setQuestions(updated);
    if (selectedQuestion === old) {
      setSelectedQuestions(trimmed);
    }
    setEditingIndex(null);
    setEditingValue('');
  };

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
      toast.success('저장 완료!');
    } catch (error) {
      console.error('저장 실패:', error);
      toast.error('저장에 실패했어요.');
    }
  };

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
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
                className={`px-4 py-3 rounded text-sm flex justify-between items-center ${
                  selectedQuestion === q
                    ? 'border-2 border-red-400 text-red-500'
                    : 'border border-gray-200'
                }`}
              >
                {editingIndex === idx ? (
                  <input
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(idx)}
                    className="flex-1 mr-2 text-sm border rounded px-2 py-1"
                  />
                ) : (
                  <span
                    className="flex-1 line-clamp-4 font-GanwonEduAll_Light"
                    onClick={() => toggleSelect(q)}
                  >
                    {q}
                  </span>
                )}

                {editingIndex === idx ? (
                  <button
                    onClick={() => saveEdit(idx)}
                    className="text-xs text-blue-500 ml-2 font-GanwonEduAll_Bold"
                  >
                    저장
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(idx, q)}
                      className="text-xs text-blue-500 ml-2 font-GanwonEduAll_Bold"
                    >
                      수정
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteQuestion(q);
                      }}
                      className="text-xs text-red-500 ml-2 font-GanwonEduAll_Bold"
                    >
                      삭제
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col mb-2 w-full px-3">
        <p className="text-xs font-GanwonEduAll_Light text-gray-500 pl-1 mb-1">
          등록한 질문은 비대면 설문지 단계에서 사용돼요
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              if (e.target.value.length <= 40) setInputValue(e.target.value);
            }}
            onKeyDown={(e) => e.key === 'Enter' && addQuestion()}
            placeholder="예) 제일 잘맞는다고 생각하는 MBTI와 이유는?"
            className="flex-1 bg-white rounded-md text-xs px-3 py-2 border border-white placeholder:text-gray-400"
          />
          <button
            onClick={addQuestion}
            className="whitespace-nowrap px-2 py-[6px] bg-red-400 text-white rounded text-xs font-GanwonEduAll_Bold"
          >
            등록
          </button>
        </div>
      </div>
    </>
  );
}

export default SurveyQ;
