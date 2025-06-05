import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Region {
  name: string;
  label: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [regions, setRegions] = useState<Region[]>([]);
  const [formData, setFormData] = useState({
    nickname: "",
    gender: "Male",
    region: "",
    personalities: "",
    interests: "",
    age: "",
  });

  useEffect(() => {
    fetch("/regions.json")
      .then((res) => res.json())
      .then((data) => setRegions(data))
      .catch((err) => console.error("지역 정보 로딩 실패:", err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://www.mannamdeliveries.link/oauth/signup/detail",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("회원가입 완료!");
      navigate("/main");
    } catch (error) {
      console.error(error);
      alert("회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="w-[80%] min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white p-10 rounded-2xl shadow-md">
        <h1 className="text-2xl font-MuseumClassic_L italic text-center mb-6 text-[#333]">
          회원가입 정보 입력
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 닉네임 */}
          <div>
            <label
              htmlFor="nickname"
              className="block text-sm font-GanwonEduAll_Bold text-gray-700"
            >
              닉네임
            </label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md text-sm font-GanwonEduAll_Light"
            />
          </div>

          {/* 성별 */}
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-GanwonEduAll_Bold text-gray-700"
            >
              성별
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md text-sm font-GanwonEduAll_Light"
            >
              <option value="Male">남성</option>
              <option value="Female">여성</option>
            </select>
          </div>

          {/* 지역 (드롭박스) */}
          <div>
            <label
              htmlFor="region"
              className="block text-sm font-GanwonEduAll_Bold text-gray-700"
            >
              지역
            </label>
            <select
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md text-sm font-GanwonEduAll_Light"
            >
              {regions.map((region) => (
                <option key={region.name} value={region.name}>
                  {region.label}
                </option>
              ))}
            </select>
          </div>

          {/* 성격 */}
          <div>
            <label
              htmlFor="personalities"
              className="block text-sm font-GanwonEduAll_Bold text-gray-700"
            >
              성격
            </label>
            <input
              type="text"
              id="personalities"
              name="personalities"
              value={formData.personalities}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md text-sm font-GanwonEduAll_Light"
            />
          </div>

          {/* 관심사 */}
          <div>
            <label
              htmlFor="interests"
              className="block text-sm font-GanwonEduAll_Bold text-gray-700"
            >
              관심사
            </label>
            <input
              type="text"
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md text-sm font-GanwonEduAll_Light"
            />
          </div>

          {/* 나이 */}
          <div>
            <label
              htmlFor="age"
              className="block text-sm font-GanwonEduAll_Bold text-gray-700"
            >
              나이
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md text-sm font-GanwonEduAll_Light"
            />
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            className="w-full py-2 bg-[#404040] text-white font-GanwonEduAll_Bold rounded-md hover:bg-[#333]"
          >
            제출
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
