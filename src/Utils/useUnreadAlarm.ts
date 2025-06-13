import { useState, useEffect } from 'react';
import axios from 'axios';

export const useUnreadAlarm = () => {
  const [isAlarm, setIsAlarm] = useState(false);

  useEffect(() => {
    const checkUnreadAlarms = async () => {
      try {
        const res = await axios.get(
          'https://www.mannamdeliveries.link/api/notification/has-unread',
          { withCredentials: true }
        );
        setIsAlarm(res.data === true);
        console.log('알림 유뮤', res.data);
      } catch (err) {
        console.error('알림 확인 실패:', err);
      }
    };

    checkUnreadAlarms();
  }, []);

  return isAlarm;
};
