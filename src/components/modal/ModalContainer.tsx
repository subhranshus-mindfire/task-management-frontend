import type { JSX } from 'react';
import RegisterModal from './RegisterModal';
import { useModal } from '../../hooks/Modal';
import LoginModal from './LoginModal';

export default function ModalContainer(): JSX.Element | null {
  const { modal, closeModal } = useModal();

  if (!modal) { return null; }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgb(0,0,0,0.4)] bg-opacity-40 z-50">
      {modal === 'login' && <LoginModal onClose={closeModal} />}
      {modal === 'register' && <RegisterModal onClose={closeModal} />}
      {modal === 'createProject' && <CreateProjectModal onClose={closeModal} />}
      {modal === 'addMember' && <AddMemberModal onClose={closeModal} />}
    </div>
  );
}
