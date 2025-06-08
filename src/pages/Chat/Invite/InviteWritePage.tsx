import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import letterBg from '../../../assets/img/icons/Letter/letterWrite.svg';
import sampleProfile from '../../../assets/img/sample/sample_profile.svg'; // 예시 프로필
import NavBar from '../../../components/NavBar';

interface LocationState {
    senderName: string;
    recipientName: string;
    senderProfile: string;
}

function InviteWritePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { senderName, recipientName, senderProfile } = location.state as LocationState;
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        if (!message.trim()) return;
        // 초대장 전송 로직 추가
        console.log('보낼 메시지:', message);
        navigate('/send-success'); // 전송 후 이동할 페이지
    };

    return (
        <>
            <NavBar />

            <div className="absolute top-[50px] text-[#333333] left-0 right-0 px-6 text-center">
                <p className="text-[20px] font-MuseumClassic_L italic">만남 배달부</p>
            </div>

            {/* 전송 버튼 */}
            <button
                onClick={handleSubmit}
                disabled={!message.trim()}
                className={`w-full max-w-[320px] py-2 rounded-md font-semibold transition ${message.trim()
                    ? 'bg-[#D45A4B] text-white hover:bg-[#bf4a3c]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
            >
                대면 초대장 보내기
            </button>

            <div
                className="relative w-full max-w-[350px] h-[500px] bg-contain bg-no-repeat bg-center p-6"
                style={{ backgroundImage: `url(${letterBg})` }}
            >
                {/* To */}
                <div className="absolute top-13 left-6 flex items-center space-x-2 text-sm">
                    <span>To. <strong>{recipientName}</strong></span>
                </div>

                {/* 메시지 입력 필드 */}
                <textarea
                    className="absolute top-20 left-6 right-6 bottom-16 resize-none bg-transparent outline-none text-sm"
                    placeholder="내용을 입력하세요..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                {/* From */}
                <p className="absolute bottom-14 right-6 text-sm text-right text-gray-600">
                    From. <strong>{senderName}</strong>
                </p>
            </div>

            
        </>
    );
}

export default InviteWritePage;
