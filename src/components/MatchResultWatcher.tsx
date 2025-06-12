import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../Utils/hooks';
import { useLocation } from 'react-router-dom';
import MatchingSuccessModal from '../Modal/MatchingSuccessModal';
import MatchingFailModal from '../Modal/MatchFailModal';
import MatchingFail2Modal from '../Modal/MatchFail2Modal';
import Modal from './Modal';
import { setModalDismissed } from '../Utils/matchingSlice';

const MatchResultWatcher = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.matching.status);
  const successData = useAppSelector((state) => state.matching.successData);
  // const failData = useAppSelector((state) => state.matching.failData);
  const modalDismissed = useAppSelector(
    (state) => state.matching.modalDismissed
  );
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/main') return;

    if (modalDismissed) return;

    if (status === 'success' && successData) {
      setShowModal(true);
    }

    // 시간 초과도 있어서 fail 인것만 확인
    if (status === 'fail' || status === 'fail2') {
      setShowModal(true);
    }
  }, [status, successData, location, modalDismissed]);

  const handleCloseModal = () => {
    dispatch(setModalDismissed(true));
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <>
      {status === 'success' && (
        <Modal isOpen={showModal} onClose={handleCloseModal}>
          <MatchingSuccessModal onClose={handleCloseModal} />
        </Modal>
      )}
      {status === 'fail' && (
        <Modal isOpen={showModal} onClose={handleCloseModal}>
          <MatchingFailModal onClose={handleCloseModal} />
        </Modal>
      )}
      {status === 'fail2' && (
        <Modal isOpen={showModal} onClose={handleCloseModal}>
          <MatchingFail2Modal onClose={handleCloseModal} />
        </Modal>
      )}
    </>
  );
};

export default MatchResultWatcher;
