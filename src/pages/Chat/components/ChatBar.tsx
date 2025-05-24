import navbg from '../../../assets/img/nav_bg.webp';
import navbg2 from '../../../assets/img/nav_bg2.webp';
import { useState, useEffect, useRef } from 'react';
import plus_icon from '../../../assets/img/icons/ChatIcon/ic_plus.svg';
import arrow_icon from '../../../assets/img/icons/ChatIcon/ic_arrow.svg';
import face_icon from '../../../assets/img/icons/ChatIcon/ic_face.svg';
import questionmark_icon from '../../../assets/img/icons/ChatIcon/ic_questionmark.svg';

import album_icon from '../../../assets/img/icons/ChatIcon/ic_album.svg';
import invite_icon from '../../../assets/img/icons/ChatIcon/ic_invite.svg';
import end_icon from '../../../assets/img/icons/ChatIcon/ic_end.svg';
import report_icon from '../../../assets/img/icons/ChatIcon/ic_report.svg';
import survey_icon from '../../../assets/img/icons/ChatIcon/ic_survey.svg';
import imageCompression from 'browser-image-compression';

type ChatBarProps = {
  onEmojiToggle?: () => void;
  emojiOpen?: boolean;
  onSendMessage?: (message: string, imageUrl?: string) => void;
};

function ChatBar({ onEmojiToggle, emojiOpen, onSendMessage }: ChatBarProps) {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if ((message.trim() || fileInputRef.current?.files?.length) && onSendMessage) {
      onSendMessage(message);
      setMessage('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 이미지 압축 옵션
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true
      };

      // 이미지 압축
      const compressedFile = await imageCompression(file, options);
      
      // 압축된 이미지를 Base64로 변환
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        if (onSendMessage) {
          onSendMessage('', base64data);
        }
      };
    } catch (error) {
      console.error('이미지 압축 중 오류 발생:', error);
    }
  };

  return (
    <>
      {/* 이모지 영역 내부 포함 */}
      <div
        className={`w-full overflow-hidden transition-all duration-300 ease-in-out`}
        style={{
          height: emojiOpen ? 200 : 0,
          backgroundImage: `url(${navbg2})`,
        }}
      >
        <div className="grid grid-cols-4 gap-y-4 px-6 pt-4">
          {[
            { icon: album_icon, label: '앨범', onClick: () => fileInputRef.current?.click() },
            { icon: invite_icon, label: '대면초대장' },
            { icon: end_icon, label: '만남종료' },
            { icon: report_icon, label: '신고' },
            { icon: survey_icon, label: '비대면설문지' },
          ].map(({ icon, label, onClick }, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className="w-12 h-12 rounded-full bg-[#722518] flex items-center justify-center cursor-pointer"
                onClick={onClick}
              >
                <img src={icon} alt={label} className="w-6 h-6" />
              </div>
              <span className="text-white text-xs mt-1 text-center">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div
        className="w-full h-[82px] px-2 flex items-center"
        style={{ backgroundImage: `url(${navbg})` }}
      >
        <div className="flex items-center w-full gap-2">
          {/* 왼쪽 + 버튼 */}
          <button className="w-9 h-9 rounded-full bg-[#A34027] flex items-center justify-center flex-shrink-0" onClick={onEmojiToggle}>
            <img src={plus_icon} alt="plus" className="w-5 h-5" />
          </button>

          {/* 가운데 입력창 (얼굴 아이콘 포함) */}
          <div className="flex items-center flex-1 bg-[#A34027] rounded-full px-3 py-2">
            <input
              type="text"
              placeholder="전할 말 입력"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`flex-1 bg-transparent text-white text-sm placeholder:text-white outline-none`}
            />
            <button>
              <img src={face_icon} alt="face" className="w-5 h-5 ml-2" />
            </button>
          </div>

          {/* 오른쪽 ? 버튼 */}
          <button className="w-9 h-9 rounded-full bg-[#A34027] flex items-center justify-center flex-shrink-0">
            <img src={questionmark_icon} alt="?" className="w-5 h-5" />
          </button>
        
          {/* 오른쪽 전송 버튼 */}
          <button 
            onClick={handleSendMessage}
            className="w-9 h-9 rounded-full bg-[#A34027] flex items-center justify-center flex-shrink-0"
          >
            <img src={arrow_icon} alt="send" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
    </>
  );
}

export default ChatBar;
