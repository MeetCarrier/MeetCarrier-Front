import { useEffect, useState } from 'react';
import { useAppSelector } from '../Utils/hooks';
import { useLocation } from 'react-router-dom';
import MatchingSuccessModal from '../Modal/MatchingSuccessModal';
import MatchingFailModal from '../Modal/MatchFailModal';
import Modal from './Modal';

const MatchResultWatcher = () => {
  const status = useAppSelector((state) => state.matching.status);
  const successData = useAppSelector((state) => state.matching.successData);
  // const failData = useAppSelector((state) => state.matching.failData);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/main') return;

    if (status === 'success' && successData) {
      setShowModal(true);
    }

    // 시간 초과도 있어서 fail 인것만 확인
    if (status === 'fail') {
      setShowModal(true);
    }
  }, [status, successData, location]);

  if (!showModal) return null;

  return (
    <>
      {status === 'success' && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <MatchingSuccessModal onClose={() => setShowModal(false)} />
        </Modal>
      )}
      {status === 'fail' && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <MatchingFailModal onClose={() => setShowModal(false)} />
        </Modal>
      )}
    </>
  );
};

export default MatchResultWatcher;
