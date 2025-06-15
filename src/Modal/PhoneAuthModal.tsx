// src/Modal/PhoneAuthModal.tsx
import { FC, useState } from 'react';
import { useAppDispatch } from '../Utils/hooks';
import axios from 'axios';
import toast from 'react-hot-toast';
import { fetchUser } from '../Utils/userSlice';

interface PhoneAuthModalProps {
  onClose: () => void;
}

const PhoneAuthModal: FC<PhoneAuthModalProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [loading, setLoading] = useState(false);

  const sendSms = async () => {
    if (!/^010\d{7,8}$/.test(phone)) {
      toast.error('올바른 전화번호 형식이 아닙니다.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`https://www.mannamdeliveries.link/api/send-sms`, null, {
        params: { userPhone: phone },
        withCredentials: true,
      });
      toast.success('인증번호가 전송되었습니다.');
      setStep('verify');
    } catch (error) {
      console.log('인증번호 전송 실패', error);
      toast.error('인증번호 전송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    setLoading(true);
    try {
      await axios.post(
        `https://www.mannamdeliveries.link/api/verify-sms`,
        null,
        {
          params: {
            userPhone: phone,
            smsCode: code,
          },
          withCredentials: true,
        }
      );

      toast.success('전화번호 인증이 완료되었습니다.');
      await dispatch(fetchUser());

      setPhone('');
      setCode('');
      setStep('input');

      onClose();
    } catch (error) {
      console.log('인증 확인 실패', error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 400) {
          toast.error('인증번호가 만료되었거나 존재하지 않습니다.');
          setCode('');
          setStep('input');
        } else if (status === 401) {
          toast.error('인증 코드가 일치하지 않습니다.');
        } else {
          toast.error('인증 확인에 실패했습니다.');
        }
      } else {
        toast.error('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 w-full max-w-sm">
      <h2 className="text-xl font-GanwonEduAll_Bold text-center mb-4">
        전화번호 인증
      </h2>
      {step === 'input' && (
        <>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="휴대폰 번호 (- 없이 숫자만)"
            className="w-full p-2 border font-GanwonEduAll_Light rounded mb-3"
            disabled={loading}
          />
          <button
            onClick={sendSms}
            className="w-full bg-blue-500 text-white py-2 rounded font-GanwonEduAll_Bold cursor-pointer"
            disabled={loading}
          >
            {loading ? '전송 중...' : '인증번호 전송'}
          </button>
        </>
      )}
      {step === 'verify' && (
        <>
          <p className="text-sm font-GanwonEduAll_Light text-[#333333]/80 mb-2">
            {phone}로 인증번호로 전송되었습니다.
          </p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="인증번호 입력"
            className="w-full p-2 border rounded mb-3 font-GanwonEduAll_Light"
            disabled={loading}
          />
          <button
            onClick={verifyCode}
            className="w-full bg-green-500 text-white py-2 rounded font-GanwonEduAll_Bold"
            disabled={loading}
          >
            {loading ? '확인 중...' : '인증번호 확인'}
          </button>
        </>
      )}
    </div>
  );
};

export default PhoneAuthModal;
