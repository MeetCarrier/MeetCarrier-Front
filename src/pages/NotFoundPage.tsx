import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="w-[80%] h-[50%] max-w-md flex flex-col items-center space-y-3 mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          페이지를 찾을 수 없습니다.
        </h1>
        <p className="text-gray-600 text-sm mb-6">
          페이지가 존재하지 않거나, 사용할 수 없는 페이지입니다.
          <br />
          입력하신 주소가 정확한지 다시 한 번 확인해주세요.
        </p>
        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-[#C67B5A] text-white rounded-md text-sm"
            onClick={() => navigate("/")}
          >
            메인으로
          </button>
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            onClick={() => navigate(-1)}
          >
            이전 페이지
          </button>
        </div>
      </div>
    </>
  );
}

export default NotFoundPage;
