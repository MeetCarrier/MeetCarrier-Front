import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../../components/NavBar";
import arrowIcon from "../../assets/img/icons/HobbyIcon/back_arrow.svg";

function PsychTestResult() {
  const navigate = useNavigate();

  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const response = await axios.get(
          "https://www.mannamdeliveries.link/api/test",
          {
            withCredentials: true,
          }
        );

        const fetchedResults = response.data.map((result: any) => ({
          ...result,
          createdAt: new Date(result.createdAt),
        }));

        // createdAt을 기준으로 최신 순으로 정렬
        fetchedResults.sort(
          (a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime()
        );

        // 최신 결과에만 isLatest를 true로 설정
        const processedResults = fetchedResults.map(
          (result: any, index: number) => ({
            date: result.createdAt
              .toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
              .replace(/\. /g, ".")
              .slice(0, -1),
            isLatest: index === 0,
            rawResult: result, // 원본 데이터를 저장하여 필요시 활용
          })
        );

        setTestResults(processedResults);
      } catch (err) {
        console.error("자가진단 테스트 결과 조회 실패:", err);
        setError("테스트 결과를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestResults();
  }, []);

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center w-full h-[calc(100%-100px)] relative">
        {/* 결과 이력 내용 */}
        <div className="flex flex-col items-center w-[90%] max-w-md pt-[100px] space-y-4">
          {loading ? (
            <p className="text-[#999999] text-base">
              테스트 결과를 불러오는 중...
            </p>
          ) : error ? (
            <p className="text-red-500 text-base">{error}</p>
          ) : testResults.length === 0 ? (
            <p className="text-[#999999] text-base">
              아직 테스트를 한 적이 없어요...
            </p>
          ) : (
            <div className="flex flex-col w-full space-y-4">
              {testResults.map((result, idx) => (
                <div
                  key={idx}
                  className="w-full bg-white rounded-xl px-5 shadow-sm cursor-pointer flex items-center min-h-[60px]"
                  onClick={() => alert(`${result.date} 결과 보기`)} // 나중에 실제 결과 페이지로 이동하도록 수정
                >
                  <div className="flex items-center justify-between w-full h-15">
                    <span className="text-sm text-[#666666] font-GanwonEduAll_Light">
                      {result.date}
                    </span>
                    <div className="flex items-center gap-2">
                      {result.isLatest && (
                        <span className="bg-[#71B280] text-lg text-white text-[10px] rounded-full w-10 h-8 flex items-center justify-center font-bold">
                          New
                        </span>
                      )}
                      <img
                        src={arrowIcon}
                        alt="arrow"
                        className="w-[12px] h-[12px] transform scale-x-[-1]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* 상단 제목 */}
      <div className="absolute top-[50px] text-[#333333] left-0 right-0 px-5 text-center">
        <img
          src={arrowIcon}
          alt="arrowIcon"
          className="absolute top-1/2 -translate-y-1/2 left-6 w-[9px] h-[20px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <p className="text-[20px] font-MuseumClassic_L italic">결과 이력</p>
      </div>
    </>
  );
}

export default PsychTestResult;
