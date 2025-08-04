import type { JSX } from 'react';
import RegisterModal from './RegisterModal';
import { useModal } from '../../hooks/Modal';
import LoginModal from './LoginModal';
import AddMemberModal from './AddMemberModal';
import CreateProjectModal from './CreateProjectModal';
import AddTaskModal from './AddTaskModal';

export default function ModalContainer(): JSX.Element | null {
  const { modal, modalProps, closeModal } = useModal();

  if (!modal) {return null;}

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgb(0,0,0,0.4)] bg-opacity-40 z-50 p-4">
      {modal === 'login' && <LoginModal onClose={closeModal} />}

      {modal === 'register' && <RegisterModal onClose={closeModal} />}

      {modal === 'createProject' && <CreateProjectModal />}

      {modal === 'addMember' && (
        <AddMemberModal
          onClose={closeModal}
          projectId={modalProps?.projectId as string}
        />
      )}

      {modal === 'addTask' && (
        <AddTaskModal
          onClose={closeModal}
          onTaskCreated={modalProps?.onTaskCreated as () => void}
          projectId={modalProps?.projectId as string}
        />
      )}
    </div>
  );
}
